"use client";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import placeholder from "@/public/placeholder-logo.jpg";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UploadImage } from "@/components/uploadImage";
import { X } from "lucide-react";
import { User } from "@/queries/users/get-user";
import { useTransition } from "react";
import { updateUser } from "@/actions/update-user";
import { toast } from "sonner";

const updateUserSchema = z.object({
  image: z.string().optional(),
  name: z.string().min(1, "É necessário informar um nome"),
  email: z
    .string()
    .email("Email inválido")
    .min(1, "É necessário informar um email"),
  currentPassword: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
  newPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type FormData = z.infer<typeof updateUserSchema>;

type Props = {
  user: User;
};

export const Settings = ({ user }: Props) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name ?? "",
      email: user.email ?? "",
      currentPassword: "",
      newPassword: "",
      image: user.image ?? "",
    },
  });

  const onSubmit = async (values: FormData) => {
    console.log(values);
    startTransition(() => {
      updateUser(values)
        .then((response) => {
          if (!response?.success) {
            toast.error(response?.message);
          }

          if (response?.success) {
            toast.success("Usuário atualizado com sucesso!");
          }
        })
        .catch(() => toast.error("Algo deu Errado!"));
    });
  };

  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  return (
    <Form {...form}>
      <h1 className="text-xl font-bold mb-8">Suas informações de usuário</h1>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-lg overflow-hidden">
            {form.watch("image") !== "" && (
              <div
                onClick={() => form.setValue("image", "")}
                className="absolute top-0 right-0 cursor-pointer z-30 bg-red-500 rounded-full">
                <X className="text-white text-2xl" />
              </div>
            )}
            <Image
              src={form.watch("image") || placeholder}
              alt="user placeholder"
              fill
            />
          </div>
          <FormField
            control={form.control}
            name="image"
            render={({}) => (
              <FormItem>
                <FormControl>
                  <UploadImage
                    onChange={(url) => {
                      form.setValue("image", url);
                    }}
                    onRemove={() => {
                      form.setValue("image", "");
                    }}
                    image={form.watch("image")}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="John"
                  {...field}
                  className="w-2/6"
                  disabled={isPending}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@domain.com"
                  {...field}
                  className="w-2/6"
                  value={field.value ?? ""}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha Atual</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  className="w-2/6"
                  value={field.value ?? ""}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha Nova</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  className="w-2/6"
                  value={field.value ?? ""}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={isPending || !form.formState.isDirty}>
          Salvar Mudanças
        </Button>
      </form>
    </Form>
  );
};
