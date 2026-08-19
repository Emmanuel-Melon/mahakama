import { authI18n } from "~/feature/auth/AuthConfig";
import { chatsI18n } from "~/feature/chats/ChatsConfig";
import { corpusI18n } from "~/feature/corpus/CorpusConfig";
import { lawyersI18n } from "~/feature/lawyers/LawyersConfig";
import { notificationsI18n } from "~/feature/notifications/NotificationsConfig";
import { usersI18n } from "~/feature/users/UsersConfig";
import { websiteI18n } from "~/feature/www/WebsiteConfig";
import commonEn from "~/locales/en/common.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof commonEn;
      auth: typeof authI18n.resources.en;
      chats: typeof chatsI18n.resources.en;
      documents: typeof corpusI18n.resources.en;
      lawyers: typeof lawyersI18n.resources.en;
      notifications: typeof notificationsI18n.resources.en;
      users: typeof usersI18n.resources.en;
      website: typeof websiteI18n.resources.en;
    };
  }
}
