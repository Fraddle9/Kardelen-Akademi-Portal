import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const { courseId, assignToUserId } = await req.json();

        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!courseId || !assignToUserId) {
            return new NextResponse("Missing courseId or assignToUserId", { status: 400 });
        }

        const course = await db.course.findUnique({
            where: { id: courseId, isPublished: true },
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        const existingAssignment = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: assignToUserId,
                    courseId,
                }
            }
        });

        if (existingAssignment) {
            return new NextResponse("Course already assigned", { status: 400 });
        }

        const assignment = await db.purchase.create({
            data: {
                userId: assignToUserId,
                courseId,
            },
        });

        return NextResponse.json(assignment);
    } catch (error) {
        console.log("[ASSIGN_COURSE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}