"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreateOrg } from "@mah/api/src/hooks/use-orgs";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@mah/ui/components/dialog";
import { Button } from "@mah/ui/components/Button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@mah/ui/components/form";
import { Input } from "@mah/ui/components/Input";
import { useForm } from "react-hook-form";

interface OrgCreateDialogProps {
  onSuccess?: () => void;
}

interface CreateOrgFormData {
  name: string;
  slug?: string;
}

export function OrgCreateDialog({ onSuccess }: OrgCreateDialogProps) {
  const { t } = useTranslation("orgs");
  const createOrg = useCreateOrg();

  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrgFormData>({
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const name = watch("name");

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const onSubmit = async (data: CreateOrgFormData) => {
    try {
      const slug = data.slug || generateSlug(data.name);
      await createOrg.mutateAsync({ name: data.name, slug });
      toast.success(t("toast.created"));
      reset();
      setIsOpen(false);
      onSuccess?.();
    } catch {
      toast.error(t("toast.createError"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} className="gap-2">
          <span className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {t("create")}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("create")}</DialogTitle>
          <DialogDescription>
            {t("subtitle")}
          </DialogDescription>
        </DialogHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <FormField
              control={register}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.namePlaceholder")}
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage>{errors.name?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={register}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.slug")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.slugPlaceholder")}
                      value={field.value || generateSlug(name)}
                      onChange={(e) => setValue("slug", e.target.value, { shouldValidate: true })}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage>{errors.slug?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { reset(); setIsOpen(false); }}>
              {t("actions.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("actions.creating") : t("actions.create")}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}