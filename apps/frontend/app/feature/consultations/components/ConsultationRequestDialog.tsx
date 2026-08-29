import { useState } from "react";
import { Button } from "@mah/ui";
import { Label } from "@mah/ui/components/Label";
import { Textarea } from "@mah/ui/components/Textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@mah/ui/components/dialog";
import { useRequestConsultation } from "@mah/api/src/hooks/use-consultations";
import type { Lawyer } from "@mah/api/src/clients/lawyers.api";

interface ConsultationRequestDialogProps {
  lawyer: Pick<Lawyer, "id" | "name">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConsultationRequestDialog({
  lawyer,
  open,
  onOpenChange,
}: ConsultationRequestDialogProps) {
  const [message, setMessage] = useState("");

  const requestConsultation = useRequestConsultation({
    onRequestSuccess: () => onOpenChange(false),
  });

  const handleSubmit = () => {
    requestConsultation.mutate({
      lawyerId: lawyer.id,
      requestMessage: message.trim() || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request a Consultation</DialogTitle>
          <DialogDescription>
            Send a consultation request to {lawyer.name || "this lawyer"}. They
            will review your request and respond shortly.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label htmlFor="request-message">
            Message <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="request-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Briefly describe what you need help with..."
            disabled={requestConsultation.isPending}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={requestConsultation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={requestConsultation.isPending}
          >
            {requestConsultation.isPending
              ? "Sending request..."
              : "Send Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}