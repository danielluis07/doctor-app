"use client";

import { UploadButton } from "@/lib/uploadthing";
import { Image } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

type UploadImageProps = {
  onChange: (url?: string, name?: string) => void;
  onRemove: (url?: string) => void;
  image: string | null | undefined;
};

export const UploadImage = ({ onChange, image }: UploadImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null | undefined>(image);

  return (
    <div>
      <UploadButton
        className={cn(
          image !== null && "pointer-events-none opacity-30",
          "ut-button:w-56 ut-allowed-content:hidden pb-2"
        )}
        endpoint="imageUploader"
        content={{
          button({ ready }) {
            if (ready) {
              return (
                <div className="flex items-center gap-x-1">
                  <Image className="text-lg" />
                  <p className="text-sm">
                    {image !== null
                      ? "Imagem selecionada"
                      : "Insira uma imagem"}
                  </p>
                </div>
              );
            }
          },
        }}
        onClientUploadComplete={(res) => {
          const url = res?.[0].url;
          setImageUrl(url);
          onChange(url);
        }}
        onUploadError={(error: Error) => {
          toast.error(`${error?.message}`);
        }}
      />
      <p className="text-[10px] text-gray-400">
        Essa será a imagem tema do post
      </p>
    </div>
  );
};
