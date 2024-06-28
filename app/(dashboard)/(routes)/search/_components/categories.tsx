"use client"

import { Category } from "@prisma/client";

import {
    FcMultipleDevices,
    FcMusic,
    FcOldTimeCamera,
    FcSalesPerformance,
    FcSportsMode,
    FcBusinessman,
    FcBusinesswoman,
    FcBookmark,
    FcGraduationCap,
} from "react-icons/fc";

import { IconType } from "react-icons";
import { CategoryItem } from "./category-item";

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    "Müzik": FcMusic,
    "Koçluk": FcGraduationCap,
    "Sekreterlik": FcBusinesswoman,
    "Fitness": FcSportsMode,
    "Tasarım": FcOldTimeCamera,
    "Yazılım": FcMultipleDevices,
    "Muhasebe": FcSalesPerformance,
    "Kişisel Gelişim": FcBusinessman,
    "Yabancı Dil": FcBookmark,
}

export const Categories = ({
    items,
}: CategoriesProps) => {
    
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((item) => (
                <CategoryItem
                key={item.id}
                label={item.name}
                icon={iconMap[item.name]}
                value={item.id}
                />
           ))}
            
        </div>
    )
}