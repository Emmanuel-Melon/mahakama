import { Briefcase } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepHeader } from "~/feature/users/components/onboarding/StepHeader";
import { CardWithLabel } from "@mah/ui/components/ui/CardWithLabel";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@mah/ui/components/form";
import { Input } from "@mah/ui/components/Input";
import type { Lawyer } from "@mah/api/src/clients/lawyers.api";
import { SpecializationSelect } from "./onboarding/SpecializationSelect";
import { JurisdictionSelect } from "./onboarding/JurisdictionSelect";
import { useCountry } from "~/context/country-context";

const practiceSchema = z.object({
  specialization: z.string().min(1, "Specialization is required"),
  jurisdiction: z.string().min(1, "Jurisdiction is required"),
  experienceYears: z
    .string()
    .min(1, "Years of experience is required")
    .refine((value) => !Number.isNaN(Number(value)), "Enter a valid number"),
  location: z.string().min(1, "Location is required"),
  languages: z.string().optional(),
  isAvailable: z.boolean(),
});

export interface LawyerPracticePayload {
  specialization: string;
  jurisdiction: string;
  experienceYears: number;
  location: string;
  languages: string[];
  isAvailable: boolean;
}

interface LawyerPracticeSectionProps {
  initialProfile: Lawyer | null;
  onNext: (data: LawyerPracticePayload) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
}

const inputStyling = {
  className: "border-2 border-gray-900",
  style: {
    boxShadow: "2px 2px 0 0 #000",
    borderRadius: "4px 8px 4px 8px",
  } as React.CSSProperties,
};

const labelStyling = "block text-sm font-bold text-gray-700 mb-1";

export function LawyerPracticeSection({
  initialProfile,
  onNext,
  formRef,
}: LawyerPracticeSectionProps) {
  const { selectedCountry } = useCountry();

  const form = useForm({
    resolver: zodResolver(practiceSchema),
    defaultValues: {
      specialization: initialProfile?.specialization || "",
      jurisdiction: initialProfile?.jurisdiction || "",
      experienceYears: initialProfile?.experienceYears?.toString() || "",
      location: initialProfile?.location || "",
      languages: initialProfile?.languages?.join(", ") || "",
      isAvailable: initialProfile?.isAvailable ?? false,
    },
  });

  const country = selectedCountry || "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = practiceSchema.safeParse(form.getValues());
    if (!result.success) {
      const errors = Object.values(result.error.flatten().fieldErrors)
        .flat()
        .join(", ");
      alert(errors);
      return;
    }

    const values = result.data;
    onNext({
      specialization: values.specialization,
      jurisdiction: values.jurisdiction,
      experienceYears: Number(values.experienceYears),
      location: values.location,
      languages: (values.languages || "")
        .split(",")
        .map((lang) => lang.trim())
        .filter(Boolean),
      isAvailable: values.isAvailable,
    });
  };

  return (
    <>
      <StepHeader
        title="Practice Details"
        description="Tell us about your legal practice"
        icon={Briefcase}
      />
      <CardWithLabel
        label="lawyer-practice-info"
        className="rounded-xl border-2 border-gray-900 border-solid"
      >
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <Form {...form}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SpecializationSelect
                control={form.control}
                name="specialization"
              />

              <JurisdictionSelect
                control={form.control}
                name="jurisdiction"
                country={country}
              />

              <FormField
                control={form.control}
                name="experienceYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelStyling}>
                      Years of Experience *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="experienceYears"
                        type="number"
                        {...inputStyling}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelStyling}>Location *</FormLabel>
                    <FormControl>
                      <Input {...field} id="location" {...inputStyling} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="languages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelStyling}>
                      Languages Spoken
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="languages"
                        placeholder="e.g. English, Swahili"
                        {...inputStyling}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Comma separated list of languages.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="block text-sm font-bold text-gray-700">
                    Availability
                  </FormLabel>
                  <FormControl>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 rounded border-2 border-gray-900"
                      />
                      Accepting new clients
                    </label>
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    You can always change this later.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </form>
      </CardWithLabel>
    </>
  );
}
