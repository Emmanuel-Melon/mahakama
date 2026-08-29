import { Award } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepHeader } from "~/feature/users/components/onboarding/StepHeader";
import { IssuingAuthoritySelect } from "./onboarding/IssuingAuthoritySelect";
import { CardWithLabel } from "@mah/ui/components/ui/CardWithLabel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@mah/ui/components/form";
import { Input } from "@mah/ui/components/Input";
import { Textarea } from "@mah/ui/components/Textarea";
import type { Lawyer } from "@mah/api/src/clients/lawyers.api";
import { useCountry } from "~/context/country-context";

const credentialsSchema = z.object({
  barNumber: z.string().min(1, "Bar number is required"),
  issuingAuthority: z.string().min(1, "Issuing authority is required"),
  bio: z.string().optional(),
});

export interface LawyerCredentialsPayload {
  barNumber: string;
  issuingAuthority: string;
  bio?: string;
}

interface LawyerCredentialsSectionProps {
  initialProfile: Lawyer | null;
  onComplete: (data: LawyerCredentialsPayload) => void;
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

export function LawyerCredentialsSection({
  initialProfile,
  onComplete,
  formRef,
}: LawyerCredentialsSectionProps) {
  const { selectedCountry } = useCountry();

  const form = useForm({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      barNumber: initialProfile?.barNumber || "",
      issuingAuthority: initialProfile?.issuingAuthority || "",
      bio: initialProfile?.bio || "",
    },
  });

  const country = selectedCountry || "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = credentialsSchema.safeParse(form.getValues());
    if (!result.success) {
      const errors = Object.values(result.error.flatten().fieldErrors)
        .flat()
        .join(", ");
      alert(errors);
      return;
    }

    const values = result.data;
    onComplete({
      barNumber: values.barNumber,
      issuingAuthority: values.issuingAuthority,
      bio: values.bio?.trim() || undefined,
    });
  };

  return (
    <>
      <StepHeader
        title="Credentials & Bio"
        description="Add your professional credentials to complete your profile"
        icon={Award}
      />
      <CardWithLabel
        label="lawyer-credentials-info"
        className="rounded-xl border-2 border-gray-900 border-solid"
      >
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <Form {...form}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="barNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelStyling}>Bar Number *</FormLabel>
                    <FormControl>
                      <Input {...field} id="barNumber" {...inputStyling} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <IssuingAuthoritySelect
                control={form.control}
                name="issuingAuthority"
                country={country}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelStyling}>
                    Professional Bio
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="bio"
                      rows={4}
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
        </form>
      </CardWithLabel>
    </>
  );
}