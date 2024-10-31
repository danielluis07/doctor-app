"use client";

import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUpdateDoctor } from "@/queries/doctors/use-update-doctor";
import { UserDoctor } from "@/queries/doctors/get-doctor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const specialties = [
  "Cardiologista",
  "Pediatra",
  "Dermatologista",
  "Ortopedista",
  "Neurologista",
  "Ginecologista / Obstetra",
  "Oftalmologista",
  "Oncologista",
  "Psiquiatra",
  "Endocrinologista",
  "Gastroenterologista",
  "Nefrologista",
  "Urologista",
  "Reumatologista",
  "Pneumologista",
  "Hematologista",
  "Infectologista",
  "Otorrinolaringologista",
  "Radiologista",
  "Cirurgião Geral",
  "Anestesiologista",
  "Médico do Trabalho",
  "Médico de Família",
  "Geriatra",
  "Nutrólogo",
  "Angiologista",
  "Cirurgião Plástico",
  "Patologista",
  "Imunologista",
  "Mastologista",
  "Hepatologista",
  "Coloproctologista",
  "Geneticista",
  "Neonatologista",
  "Otoneurologista",
  "Homeopata",
  "Emergencista",
  "Medicina Esportiva",
  "Foniatra",
];

const doctorSchema = z.object({
  bio: z.string().optional().nullable(),
  cfm: z.string().optional().nullable(),
  doctor_office: z.string().max(255).optional().nullable(),
  gender: z.enum(["MALE", "FEMALE"]).optional().nullable(),
  education: z.string().max(255).optional().nullable(),
  price: z.string().max(255).optional().nullable(),
  specialty: z.string().max(255).optional().nullable(),
});

type FormData = z.infer<typeof doctorSchema>;

export const Profile = ({
  data,
  id,
}: {
  data: UserDoctor;
  id: string | undefined;
}) => {
  const updateDoctorMutation = useUpdateDoctor(id);

  const form = useForm<FormData>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      bio: data?.doctor?.bio ?? "",
      cfm: data?.doctor?.cfm ?? "",
      gender: data?.doctor?.gender ?? "MALE",
      doctor_office: data?.doctor?.doctor_office ?? "",
      education: data?.doctor?.education ?? "",
      price: data?.doctor?.price ?? "",
      specialty: data?.doctor?.specialty ?? "",
    },
  });

  const onSubmit = (values: FormData) => {
    updateDoctorMutation.mutate(values);
  };

  const onInvalid = (errors: any) => {
    console.log(errors);
  };

  return (
    <div className="min-h-screen flex flex-row gap-x-32">
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
            <div className="flex flex-col">
              <div className="mt-8 lg:mt-0">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Resumo</FormLabel>
                        <FormControl>
                          <Textarea
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-sky-400 focus:border-sky-400"
                            {...field}
                            rows={5}
                            disabled={updateDoctorMutation.isPending}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Educação</FormLabel>
                        <FormControl>
                          <Input
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-sky-400 focus:border-sky-400"
                            {...field}
                            disabled={updateDoctorMutation.isPending}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cfm"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          CFM (Conselho Federal de Medicina)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            disabled={updateDoctorMutation.isPending}
                            className="mt-1 block w-full p-3"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Gênero</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value ?? undefined}
                            disabled={updateDoctorMutation.isPending}
                            className="flex flex-col space-y-1">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="MALE" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Masculino
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="FEMALE" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Feminino
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="doctor_office"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Clínica</FormLabel>
                        <FormControl>
                          <Input
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            {...field}
                            disabled={updateDoctorMutation.isPending}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Especialidade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue="">
                          <FormControl>
                            <SelectTrigger
                              className={
                                !field.value
                                  ? "text-slate-300 font-semibold border-gray-300"
                                  : ""
                              }>
                              <SelectValue placeholder="Defina sua especialidade"></SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {specialties.map((state, index) => (
                              <SelectItem
                                key={index}
                                value={state}
                                className="font-normal cursor-pointer">
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Preço por consulta</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            disabled={updateDoctorMutation.isPending}
                            className="mt-1 block w-full p-3"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div>
                    <Button
                      type="submit"
                      disabled={updateDoctorMutation.isPending}>
                      Salvar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
