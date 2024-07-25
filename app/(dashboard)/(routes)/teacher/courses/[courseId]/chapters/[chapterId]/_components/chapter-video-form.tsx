"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ChapterVideoFormProps {
    initialData: { videoUrl?: string | null };
    courseId: string;
    chapterId: string;
};

const formSchema = z.object({
    videoUrl: z.string().url().min(1),
});

export const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId,
}: ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: { videoUrl: initialData.videoUrl || "" },
        resolver: zodResolver(formSchema),
    });

    const { isSubmitting, isValid } = form.formState;

    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const videoId = extractVideoId(values.videoUrl);
            const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : "";
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, { videoUrl: embedUrl });
            toast.success("Video Başarıyla Yüklendi!");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Bir hata oluştu.");
        }
    };

    const extractVideoId = (url: string): string | null => {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:v\/|embed\/|watch\?v=|watch\?.+?v=|watch\?v%3D|watch\?v%3D|watch%3Fv%3D|watch%3Fv%3D)([^\s&]+)/);
        return match ? match[1] : null;
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Bölüm Videosu
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing ? (
                        <>İptal</>
                    ) : !initialData.videoUrl ? (
                        <>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Video Yükle
                        </>
                    ) : (
                        <>
                            <Pencil className="w-4 h-4 mr-2" />
                            Video Düzenle
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && !initialData.videoUrl ? (
                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                    <VideoIcon className="h-10 w-10 text-slate-500" />
                </div>
            ) : (
                !isEditing && initialData.videoUrl && (
                    <div className="relative aspect-video mt-2">
                        <iframe
                            title="Video Player"
                            src={initialData.videoUrl}
                            frameBorder="0"
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="videoUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="YouTube video URL"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={!isValid || isSubmitting} type="submit">
                                Kaydet
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">
                    Videonun yüklenmesi biraz zaman alabilir. Lütfen bekleyin.
                    Bekledikten sonra video gözükmüyorsa, lütfen sayfayı yenileyin.
                </div>
            )}
        </div>
    );
}
