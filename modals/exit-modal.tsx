"use client";

import { BeatLoader } from "react-spinners";

type ExitModalProps = {
  exited: boolean;
};

export const ExitModal = ({ exited }: ExitModalProps) => {
  if (!exited) return null;

  return (
    <div className="fixed flex justify-center items-center h-full inset-0 z-50 bg-black/80">
      <BeatLoader color="#2563EB" />
    </div>
  );
};
