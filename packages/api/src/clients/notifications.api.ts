import { createApiClient, AxiosApiClient } from "../axios";
import type { ApiCollection, ApiResource } from "../api/api.types";
import { BaseApiClient } from "../api";
import type { components } from "../generated/api.types";

export type Notification = components["schemas"]["Notification"];
export type NotificationResource =
  components["schemas"]["NotificationResource"];
export type NotificationSingleResponse =
  components["schemas"]["NotificationSingleResponse"];
export type NotificationsCollectionResponse =
  components["schemas"]["NotificationCollectionResponse"];

export type NotificationMetadata = NotificationSingleResponse["metadata"];
export type NotificationResult = ApiResource<
  Notification,
  NotificationMetadata
>;
export type NotificationCollection = ApiCollection<
  Notification,
  NotificationsCollectionResponse["metadata"]
>;

export class NotificationsApiClient extends BaseApiClient {
  protected readonly path = "/v1/notifications";

  constructor(api: AxiosApiClient = createApiClient()) {
    super(api);
  }

  public async getNotifications(
    options: { headers?: Record<string, string> } = {},
  ): Promise<NotificationCollection> {
    const response = await this.api.request<NotificationsCollectionResponse>(
      `${this.path}/`,
      {
        headers: { ...this.defaultHeaders, ...options.headers },
      },
    );

    return this.unpackCollection(response, {
      errMsg: "Invalid notifications data received from the server",
    });
  }
}

let _notificationsApi: NotificationsApiClient | null = null;
export const notificationsApi = new Proxy({} as NotificationsApiClient, {
  get(_, prop) {
    if (!_notificationsApi) _notificationsApi = new NotificationsApiClient();
    return _notificationsApi[prop as keyof NotificationsApiClient];
  },
});
