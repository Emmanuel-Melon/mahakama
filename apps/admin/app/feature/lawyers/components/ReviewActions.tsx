import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useApproveLawyer,
  useRejectLawyer,
} from "@mah/api/src/hooks/use-lawyers";
import type { Lawyer } from "@mah/api/src/clients/lawyers.api";

interface ReviewActionsProps {
  lawyer: Lawyer;
  onApproved?: () => void;
  onRejected?: () => void;
}

export function ReviewActions({
  lawyer,
  onApproved,
  onRejected,
}: ReviewActionsProps) {
  const { t } = useTranslation("lawyers");
  const { t: tCommon } = useTranslation("common");
  const approveMutation = useApproveLawyer();
  const rejectMutation = useRejectLawyer();

  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const isProcessing = approveMutation.isPending || rejectMutation.isPending;

  function handleApprove() {
    approveMutation.mutate(lawyer.id, {
      onSuccess: () => onApproved?.(),
    });
  }

  function handleReject() {
    if (!rejectionReason.trim()) return;
    rejectMutation.mutate(
      {
        lawyerId: lawyer.id,
        data: { rejectionReason: rejectionReason.trim() },
      },
      {
        onSuccess: () => {
          setShowRejectForm(false);
          setRejectionReason("");
          onRejected?.();
        },
      },
    );
  }

  if (lawyer.status !== "submitted") {
    return null;
  }

  return (
    <fieldset className="border-2 border-gray-900 rounded-lg p-5 bg-white">
      <legend className="px-3 text-xs font-bold uppercase tracking-wider bg-yellow-400 text-gray-900 border-2 border-gray-900 rounded-md">
        {t("detail.reviewActions")}
      </legend>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={handleApprove}
          disabled={isProcessing}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold border-2 border-gray-900 rounded-lg bg-green-100 text-green-900 hover:bg-green-200 disabled:opacity-50 transition-all"
          style={{ boxShadow: "2px 2px 0 0 #000" }}
        >
          {approveMutation.isPending ? "…" : t("actions.approve")}
        </button>

        {!showRejectForm ? (
          <button
            type="button"
            onClick={() => setShowRejectForm(true)}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold border-2 border-gray-900 rounded-lg bg-red-100 text-red-900 hover:bg-red-200 disabled:opacity-50 transition-all"
            style={{ boxShadow: "2px 2px 0 0 #000" }}
          >
            {t("actions.reject")}
          </button>
        ) : null}
      </div>

      {showRejectForm && (
        <div className="mt-4 space-y-3">
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder={t("actions.rejectReasonPlaceholder")}
            rows={3}
            className="w-full border-2 border-gray-900 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReject}
              disabled={isProcessing || !rejectionReason.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold border-2 border-gray-900 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-all"
              style={{ boxShadow: "2px 2px 0 0 #000" }}
            >
              {rejectMutation.isPending ? "…" : t("actions.reject")}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowRejectForm(false);
                setRejectionReason("");
              }}
              disabled={isProcessing}
              className="px-4 py-2 text-sm font-bold border-2 border-gray-900 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              {tCommon("actions.cancel")}
            </button>
          </div>
        </div>
      )}
    </fieldset>
  );
}
