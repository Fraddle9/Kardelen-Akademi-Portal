"use client";

import { BarChart, Compass, Layout, List, Settings } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
    {
        icon: Layout,
        label: "Panelim",
        href: "/"
    },
    {
        icon: Compass,
        label: "Arama",
        href: "/search",
    }
];

const teacherRoutes = [
    {
        icon: List,
        label: "Kurslarım",
        href: "/teacher/courses",
    },
    {
        icon: BarChart,
        label: "Analitikler",
        href: "/teacher/analytics",
    },
    {
        icon: Settings,
        label: "Admin Paneli",
        href: "/teacher/panel",
    }
];

export const SidebarRoutes = () => {
    const pathname = usePathname();

    const isTeacherPage = pathname?.includes("/teacher");

    const routes = isTeacherPage ? teacherRoutes : guestRoutes;
    
    return (
        <div className="flex flex-col w-full">
            {routes!.map((route) => (
                <SidebarItem
                key={route.href}
                icon={route.icon}
                label={route.label}
                href={route.href}
            />
        ))}
        </div>
    )
}
