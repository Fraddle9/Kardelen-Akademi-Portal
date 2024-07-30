'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@clerk/nextjs";
import { isTeacher } from "@/lib/teacher";
import AssignCourseForm from '@/components/assign-course-form';

const AdminPanel = () => {
    const { userId, isSignedIn } = useAuth();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (!isSignedIn) {

            router.push("/");

        } else if (userId && isTeacher(userId)) {

            setAuthorized(true);

        } else {

            router.push("/");

        }
    }, [userId, isSignedIn, router]);

    if (!authorized) {
        return null;
    }

    return (
        <div className='flex flex-col items-start'>
            <div className='ml-10'>
                <h1 className='text-lg font-bold center'>
                    Öğrenci Atama Formu
                </h1>
            </div>

            <div className='flex items-center'>
                <AssignCourseForm />
            </div>

        </div>
    );
}

export default AdminPanel;
