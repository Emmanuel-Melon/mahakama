import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { LawyerInfoSection } from "~/feature/users/components/LawyerInfoSection";
import type { User } from "~/feature/users/hooks/use-users";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

const lawyerProfessionalSchema = z.object({
  specialization: z.string().min(1, "Specialization is required"),
  experienceYears: z.string().min(1, "Years of experience is required"),
  casesHandled: z.string().min(1, "Cases handled is required"),
});

interface LawyerProfessionalInfoStepProps {
  user: User;
  onNext: (data: {
    specialization: string;
    experienceYears: string;
    casesHandled: string;
  }) => void;
  initialData?: {
    specialization: string;
    experienceYears: string;
    rating: string;
    casesHandled: string;
    location: string;
    languages: string;
  };
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function LawyerProfessionalInfoStep({
  user,
  onNext,
  initialData,
  formRef,
}: LawyerProfessionalInfoStepProps) {
  const form = useForm({
    resolver: zodResolver(lawyerProfessionalSchema),
    defaultValues: {
      specialization: initialData?.specialization || "",
      experienceYears: initialData?.experienceYears || "",
      casesHandled: initialData?.casesHandled || "",
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate with Zod
    const result = lawyerProfessionalSchema.safeParse(form.getValues());
    if (!result.success) {
      // Show validation errors - for now using alert, but you could show them in UI
      const errors = result.error.flatten();
      Object.entries(errors.fieldErrors).forEach(([field, error]) => {
        alert(`${field}: ${error}`);
      });
      return;
    }

    onNext(form.getValues());
  };

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="specialization"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="block text-sm font-bold text-gray-700 mb-1">
              Specialization *
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                id="specialization"
                className="border-2 border-gray-900"
                style={{
                  boxShadow: "2px 2px 0 0 #000",
                  borderRadius: "4px 8px 4px 8px",
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="experienceYears"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="block text-sm font-bold text-gray-700 mb-1">
              Years of Experience *
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                id="experienceYears"
                type="number"
                className="border-2 border-gray-900"
                style={{
                  boxShadow: "2px 2px 0 0 #000",
                  borderRadius: "4px 8px 4px 8px",
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="casesHandled"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="block text-sm font-bold text-gray-700 mb-1">
              Cases Handled *
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                id="casesHandled"
                className="border-2 border-gray-900"
                style={{
                  boxShadow: "2px 2px 0 0 #000",
                  borderRadius: "4px 8px 4px 8px",
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}
