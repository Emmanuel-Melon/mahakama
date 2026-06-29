import { FetchApiClient } from "~/lib/api/fetch";
import type { components } from "~/lib/api/generated/api.types";

export type Notification = components["schemas"]["Notification"];
export type NotificationResource = components["schemas"]["NotificationResource"];
export type ChatSingleResponse = components["schemas"]["ChatSingleResponse"];
export type NotificationssCollectionResponse = components["schemas"]["NotificationsCollectionResponse"];


export class NotificationsApiClient {
  private api: FetchApiClient;

  constructor() {
    this.api = new FetchApiClient();
  }

  public async getNotifications(
    options: { headers: HeadersInit } = { headers: {} },
  ): Promise<Notification[]> {
    try {
      const response = await this.api.request<NotificationssCollectionResponse>(
        "/v1/notifications/",
        {
          headers: options.headers,
        },
      );

      if (!response.data) {
        console.error("Invalid notifications data:", response);
        throw new Error("Invalid notifications data received from the server");
      }

      const notifications = response.data.map((notification: NotificationResource) => notification.attributes);
      return notifications;
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      throw error;
    }
  }

}

export const notificationsApi = new NotificationsApiClient();
