"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";

export const NavbarRoutes = () => {
    const pathname = usePathname();
    const {userId} = useAuth();
    // const router = useRouter();

    const isTeacherPage = pathname.includes("/teacher");
    const isPlayerPage = pathname.includes("/courses");
    const isSearchPage = pathname === "/search"


    return (
        <>
        {isSearchPage && (
            <div className="hidden md:block">
                <SearchInput />
            </div>
        )}
        <div className="flex gap-x-2 ml-auto">
            {isTeacherPage || isPlayerPage ? (
                <Link href="/">
                    <Button size="sm" variant="ghost">
                        <LogOut className="h-4 w-4 mr-2" />
                        Çıkış
                    </Button>
                </Link>
            ) : isTeacher(userId) ? (
                <Link href="/teacher/courses">
                    <Button size="sm" variant="ghost">
                        Öğretmen Modu
                    </Button>
                </Link>
            ) : null}
            <UserButton
                afterSignOutUrl="/"
            />
        </div>
        </>
    )
}