"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const SearchDialog = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("q", searchQuery);
    router.push(`/dashboard/patient/doctors/search?${params.toString()}`);
  };

  return (
    <Dialog>
      <DialogTrigger className="flex items-center justify-center gap-3 text-slate-700 border border-slate-700 px-3 md:px-4 py-2 rounded">
        <Search />
        Encontre um médico
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Encontre um médico</DialogTitle>
        <DialogDescription>Descrição</DialogDescription>
        <form onSubmit={handleSubmit} className="relative">
          <Input
            onChange={handleSearchChange}
            className="h-12"
            value={searchQuery}
          />
          <button>
            <Search className="absolute right-3 top-3" />
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
