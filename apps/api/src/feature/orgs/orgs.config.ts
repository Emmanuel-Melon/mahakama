import { JsonApiResourceConfig } from "@/lib/express/express.types";
import type { Org, OrgMember } from "./orgs.types";

export const OrgSerializer: JsonApiResourceConfig<Org> = {
  type: "org",
  attributes: (org: Org) => org,
};

export const OrgMemberSerializer: JsonApiResourceConfig<OrgMember> = {
  type: "org-member",
  attributes: (member: OrgMember) => member,
};

export const OrgJobs = {
  OrgMemberInvited: "org:member:invited",
  OrgMemberStatusChanged: "org:member:status:changed",
} as const;

export type OrgJob = (typeof OrgJobs)[keyof typeof OrgJobs];