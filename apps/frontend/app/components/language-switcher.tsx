import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { t, i18n: i18nInstance } = useTranslation("common");

  const currentLanguage = i18nInstance.language;
  const isRTL = currentLanguage === "ar";

  const handleLanguageChange = (lng: string) => {
    i18nInstance.changeLanguage(lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lng;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label={t("locale.switch", "Switch language")}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentLanguage === "ar" ? t("locale.ar") : t("locale.en")}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem
          className={currentLanguage === "en" ? "bg-accent" : ""}
          onClick={() => handleLanguageChange("en")}
        >
          <div className="flex items-center justify-between">
            <span>{t("locale.en")}</span>
            {currentLanguage === "en" && (
              <span className="text-primary">✓</span>
            )}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={currentLanguage === "ar" ? "bg-accent" : ""}
          onClick={() => handleLanguageChange("ar")}
        >
          <div className="flex items-center justify-between">
            <span>{t("locale.ar")}</span>
            {currentLanguage === "ar" && (
              <span className="text-primary">✓</span>
            )}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
