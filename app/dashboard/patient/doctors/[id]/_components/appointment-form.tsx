"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetDoctorAvailability } from "@/queries/doctor-availability/use-get-availability";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { insertAppointmentSchema } from "@/db/schema";
import { Doctor } from "@/queries/doctors/get-doctor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCreateAppointment } from "@/queries/appointments/use-create-appointment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/appointment-dialog";
import { useOpenAppointment } from "@/hooks/use-open-appointment";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Textarea } from "@/components/ui/textarea";

type FormData = z.infer<typeof insertAppointmentSchema>;

export const AppointmentForm = ({
  data,
  patientId,
}: {
  data: Doctor;
  patientId: string | null | undefined;
}) => {
  const { data: availabilityData, isLoading } = useGetDoctorAvailability(
    data.doctor?.id
  );

  const createAppointmentMutation = useCreateAppointment(data.doctor?.id);

  const { isOpen, onOpen, onClose } = useOpenAppointment();

  const form = useForm<FormData>({
    resolver: zodResolver(insertAppointmentSchema),
    defaultValues: {
      doctorId: data.doctor?.id,
      patientId: patientId,
      status: "PENDING",
      availableDate: "",
      startTime: "",
      endTime: "",
      medicalCondition: "",
      state: data.user?.state,
      address: data.user?.address,
      address2: data.user?.address2,
      doctorOffice: data.doctor?.doctor_office,
      city: data.user.city,
    },
  });

  const handleSubmit = (values: FormData) => {
    createAppointmentMutation.mutate(values);
    form.reset();
    onClose();
  };

  const onInvalid = (errors: any) => {
    console.log(errors);
  };

  if (isLoading) {
    return <Skeleton className="w-20 h-10" />;
  }

  const handleDateSelect = (value: string) => {
    const selectedAvailability = availabilityData?.availability.find(
      (item) => item.availableDate === value
    );

    if (selectedAvailability) {
      form.setValue("availableDate", selectedAvailability.availableDate);
      form.setValue("startTime", selectedAvailability.startTime);
      form.setValue("endTime", selectedAvailability.endTime);
    }
  };

  return (
    <div className="absolute right-3 top-3">
      <Dialog open={isOpen}>
        <DialogTrigger
          onClick={onOpen}
          className="flex items-center px-3 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-primary-foreground shadow hover:bg-sky-300 rounded-xl focus:outline-none">
          Solicitar consulta
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] sm:w-full">
          <DialogClose
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <Cross2Icon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-center">Marcar consulta</DialogTitle>
          </DialogHeader>
          {!availabilityData || availabilityData?.availability.length === 0 ? (
            <div className="text-center text-sm text-gray-400">
              Nenhuma data disponível
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit, onInvalid)}
                className="space-y-3">
                <FormField
                  control={form.control}
                  name="medicalCondition"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Mensagem</FormLabel>
                      <FormDescription>
                        Do que se trata essa consulta? Possui algum sintoma?
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-sky-400 focus:border-sky-400"
                          {...field}
                          rows={5}
                          disabled={createAppointmentMutation.isPending}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availableDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Escolha uma data</FormLabel>
                      <Select
                        onValueChange={(value) => handleDateSelect(value)}
                        defaultValue={field.value ?? ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma data" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availabilityData?.availability.map((data) => (
                            <SelectItem
                              key={data.id}
                              value={data.availableDate ?? ""}>
                              {data.availableDate
                                ? format(
                                    data.availableDate,
                                    "EEEE, dd/MM/yyyy",
                                    {
                                      locale: ptBR,
                                    }
                                  )
                                : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value?.slice(0, 5) ?? ""}
                            readOnly
                            placeholder="Hora do início"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value?.slice(0, 5) ?? ""}
                            readOnly
                            placeholder="Hora do término"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createAppointmentMutation.isPending}>
                  Concluir
                </Button>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
