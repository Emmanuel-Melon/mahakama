// new middleware file
import { userContext, authContext } from "~/middleware/context";
import { getAuthToken, decodeJWT } from "~/lib/api/utils";

export async function authMiddleware({ request, context }: any) {
  const token = getAuthToken(request);
  const url = new URL(request.url);
  const pathname = url.pathname;
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return;
  }

  if (!token) {
    return;
  }

  try {
    const decodedToken = await decodeJWT(token);
    if (!decodedToken) {
      return;
    }

    // Extract user info from decoded token
    const user = {
      id: decodedToken.sub,
      email: decodedToken.email,
      name: decodedToken.name,
      isOnboarded: decodedToken.isOnboarded,
      // Add any other user fields from your token payload
    };

    context.set(userContext, user);
    context.set(authContext, { token });
  } catch (error) {
    console.error('Auth middleware error:', error);
  }
}