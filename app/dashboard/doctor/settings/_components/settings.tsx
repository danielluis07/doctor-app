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
import { insertUserSchema } from "@/db/schema";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUser } from "@/queries/users/use-get-user";
import { useEffect } from "react";
import { useUpdateUser } from "@/queries/users/use-update-user";
import { UploadImage } from "@/components/uploadImage";
import { X } from "lucide-react";

const userSchema = insertUserSchema.pick({
  name: true,
  address: true,
  address2: true,
  city: true,
  state: true,
  email: true,
  postalCode: true,
  password: true,
  phone: true,
  image: true,
});

type FormData = z.infer<typeof userSchema>;

export const Settings = () => {
  const { data } = useSession();
  const userQuery = useGetUser(data?.user.id);
  const user = userQuery.data;
  const updateUserMutation = useUpdateUser(data?.user.id);

  const form = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name ?? "",
      address: user?.address ?? "",
      address2: user?.address2 ?? "",
      city: user?.city ?? "",
      password: user?.password ?? "",
      state: user?.state ?? "",
      postalCode: user?.postalCode ?? "",
      phone: user?.phone ?? "",
      image: user?.image,
    },
  });

  const onSubmit = async (values: FormData) => {
    updateUserMutation.mutate(values);
  };

  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  useEffect(() => {
    if (userQuery.data) {
      form.reset(userQuery.data);
    }
  }, [userQuery.data]);

  if (userQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-lg overflow-hidden">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
          <Skeleton className="w-full sm:w-auto h-10" />
        </div>

        <div className="space-y-4">
          <div>
            <Skeleton className="h-5 w-1/3 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-5 w-1/3 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-5 w-1/3 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-5 w-1/3 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <Skeleton className="w-full sm:w-auto h-10" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-lg overflow-hidden">
            {form.watch("image") !== null && (
              <div
                onClick={() => form.setValue("image", null)}
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
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <UploadImage
                    onChange={(url) => {
                      form.setValue("image", url);
                    }}
                    onRemove={() => form.setValue("image", null)}
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John"
                  {...field}
                  className="w-full"
                  disabled={updateUserMutation.isPending}
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
                  className="w-full"
                  value={field.value ?? ""}
                  disabled={updateUserMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  className="w-full"
                  value={field.value ?? ""}
                  disabled={updateUserMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={updateUserMutation.isPending}>
          Save Changes
        </Button>
      </form>
    </Form>
  );
};
