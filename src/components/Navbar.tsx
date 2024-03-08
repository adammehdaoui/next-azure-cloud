"use client";

import DeconnectionButton from "@/components/DeconnectionButton";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { toast } from "sonner";

export default function Navbar() {
  const pathname = usePathname();

  function handleClickDashboard() {
    if (pathname === "/") {
      toast.error("Vous devez être connecté pour accéder à cette page");
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <nav className="fixed top-0 bg-white w-full p-8 shadow-md flex justify-between">
      <ul className="flex space-x-10 ml-10 items-center">
        <li>
          <Link href="/">
            <Image
              src="/favicon_io/apple-touch-icon.png"
              alt="Logo"
              width={50}
              height={50}
            />
          </Link>
        </li>
        <li className="text-xl">
          <Link href="/">Home</Link>
        </li>
        <li className="text-xl">
          <button onClick={handleClickDashboard}>Dashboard</button>
        </li>
      </ul>
      {pathname != "/" && (
        <div className="-mt-3">
          <DeconnectionButton />
        </div>
      )}
    </nav>
  );
}
