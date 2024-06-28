"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { title } from "process";
import Link from "next/link";


const formSchema = z.object({
    title: z.string().min(1, {
        message: "Başlık boş olamaz.",
    }),
});

const CreatePage = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onsubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            const response = await axios.post("/api/courses", values);
            router.push(`/teacher/courses/${response.data.id}`);
            toast.success("Kurs oluşturuldu!");
        } catch {
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
            
        }
    };

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">
                    Kursunuza bir başlık verin.
                </h1>
                <p className="text-sm text-slate-600">
                    Kursunuza ne isim vermek istersiniz? Merak etmeyin, bunu daha sonra değiştirebilirsiniz.
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onsubmit)}
                        className="space-y-8 mt-8"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Kurs başlığı
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="örn. Diksiyon ve Hitabet Eğitimi"
                                            {...field}
                                    />
                                    </FormControl>
                                    <FormDescription>
                                        Bu kursta ne öğretmeyi düşünüyorsunuz?
                                    </FormDescription>
                                    <FormMessage/>
                                        {form.formState.errors.title?.message}
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Link href="/">
                                <Button 
                                type="button"
                                variant="ghost"
                                >
                                    İptal
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                            >
                                Devam
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default CreatePage;