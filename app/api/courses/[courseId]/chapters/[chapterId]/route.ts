import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET
});

async function checkIfMuxAssetExists(assetId: string): Promise<boolean> {
    try {
        const asset = await mux.video.assets.retrieve(assetId);
        return !!asset;  // If the asset is found, return true
    } catch (error: any) {
        if (error.status === 404) {
            return false;  // If the asset is not found, return false
        }
        throw error;  // If there is any other error, rethrow it
    }
}

async function waitForMuxProcessing(assetId: string): Promise<void> {
    const checkInterval = 5000; // 5 seconds
    const maxChecks = 60; // Check for up to 5 minutes

    for (let i = 0; i < maxChecks; i++) {
        const asset = await mux.video.assets.retrieve(assetId);
        if (asset.status === 'ready') {
            return;
        }
        await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
    throw new Error('Mux processing timed out');
}

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string; }; }
) {
    try {
        const { userId } = auth();


        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            }
        });

        if (!chapter) {
            return new NextResponse("Not Found", { status: 404 });
        }

        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,
                }
            });

            if (existingMuxData) {
                const assetExists = await checkIfMuxAssetExists(existingMuxData.assetId);
                if (assetExists) {
                    await mux.video.assets.delete(existingMuxData.assetId);
                }
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                });
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId,
            }
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            }
        });

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false,
                }
            });
        }

        return NextResponse.json(deletedChapter);

    } catch (error) {
        console.log("Chapter_Id_Delete", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string; }; }
) {
    try {
        const { userId } = auth();
        const { isPublished, ...values } = await req.json();
        const utapi = new UTApi();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                ...values,
            }
        });

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,
                }
            });

            if (existingMuxData) {
                const assetExists = await checkIfMuxAssetExists(existingMuxData.assetId);
                if (assetExists) {
                    await mux.video.assets.delete(existingMuxData.assetId);
                }
                
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                });
            }

            const asset = await mux.video.assets.create({ //burda MUXA ekliyo
                input: values.videoUrl,
                playback_policy: ['public'],
            });

            await waitForMuxProcessing(asset.id); // wait until mux has finished processing the asset

            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id ?? '',
                }
            }); //Burda DB ekliyor ve bitiyor ekleme işlemi.


            const fileId = values.videoUrl.split('/f/')[1];

            await utapi.deleteFiles([ //Video muxa yüklendikten sonra uploadthingden sil
                fileId
            ]);
        }

        return NextResponse.json(chapter);

    } catch (error) {
        console.log("Chapter_Id", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}