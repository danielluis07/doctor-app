"use client";

import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { insertPatientSchema } from "@/db/schema";
import { Patient } from "@/queries/patients/get-patient";
import { useUpdatePatient } from "@/queries/patients/use-update-patient";
import { format, parse } from "date-fns";

type FormData = z.infer<typeof insertPatientSchema>;

export const Profile = ({
  data,
  id,
}: {
  data: Patient;
  id: string | undefined;
}) => {
  const updatePatientMutation = useUpdatePatient(id);

  const form = useForm<FormData>({
    resolver: zodResolver(insertPatientSchema),
    defaultValues: {
      id: data.patient?.id,
      userId: id,
      alergies: data.patient?.alergies || "",
      dateOfBirth: data.patient?.dateOfBirth || "",
      familyHistory: data.patient?.familyHistory || "",
      vaccine: data.patient?.vaccine || "",
      lifeStyle: data.patient?.lifeStyle || "",
      gender: "MALE",
      medicalHistory: data.patient?.medicalHistory || "",
      medicine: data.patient?.medicine || "",
    },
  });

  const formatDate = (value: string) => {
    const cleanedValue = value.replace(/\D/g, "");

    if (cleanedValue.length >= 8) {
      const parsedDate = parse(cleanedValue, "ddMMyyyy", new Date());
      return format(parsedDate, "dd/MM/yyyy");
    }
    return value;
  };

  const onSubmit = (values: FormData) => {
    let date = "";
    if (values.dateOfBirth) {
      const parsedDate = parse(values.dateOfBirth, "dd/MM/yyyy", new Date());
      const formattedDate = format(parsedDate, "yyyy-MM-dd");
      date = formattedDate;
    }

    const submissionData = {
      ...values,
      dateOfBirth: date,
    };

    updatePatientMutation.mutate(submissionData);
  };

  const onInvalid = (errors: FieldErrors) => {
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
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Gênero</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value ?? undefined}
                            disabled={updatePatientMutation.isPending}
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
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Data de nascimento</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="Ex: 27/05/1997"
                            disabled={updatePatientMutation.isPending}
                            onChange={(e) => {
                              const formattedDate = formatDate(e.target.value);
                              field.onChange(formattedDate);
                            }}
                            className="mt-1 block w-full p-3"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicalHistory"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Histórico médico</FormLabel>
                        <FormDescription>
                          Fale um pouco sobre você. Já realizou alguma cirurgia
                          ou foi internado? Já teve algum problema de saúde
                          anteriormente? Você tem alguma condição médica crônica
                          (como diabetes, hipertensão)?
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-sky-400 focus:border-sky-400"
                            {...field}
                            rows={5}
                            disabled={updatePatientMutation.isPending}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="familyHistory"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Histórico familiar</FormLabel>
                        <FormDescription>
                          Você possui algum histórico familiar de doenças?
                          Quais?
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-sky-400 focus:border-sky-400"
                            {...field}
                            rows={5}
                            disabled={updatePatientMutation.isPending}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicine"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Medicamentos</FormLabel>
                        <FormDescription>
                          Toma algum medicamento? Qual?
                        </FormDescription>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            disabled={updatePatientMutation.isPending}
                            className="mt-1 block w-full p-3"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lifeStyle"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Estilo de vida</FormLabel>
                        <FormDescription>
                          Você pratica alguma atividade física? Se sim, com qual
                          frequência? Você fuma ou bebe?
                        </FormDescription>
                        <FormControl>
                          <Input
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            {...field}
                            disabled={updatePatientMutation.isPending}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vaccine"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Vacina</FormLabel>
                        <FormDescription>
                          Já tomou alguma vacina? Quais?
                        </FormDescription>
                        <FormControl>
                          <Input
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            {...field}
                            disabled={updatePatientMutation.isPending}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alergies"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Alergia</FormLabel>
                        <FormDescription>
                          Possui alergia a algum remédio ou outro tipo?
                        </FormDescription>
                        <FormControl>
                          <Input
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            {...field}
                            disabled={updatePatientMutation.isPending}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <Button
                      type="submit"
                      disabled={updatePatientMutation.isPending}>
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
