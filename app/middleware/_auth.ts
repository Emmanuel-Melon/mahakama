// new middleware file
import { userContext, authContext } from "~/middleware/context";
import { getAuthToken } from "~/lib/api/utils";
import { usersApi, UsersApiClient } from "~/lib/api/users.api";
import { FetchApiClient } from "~/lib/api/fetch";

export async function authMiddleware({ request, context }: any) {
  const token = getAuthToken(request);
  const url = new URL(request.url);
  const pathname = url.pathname;
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return;
  }

  const cookieHeader = request.headers.get('cookie');
  const apiClient = cookieHeader ? new UsersApiClient(new FetchApiClient({ Cookie: cookieHeader })) : usersApi;

  try {
    const user = await apiClient.getCurrentUser();
    if (!user.isOnboarded) {
    }
    context.set(userContext, user);
    context.set(authContext, { token });
  } catch (error) {
    
  }
}