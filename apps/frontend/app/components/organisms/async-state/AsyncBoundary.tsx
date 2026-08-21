import type { ReactNode } from "react";
import { type LucideIcon, AlertCircle, ArrowRight } from "lucide-react";

// Import your new composed variants
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { Button } from "~/components/ui/button";

interface MinimalApiError {
  title?: string;
  detail?: string;
}

interface DecoupledErrorShape {
  message: string;
  errors?: MinimalApiError[];
}

interface AsyncProps {
  isLoading?: boolean;
  error?: DecoupledErrorShape | null;
  variant?: "default" | "minimal";
}

interface AsyncBoundaryProps extends AsyncProps {
  errorComponent?: ReactNode;
  loadingComponent: ReactNode;
  children: ReactNode;
}

export function NewAsyncBoundary({
  isLoading,
  error,
  errorComponent,
  loadingComponent,
  children,
  variant = "default",
}: AsyncBoundaryProps) {
  if (error) {
    if (errorComponent) return <>{errorComponent}</>;

    const primaryError = error.errors?.[0];
    const errorTitle = primaryError?.title || "something went wrong";
    const errorMessage =
      primaryError?.detail ||
      error.message ||
      "we couldn't load the data. please try again.";

    return (
      <div className="py-20 px-4 flex items-center justify-center animate-in fade-in zoom-in duration-500">
        <ErrorState variant={variant}>
          <ErrorState.Visual icon={AlertCircle} />
          <ErrorState.Header>
            <ErrorState.Subtitle>Attention Required</ErrorState.Subtitle>
            <ErrorState.Title>{errorTitle}</ErrorState.Title>
            <ErrorState.Description>{errorMessage}</ErrorState.Description>
          </ErrorState.Header>
          <ErrorState.Content>
            <ErrorState.Actions>
              <Button
                onClick={() => window.location.reload()}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                refresh page
              </Button>
            </ErrorState.Actions>
            <ErrorState.Footer>
              If you need further assistance, please contact our support team.
            </ErrorState.Footer>
          </ErrorState.Content>
        </ErrorState>
      </div>
    );
  }

  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  return <>{children}</>;
}

interface NewAsyncEmptyProps<T> {
  data: T | T[] | null | undefined;
  emptyComponent: ReactNode;
  children: ReactNode;
}

export function NewAsyncEmpty<T>({
  data,
  emptyComponent,
  children,
}: NewAsyncEmptyProps<T>) {
  const isEmpty =
    data === null ||
    data === undefined ||
    (Array.isArray(data) && data.length === 0);

  if (isEmpty) {
    return <>{emptyComponent}</>;
  }

  return <>{children}</>;
}

interface NewAsyncContainerProps<T> extends AsyncProps {
  data: T | T[] | null | undefined;
  emptyState?: {
    icon?: LucideIcon;
    badge?: string;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
  };
  loadingComponent: ReactNode;
  children: ReactNode;
}

export function NewAsyncContainer<T>({
  data,
  isLoading,
  error,
  emptyState,
  loadingComponent,
  children,
  variant = "default",
}: NewAsyncContainerProps<T>) {
  return (
    <NewAsyncBoundary
      isLoading={isLoading}
      error={error}
      loadingComponent={loadingComponent}
      variant={variant}
    >
      <NewAsyncEmpty
        data={data}
        emptyComponent={
          emptyState ? (
            <div className="py-20 px-4 flex items-center justify-center animate-in fade-in zoom-in duration-500">
              <EmptyState variant={variant}>
                <EmptyState.Visual icon={emptyState.icon || AlertCircle} />
                <EmptyState.Content>
                  <EmptyState.Badge>
                    {emptyState.badge || "getting started"}
                  </EmptyState.Badge>
                  <EmptyState.Title>{emptyState.title}</EmptyState.Title>
                  <EmptyState.Description>
                    {emptyState.description}
                  </EmptyState.Description>
                  {(emptyState.actionLabel ||
                    emptyState.secondaryActionLabel) && (
                    <EmptyState.Actions>
                      {emptyState.actionLabel && (
                        <Button
                          onClick={emptyState.onAction}
                          className="group shadow-xl shadow-primary/20"
                        >
                          {emptyState.actionLabel}
                          <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
                        </Button>
                      )}
                      {emptyState.secondaryActionLabel && (
                        <Button
                          variant="outline"
                          onClick={emptyState.onSecondaryAction}
                          className="border-border/60"
                        >
                          {emptyState.secondaryActionLabel}
                        </Button>
                      )}
                    </EmptyState.Actions>
                  )}
                </EmptyState.Content>
              </EmptyState>
            </div>
          ) : null
        }
      >
        {children}
      </NewAsyncEmpty>
    </NewAsyncBoundary>
  );
}
