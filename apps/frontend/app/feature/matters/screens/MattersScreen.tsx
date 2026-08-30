import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FolderOpen } from "lucide-react";
import { AsyncContainer, ListControls } from "@mah/ui";
import type { Matter } from "@mah/api/src/clients/matters.api";
import type { AsyncState } from "@mah/api/src/api/api.types";
import { MattersList } from "../components/MattersList";

interface MattersScreenProps extends AsyncState {
  matters: Matter[];
  role: "lawyer" | "user";
}

export const MattersScreen = ({
  matters,
  isLoading,
  error,
  role,
}: MattersScreenProps) => {
  const { t } = useTranslation("matters");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterBy, setFilterBy] = useState("");

  const filteredMatters = matters.filter((matter) => {
    if (!searchQuery) return true;
    return matter.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <AsyncContainer
      data={matters}
      isLoading={isLoading}
      error={error}
      loadingComponent={
        <div className="text-center py-12 text-muted-foreground">
          {t("loading.description")}
        </div>
      }
      emptyState={{
        icon: FolderOpen,
        badge: t("title"),
        title: t(`empty.${role}.title`),
        description: t(`empty.${role}.description`),
      }}
    >
      <div className="space-y-4">
        <ListControls
          totalItems={filteredMatters.length}
          label="Matters"
          itemName="matter"
          displayMode={viewMode}
          onDisplayModeChange={setViewMode}
          searchValue={searchQuery}
          onSearch={setSearchQuery}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(newSortBy, newSortOrder) => {
            setSortBy(newSortBy);
            setSortOrder(newSortOrder);
          }}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          isLoading={isLoading}
        />

        {filteredMatters.length > 0 ? (
          <MattersList
            matters={filteredMatters}
            role={role}
            viewMode={viewMode}
          />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No matters found matching your search.
          </div>
        )}
      </div>
    </AsyncContainer>
  );
};
