"use client"

import { on } from "events";
import Image from "next/image";
import { useRouter } from "next/navigation"

export const Logo = () => {

  const router = useRouter();

  const onClick = () => {
    router.push("/");
  }

  return (
    <div className="flex items-center">
      <button
      onClick={onClick}
      >
      <Image
        src="/logo.svg"
        alt="logo"
        width={130}
        height={130}
        className="object-contain"
      />
      </button>
    </div>
  );
}