import type { NotificationAction } from "./notifications.types";

export const EmailBlockRenderers: Record<
  EmailBlockType,
  (payload: any) => string
> = {
  heading: (text: string) =>
    `<h2 style="margin-top: 0; color: #2D2520; font-size: 20px;">${text}</h2>`,

  paragraph: (text: string) =>
    `<p style="margin: 0 0 16px 0; color: #2D2520; font-size: 16px; line-height: 1.6;">${text}</p>`,

  kvList: (data: Record<string, any>) =>
    Object.entries(data)
      .filter(([_, val]) => val !== undefined && val !== null && val !== "")
      .map(
        ([key, val]) =>
          `<p style="margin: 0 0 8px 0; color: #2D2520; font-size: 16px;"><strong>${key}:</strong> ${val}</p>`,
      )
      .join(""),

  actions: (buttons: NotificationAction[]) => `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top: 24px; margin-bottom: 24px;">
      <tr>
        ${buttons
          .map(
            (btn) => `
            <td style="padding-right: 12px;">
              <a href="${btn.url}" style="display: inline-block; padding: 12px 24px; font-family: sans-serif; font-size: 14px; font-weight: bold; color: ${btn.secondary ? "#5C4D43" : "#ffffff"}; background-color: ${btn.secondary ? "transparent" : "#5C4D43"}; border: ${btn.secondary ? "1px solid #D4CFC9" : "none"}; text-decoration: none; border-radius: 8px;">
                ${btn.label}
              </a>
            </td>
          `,
          )
          .join("")}
      </tr>
    </table>
  `,

  hint: (text: string) =>
    `<p style="color: #7A6E65; font-size: 14px; margin-top: 16px;">${text}</p>`,
};

export type EmailBlockPayload = Partial<{
  [K in EmailBlockType]: Parameters<(typeof EmailBlockRenderers)[K]>[0];
}>;

export type EmailBlockType =
  "heading" | "paragraph" | "kvList" | "actions" | "hint";

export function compileEmailBlocks(blocks: EmailBlockPayload[]): string {
  return blocks
    .flatMap((block) =>
      Object.entries(block).map(([type, payload]) => {
        const renderer = EmailBlockRenderers[type as EmailBlockType];
        return renderer ? renderer(payload) : "";
      }),
    )
    .join("")
    .trim();
}
