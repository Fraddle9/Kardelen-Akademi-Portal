"use client"

import { 
    AlertDialog,
    AlertDialogContent,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTrigger

 } from "@/components/ui/alert-dialog"

 interface ConfirmModalProps {
    children: React.ReactNode;
    onConfirm: () => void;
 }

 export const ConfirmModal = ({
    children,
    onConfirm
 }: ConfirmModalProps) => {
    return(
        <AlertDialog>
            <AlertDialogTrigger asChild>
            {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Emin Misiniz?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bu işlem geri alınamaz.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={onConfirm}>
                            Continue
                        </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
 }