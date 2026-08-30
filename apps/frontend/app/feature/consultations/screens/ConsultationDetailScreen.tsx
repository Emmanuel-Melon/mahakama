import {
  Home,
  MessageSquare,
  UserRound,
  Scale,
  CalendarClock,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@mah/ui/components/badge";
import { PageHeader } from "@mah/ui";
import { PageDetailHeader } from "@mah/ui";
import { CardWithLabel } from "@mah/ui/components/ui/CardWithLabel";
import { EmptyState } from "@mah/ui";
import { PageLoading } from "@mah/ui/components/molecules/PageLoading";
import { useUser } from "@mah/api/src/hooks/use-users";
import { useLawyer } from "@mah/api/src/hooks/use-lawyers";
import type { AsyncState } from "@mah/api/src/api/api.types";
import type { Consultation } from "@mah/api/src/clients/consultations.api";

interface ConsultationDetailScreenProps extends AsyncState {
  consultation?: Consultation;
  role: "lawyer" | "customer";
  onAccept?: (consultationId: string) => void;
  onDecline?: (consultationId: string, declineReason: string) => void;
  accepting?: boolean;
  declining?: boolean;
}

type BadgeVariant = "default" | "secondary" | "destructive";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
  engaged: "Engaged",
  closed: "Closed",
};

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  pending: "secondary",
  accepted: "default",
  engaged: "default",
  declined: "destructive",
  closed: "secondary",
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : "—";

const formatDateTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

const badgeVariant = (status: string): BadgeVariant =>
  STATUS_VARIANT[status] ?? "secondary";

export const ConsultationDetailScreen = ({
  consultation,
  isLoading,
  role,
  onAccept,
  onDecline,
  accepting = false,
  declining = false,
}: ConsultationDetailScreenProps) => {
  const lawyerQuery = useLawyer(consultation?.lawyerId || "");
  const lawyerUserQuery = useUser(lawyerQuery.data?.data?.userId || "");
  const customerQuery = useUser(consultation?.customerId || "");

  const customerName = customerQuery.data?.data?.name || "Customer";
  const lawyerName =
    lawyerUserQuery.data?.data?.name ||
    lawyerQuery.data?.data?.specialization ||
    "Lawyer";

  if (isLoading) {
    return (
      <PageLoading
        title="Loading consultation"
        description="Please wait while we fetch the consultation details..."
        skeletonCount={3}
      />
    );
  }

  if (!consultation) {
    return (
      <EmptyState
        icon={MessageSquare}
        badge="Consultations"
        title="Consultation not found"
        description="We couldn't find the consultation you're looking for."
      />
    );
  }

  const status = consultation.status;
  const canRespond = role === "lawyer" && status === "pending";

  const breadcrumbs = [
    { label: "Home", to: "/", icon: Home },
    { label: "Consultations", to: "/consultations", icon: MessageSquare },
    {
      label: consultation.id.slice(0, 8),
      to: `#`,
    },
  ];

  const metadata = [
    {
      icon: Scale,
      label: "Status",
      value: STATUS_LABEL[status] ?? status,
    },
    {
      icon: CalendarClock,
      label: "Requested",
      value: formatDate(consultation.createdAt),
    },
  ];

  const actions: {
    label: string;
    icon: LucideIcon;
    onClick?: () => void;
    variant: "primary" | "secondary";
  }[] = [];

  if (canRespond) {
    actions.push({
      label: accepting ? "Accepting..." : "Accept",
      icon: MessageSquare,
      onClick: () => onAccept?.(consultation.id),
      variant: "primary" as const,
    });
    actions.push({
      label: declining ? "Declining..." : "Decline",
      icon: MessageSquare,
      onClick: () => onDecline?.(consultation.id, "Not a good fit"),
      variant: "secondary" as const,
    });
  }

  const timeline = [
    { label: "Requested", date: formatDateTime(consultation.createdAt) },
    { label: "Responded", date: formatDateTime(consultation.respondedAt) },
    { label: "Engaged", date: formatDateTime(consultation.engagedAt) },
    { label: "Closed", date: formatDateTime(consultation.closedAt) },
  ];

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} className="hidden sm:flex" />

      <PageDetailHeader
        type="Consultation"
        title="Consultation Request"
        description={
          consultation.requestMessage ||
          "No message was included with this request."
        }
        icon={MessageSquare}
        metadata={metadata}
        actions={actions}
        className="mt-4"
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CardWithLabel
            label="REQUEST MESSAGE"
            className="bg-white p-6"
            labelClassName="text-xs font-medium tracking-wider text-gray-500"
          >
            <p className="text-gray-800 whitespace-pre-wrap">
              {consultation.requestMessage ||
                "No message was included with this request."}
            </p>
          </CardWithLabel>

          <CardWithLabel
            label="TIMELINE"
            className="bg-white p-6"
            labelClassName="text-xs font-medium tracking-wider text-gray-500"
          >
            <div className="divide-y divide-dashed divide-gray-200">
              {timeline.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-3 first:pt-0"
                >
                  <span className="text-sm font-medium text-gray-500">
                    {item.label}
                  </span>
                  <span className="text-sm text-gray-900">{item.date}</span>
                </div>
              ))}
            </div>
          </CardWithLabel>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <CardWithLabel
            label="CONSULTATION DETAILS"
            className="bg-white p-6"
            labelClassName="text-xs font-medium tracking-wider text-gray-500"
          >
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">Status</div>
                <Badge variant={badgeVariant(status)}>
                  {STATUS_LABEL[status] ?? status}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">
                  Customer
                </div>
                <div className="flex items-center gap-2 text-gray-900">
                  <UserRound className="h-4 w-4 text-gray-400" />
                  {customerName}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">Lawyer</div>
                <div className="flex items-center gap-2 text-gray-900">
                  <UserRound className="h-4 w-4 text-gray-400" />
                  {lawyerName}
                </div>
              </div>
              {status === "declined" && consultation.declineReason && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">
                    Decline Reason
                  </div>
                  <div className="text-gray-900">
                    {consultation.declineReason}
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">
                  Requested
                </div>
                <div className="text-gray-900">
                  {formatDateTime(consultation.createdAt)}
                </div>
              </div>
            </div>
          </CardWithLabel>
        </div>
      </div>
    </>
  );
};
