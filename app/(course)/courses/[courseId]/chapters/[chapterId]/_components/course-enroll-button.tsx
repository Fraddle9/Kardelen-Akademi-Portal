"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
    price: number;
    courseId: string;
}

export const CourseEnrollButton = ({
    courseId
}: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onClick = async () => {
        try {
            setIsLoading(true);
            router.push(`https://kardelenakademi.com/iletisim/`)


        } catch (error) {
            toast.error("Bir hata oluştu.")
        } finally {
            setIsLoading(false);
    }
}
    return (
        <Button
        onClick={onClick}
        disabled={isLoading}
        size="sm"
        className="w-full md:w-auto">
            Kursa Kaydolmak İçin Tıklayın!
        </Button>
    )
}