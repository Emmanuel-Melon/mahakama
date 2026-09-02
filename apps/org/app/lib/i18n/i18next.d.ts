import type { authI18n } from "~/feature/auth/AuthConfig";
import commonEn from "~/locales/en/common.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      auth: typeof authI18n.resources.en;
      common: typeof commonEn;
    };
  }
}
