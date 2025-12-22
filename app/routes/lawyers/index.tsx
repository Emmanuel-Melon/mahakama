import type { Route } from "./+types/index";
import { LawyersScreen } from "~/feature/lawyers/screens/LawyersScreen";
import { useLawyers } from "~/feature/lawyers/hooks/use-lawyers";
import { useSearchParams } from "react-router";
import { authContext, userContext } from "~/middleware/context";
import { PageLoading } from "~/components/page-loading";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Find Vetted Lawyers in South Sudan & Uganda - Mahakama" },
    {
      name: "description",
      content:
        "Connect with experienced, vetted legal professionals in South Sudan and Uganda. Get expert help with family law, employment rights, housing issues, and more through our trusted network.",
    },
    {
      name: "keywords",
      content:
        "find lawyer South Sudan, Uganda attorneys, legal professionals, vetted lawyers, legal consultation, family law, employment law, housing rights, legal representation",
    },
    {
      name: "og:title",
      content: "Find Trusted Legal Professionals - Mahakama",
    },
    {
      name: "og:description",
      content:
        "Connect with vetted legal experts in South Sudan and Uganda for personalized legal assistance and representation when you need it most.",
    },
    { name: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Find Vetted Lawyers in East Africa" },
    {
      name: "twitter:description",
      content:
        "Mahakama connects you with trusted legal professionals in South Sudan and Uganda for expert legal advice and representation.",
    },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const user = context.get(userContext);
    const token = context.get(authContext)?.token || null;
    return { user, token, error: null };
  } catch (error) {
    return {
      user: null,
      token: null,
      error: error instanceof Error ? error.message : "Failed to load user data"
    };
  }
}

export default function LawyersPage({ loaderData }: Route.ComponentProps) {
  const { user, error } = loaderData;
  if (error) return (
    <PageLoading 
      title="Authentication Error"
      description="There was a problem loading your user session. Please try refreshing the page."
      showSkeleton={false}
    />
  );
  
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') as "government" | "legal-aid" | "dispute-resolution" | "specialized" | undefined;
  
  const { data: lawyers, error: lawyersError, isLoading } = useLawyers(category);
  
  return <LawyersScreen lawyers={lawyers || []} error={lawyersError} isLoading={isLoading} isAuthenticated={!!user} />;
}
