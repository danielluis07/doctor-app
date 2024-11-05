"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rating } from "react-simple-star-rating";
import { Button } from "@/components/ui/button";
import { FieldErrors, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { insertReviewSchema as baseInsertReviewSchema } from "@/db/schema";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDoctorReview } from "@/queries/reviews/use-create-reviews";

const insertReviewSchema = baseInsertReviewSchema.extend({
  doctorId: z.string(),
  userId: z.string(),
  rating: z.number().min(1, "É necessário informar uma nota"),
  comment: z.string().min(1, "Faça um comentário"),
});

type FormData = z.infer<typeof insertReviewSchema>;
export const ReviewForm = ({
  doctorId,
  userId,
}: {
  doctorId: string | undefined;
  userId: string | undefined;
}) => {
  const createReviewMutation = useCreateDoctorReview(doctorId);
  const form = useForm<FormData>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: {
      doctorId,
      userId,
      rating: 0,
      comment: "",
    },
  });

  const onSubmit = (values: FormData) => {
    createReviewMutation.mutate(
      {
        ...values,
        rating: values.rating.toString(),
      },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  };

  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  console.log(form.watch("rating"));

  return (
    <div className="mt-8 bg-white shadow-lg rounded-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Deixe seu comentário
      </h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-6">
          <FormField
            control={form.control}
            name="rating"
            defaultValue={0}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Nota
                    </FormLabel>
                    <Rating
                      transition
                      allowFraction
                      initialValue={field.value}
                      size={20}
                      onClick={(newValue) => field.onChange(newValue)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col space-y-2">
                    <FormLabel
                      htmlFor="comment"
                      className="text-sm font-medium text-gray-700">
                      Comentário
                    </FormLabel>
                    <Textarea
                      id="comment"
                      placeholder="Compartilhe sua experiência..."
                      className="resize-none h-32"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={createReviewMutation.isPending}
            className="w-full">
            {createReviewMutation.isPending ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
