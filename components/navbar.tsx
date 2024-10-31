"use client";

import Image from "next/image";
import Link from "next/link";
import placeholder from "@/public/placeholder-logo.jpg";
// import { Notifications } from "./notifications";
import { ExtendedUser } from "@/next-auth";
import { SidebarTrigger } from "./ui/sidebar";
import { Bell, Moon, Settings, Sun } from "lucide-react";

type NavbarProps = {
  user: ExtendedUser;
};

export const Navbar = ({ user }: NavbarProps) => {
  const isDarkMode = false;
  let role;

  if (user.role === "ADMIN") {
    role = "admin";
  } else if (user.role === "DOCTOR") {
    role = "doctor";
  } else {
    role = "patient";
  }

  return (
    <div className="flex justify-between items-center w-full mb-7">
      {/* LEFT SIDE */}
      <SidebarTrigger />

      {/* RIGHT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <div className="hidden md:flex justify-between items-center gap-5">
          <div className="h-6">
            <button onClick={() => {}}>
              {isDarkMode ? (
                <Sun className="cursor-pointer text-gray-500" size={24} />
              ) : (
                <Moon className="cursor-pointer text-gray-500" size={24} />
              )}
            </button>
          </div>
          {/* <Notifications /> */}
          <Bell />
          <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-3" />
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="relative size-10">
              <Image
                src={user?.image || placeholder}
                alt="Profile"
                fill
                sizes="200px"
                className="rounded-full h-full object-cover"
              />
            </div>
            <span className="font-semibold">{user?.name}</span>
          </div>
        </div>
        <Link href={`/dashboard/${role}/settings`}>
          <Settings className="cursor-pointer text-gray-500" size={24} />
        </Link>
      </div>
    </div>
  );
};
