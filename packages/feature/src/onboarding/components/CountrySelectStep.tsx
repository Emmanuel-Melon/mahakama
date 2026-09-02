import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe } from "lucide-react";
import { z } from "zod";
import { StepHeader } from "./StepHeader";
import { CardWithLabel } from "@mah/ui/components/ui/CardWithLabel";
import { Form } from "@mah/ui/components/form";
import { EacCountrySelect } from "./EacCountrySelect";
import { useCountry } from "../onboarding.context";
import type { RefObject } from "react";

const countrySchema = z.object({
  country: z.string().min(1, "Country is required"),
});

interface CountrySelectStepProps {
  formRef?: RefObject<HTMLFormElement | null>;
  onNext: (country: string) => void;
}

export function CountrySelectStep({ formRef, onNext }: CountrySelectStepProps) {
  const { selectedCountry, setSelectedCountry } = useCountry();

  const form = useForm({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      country: selectedCountry || "",
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = countrySchema.safeParse(form.getValues());
    if (!result.success) {
      const errors = Object.values(result.error.flatten().fieldErrors)
        .flat()
        .join(", ");
      alert(errors);
      return;
    }

    setSelectedCountry(result.data.country);
    onNext(result.data.country);
  };

  return (
    <>
      <StepHeader
        title="Country of Practice"
        description="Tell us where you practice law so we can tailor the rest of your profile"
        icon={Globe}
      />
      <CardWithLabel
        label="lawyer-country-info"
        className="rounded-xl border-2 border-gray-900 border-solid"
      >
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <Form {...form}>
            <EacCountrySelect control={form.control} name="country" />
          </Form>
        </form>
      </CardWithLabel>
    </>
  );
}
