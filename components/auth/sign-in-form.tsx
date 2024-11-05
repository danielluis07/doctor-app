"use client";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
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
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { login } from "@/actions/login";
import { toast } from "sonner";

const logInSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(1, "É necessário informar um email"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type FormData = z.infer<typeof logInSchema>;

// TO DO: Add two factor authentication

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState<string | boolean>(false);
  //const searchParams = useSearchParams();
  //const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(logInSchema),
    defaultValues: {
      email: "",
      password: "",
      // code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof logInSchema>) => {
    startTransition(() => {
      login(values)
        .then((response) => {
          if (!response?.success) {
            toast.error(response?.message);
          }

          if (response?.success) {
            router.push("/dashboard");
          }
        })
        .catch(() => toast.error("Algo deu Errado!"));
    });
  };

  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
      <div className="mb-8 space-y-1">
        <h2 className="text-2xl font-bold text-center">Log In!</h2>
        <h3 className="text-gray-300 text-center">Preencha seus dados</h3>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
          <div className="space-y-7">
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem className="relative">
                    <FormLabel
                      className={cn(
                        "ml-3 absolute transition-all text-slate-300",
                        field.value
                          ? "-top-5 text-sm bg-milky text-sky-400"
                          : "top-1/2 transform -translate-y-1/2 text-base"
                      )}>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        value={field.value ?? ""}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-sky-400"
                        type="email"
                        onBlur={() => form.trigger("email")}
                      />
                    </FormControl>
                    {fieldState.error && ( // Display error message if there is an error
                      <FormMessage className="text-red-500 absolute top-8">
                        {fieldState.error.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem className="relative">
                    <FormLabel
                      className={cn(
                        "ml-3 absolute transition-all text-slate-300",
                        field.value
                          ? "-top-5 text-sm bg-milky text-sky-400"
                          : "top-1/2 transform -translate-y-1/2 text-base"
                      )}>
                      Senha
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        value={field.value ?? ""}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-sky-400"
                        type={cn(showPassword ? "text" : "password")}
                        onBlur={() => form.trigger("password")}
                      />
                    </FormControl>
                    <div
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-[0.5px] cursor-pointer">
                      {showPassword ? (
                        <EyeOff className="text-lg" />
                      ) : (
                        <Eye className="text-lg" />
                      )}
                    </div>

                    {fieldState.error && (
                      <FormMessage className="text-red-500 absolute top-8">
                        {fieldState.error.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              Entrar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
