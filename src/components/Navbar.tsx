"use client";

import DeconnectionButton from "@/components/DeconnectionButton";
import DynamicDeconnectionButton from "@/components/DynamicDeconnectionButton";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  return (
    <div className="font-semibold text-yellow-500">
      <nav className="fixed top-0 bg-white w-full p-8 shadow-md flex justify-between">
        <ul className="flex ml-3 items-center">
          <li className="w-28">
            <Link href="/">
              <Image
                src="/favicon_io/apple-touch-icon.png"
                alt="Logo"
                width={50}
                height={50}
                priority={true}
              />
            </Link>
          </li>
          <li className="text-xl hidden sm:block">
            <Link href="/dashboard">Dashboard</Link>
          </li>
        </ul>
        {pathname != "/" && (
          <div className="-mt-3">
            <DeconnectionButton isMenuOpen={isMenuOpen} />
          </div>
        )}
        <>
          <button onClick={toggleMenu} className="sm:hidden">
            <RxHamburgerMenu className="text-3xl mt-3 mr-3" />
          </button>
        </>
      </nav>
      {isMenuOpen && (
        <div className="flex flex-col mt-28 pb-10 bg-white items-center shadow-md w-full">
          <Link href="/dashboard" className="text-xl mt-10">
            Dashboard
          </Link>
          <>{pathname != "/" && <DynamicDeconnectionButton />}</>
        </div>
      )}
    </div>
  );
}
