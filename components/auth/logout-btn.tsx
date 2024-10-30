"use client";

import { Button } from "../ui/button";
import { logOut } from "@/actions/logout";
import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ExitModal } from "@/modals/exit-modal";

export const LogoutBtn = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const onClick = () => {
    startTransition(() => {
      logOut()
        .then(() => {
          router.push("/");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Failed to log out.");
        });
    });
  };
  return (
    <>
      <ExitModal exited={isPending} />
      <Button
        onClick={onClick}
        variant="destructive"
        className="space-x-2 my-2 w-full">
        <LogOut className="text-lg text-white" />
        <span>Log out</span>
      </Button>
    </>
  );
};
