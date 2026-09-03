import { createApiClient, AxiosApiClient } from "../axios";
import type { ApiCollection, ApiResource } from "../api/api.types";
import { BaseApiClient } from "../api";
import type { components } from "../generated/api.types";
import { ORGS_API_ROUTES } from "../api.routes";

export type Org = components["schemas"]["Org"];
export type OrgResource = components["schemas"]["OrgResource"];
export type OrgSingleResponse = components["schemas"]["OrgSingleResponse"];
export type OrgCollectionResponse =
  components["schemas"]["OrgCollectionResponse"];
export type NewOrg = components["schemas"]["NewOrg"];
export type UpdateOrg = components["schemas"]["UpdateOrg"];

export type OrgMember = components["schemas"]["OrgMember"];
export type OrgMemberResource = components["schemas"]["OrgMemberResource"];
export type OrgMemberSingleResponse =
  components["schemas"]["OrgMemberSingleResponse"];
export type OrgMemberCollectionResponse =
  components["schemas"]["OrgMemberCollectionResponse"];
export type NewOrgMember = components["schemas"]["NewOrgMember"];
export type UpdateOrgMember = components["schemas"]["UpdateOrgMember"];

export type OrgMetadata = OrgSingleResponse["metadata"];
export type OrgResult = ApiResource<Org, OrgMetadata>;

export type OrgsMetadata = OrgCollectionResponse["metadata"];
export type OrgsResult = ApiCollection<Org, OrgsMetadata>;

export type OrgMemberMetadata = OrgMemberSingleResponse["metadata"];
export type OrgMemberResult = ApiResource<OrgMember, OrgMemberMetadata>;

export type OrgMemberCollection = ApiCollection<
  OrgMember,
  OrgMemberCollectionResponse["metadata"]
>;

export interface OrgListParams {
  name?: string;
  slug?: string;
  userId?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  q?: string;
}

export interface OrgMemberListParams {
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export class OrgsApiClient extends BaseApiClient {
  protected readonly path = ORGS_API_ROUTES.ROOT;

  constructor(api: AxiosApiClient = createApiClient()) {
    super(api);
  }

  public async getOrgs(
    params: OrgListParams = {},
    options: { headers?: Record<string, string> } = {},
  ): Promise<OrgsResult> {
    const response = await this.api.request<OrgCollectionResponse>(this.path, {
      params,
      headers: { ...this.defaultHeaders, ...options.headers },
    });
    return this.unpackCollection(response, {
      errMsg: "Invalid orgs data received from the server",
    });
  }

  public async createOrg(
    data: NewOrg,
    options: { headers?: Record<string, string> } = {},
  ): Promise<OrgResult> {
    const response = await this.api.request<OrgSingleResponse>(this.path, {
      method: "POST",
      headers: { ...this.defaultHeaders, ...options.headers },
      data,
    });
    return this.unpackSingle(response, {
      errMsg: "Invalid org data received from the server",
    });
  }

  public async getOrgById(
    orgId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<OrgResult> {
    const response = await this.api.request<OrgSingleResponse>(
      `${this.path}/${orgId}`,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid org data received from the server",
    });
  }

  public async updateOrg(
    orgId: string,
    data: UpdateOrg,
    options: { headers?: Record<string, string> } = {},
  ): Promise<OrgResult> {
    const response = await this.api.request<OrgSingleResponse>(
      `${this.path}/${orgId}`,
      {
        method: "PATCH",
        headers: { ...this.defaultHeaders, ...options.headers },
        data,
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid org data received from the server",
    });
  }

  public async getOrgMembers(
    orgId: string,
    params: OrgMemberListParams = {},
    options: { headers?: Record<string, string> } = {},
  ): Promise<OrgMemberCollection> {
    const response = await this.api.request<OrgMemberCollectionResponse>(
      ORGS_API_ROUTES.MEMBERS.replace(":orgId", orgId),
      {
        params,
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackCollection(response, {
      errMsg: "Invalid org members data received from the server",
    });
  }

  public async inviteOrgMember(
    orgId: string,
    data: NewOrgMember,
    options: { headers?: Record<string, string> } = {},
  ): Promise<OrgMemberResult> {
    const response = await this.api.request<OrgMemberSingleResponse>(
      ORGS_API_ROUTES.MEMBERS.replace(":orgId", orgId),
      {
        method: "POST",
        headers: { ...this.defaultHeaders, ...options.headers },
        data,
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid org member data received from the server",
    });
  }

  public async updateOrgMember(
    orgId: string,
    userId: string,
    data: UpdateOrgMember,
    options: { headers?: Record<string, string> } = {},
  ): Promise<OrgMemberResult> {
    const response = await this.api.request<OrgMemberSingleResponse>(
      ORGS_API_ROUTES.MEMBER.replace(":orgId", orgId).replace(
        ":userId",
        userId,
      ),
      {
        method: "PATCH",
        headers: { ...this.defaultHeaders, ...options.headers },
        data,
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid org member data received from the server",
    });
  }

  public async removeOrgMember(
    orgId: string,
    userId: string,
    options: { headers?: Record<string, string> } = {},
  ): Promise<OrgMemberResult> {
    const response = await this.api.request<OrgMemberSingleResponse>(
      ORGS_API_ROUTES.MEMBER.replace(":orgId", orgId).replace(
        ":userId",
        userId,
      ),
      {
        method: "DELETE",
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );
    return this.unpackSingle(response, {
      errMsg: "Invalid org member data received from the server",
    });
  }
}

let _orgsApi: OrgsApiClient | null = null;
export const orgsApi = new Proxy({} as OrgsApiClient, {
  get(_, prop) {
    if (!_orgsApi) _orgsApi = new OrgsApiClient();
    return _orgsApi[prop as keyof OrgsApiClient];
  },
});
