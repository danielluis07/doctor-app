"use client";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { useCreateDoctorAvailability } from "@/queries/doctor-availability/use-create-availability";
import { Plus, X } from "lucide-react";

const availabilitySchema = z.object({
  doctorId: z.string().optional().nullable(),
  availability: z.array(
    z.object({
      availableDate: z.string().optional().nullable(),
      startTime: z.string().optional().nullable(),
      endTime: z.string().optional().nullable(),
    })
  ),
});

type FormData = z.infer<typeof availabilitySchema>;

export const AvailabilityForm = ({ id }: { id: string | undefined }) => {
  const createDoctorAvailability = useCreateDoctorAvailability(id);

  const form = useForm<FormData>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      doctorId: id,
      availability: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "availability",
  });

  const onSubmit = (values: FormData) => {
    createDoctorAvailability.mutate(values);
    form.reset();
  };

  const onInvalid = (errors: any) => {
    console.log(errors);
  };
  return (
    <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-6">
          {fields.map((item, index) => (
            <div key={item.id} className="bg-gray-50 rounded-lg p-4 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                onClick={() => remove(index)}>
                <X className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name={`availability.${index}.availableDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${
                                !field.value && "text-muted-foreground"
                              }`}>
                              {field.value ? (
                                format(new Date(field.value), "dd/MM/yyyy")
                              ) : (
                                <span className="mr-2">Escolha uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              if (date) {
                                const isoDate = date.toISOString();
                                form.setValue(
                                  `availability.${index}.availableDate`,
                                  isoDate
                                );
                              }
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`availability.${index}.startTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Início</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`availability.${index}.endTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fim</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() =>
              append({ availableDate: "", startTime: "", endTime: "" })
            }>
            <Plus className="mr-2 h-4 w-4" /> Adicionar data
          </Button>
          <Button
            type="submit"
            className="w-full"
            disabled={
              fields.length === 0 || createDoctorAvailability.isPending
            }>
            {createDoctorAvailability.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
