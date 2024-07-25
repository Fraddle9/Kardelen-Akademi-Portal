import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// DELETE handler
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

        // Delete chapter record
        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId,
            }
        });

        // Check if there are any other published chapters
        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            }
        });

        // Update course publication status
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
        console.log("Chapter_Delete_Error", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// PATCH handler
export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string; }; }
) {
    try {
        const { userId } = auth();
        const { isPublished, videoUrl, ...values } = await req.json();

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

        // Update chapter details
        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                ...values,
                videoUrl: videoUrl ? videoUrl : undefined,
            }
        });

        return NextResponse.json(chapter);

    } catch (error) {
        console.log("Chapter_Update_Error", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
