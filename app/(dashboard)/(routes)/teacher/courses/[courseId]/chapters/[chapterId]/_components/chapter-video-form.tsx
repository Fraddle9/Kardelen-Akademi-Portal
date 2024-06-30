"use client";

import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle, VideoIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Chapter, Course, MuxData } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null};
    courseId: string;
    chapterId: string;
};

const formSchema = z.object({
    videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId,
}: ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Video Başarıyla Yüklendi!");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Bir hata oluştu.");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Bölüm Videosu
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing && (
                        <>İptal</>
                    )}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Video Yükle
                        </>
                    
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                            <Pencil className="w-4 h-4 mr-2" />
                            Video Düzenle
                        </>
                    )}
                        

                </Button>
            </div>
            {!isEditing && (
              !initialData.videoUrl ? (
                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                    <VideoIcon className="h-10 w-10 text-slate-500" />
                </div>
              ) : (
                <div className="relative aspect-video mt-2">
                    <MuxPlayer
                    playbackId={initialData.muxData?.playbackId || ""}
                    />
                </div>
              )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                    endpoint="chapterVideo"
                    onChange={(url) => {
                        if (url){
                            onSubmit({ videoUrl: url });
                        }    
                        }
                    }
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                    Bu bölümün videosunu yükleyin.
                    </div>
                </div>
                )}
                {initialData.videoUrl && !isEditing && (
                    <div className="text-xd text-muted-foreground mt-2">
                        Videonun yüklenmesi biraz zaman alabilir. Lütfen bekleyin.
                        Bekledikten sonra video gözükmüyorsa, lütfen sayfayı yenileyin.
                    </div>
                )}
        </div>
    );
}