"use client"

import ReactConfetti from "react-confetti"

import { useConfettiStore } from "@/hooks/use-fonfetti-store"

export const ConfettiProvider = () => {
    const confetti = useConfettiStore();

    if (!confetti.isOpen) {
        return null;
    }

    return (
        <ReactConfetti 
        className="pointer-events-none"
        numberOfPieces={500}
        recycle={false}
        onConfettiComplete={() => {
            confetti.onClose();
        }}
        />
    )
}