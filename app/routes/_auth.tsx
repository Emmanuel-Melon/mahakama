import { usersApi } from "~/lib/api/users.api";
import { getAuthToken } from "~/lib/api/utils";

async function authMiddleware({ request, context }: { request: Request; context: any }) {

    const token = getAuthToken(request);
    let user = null;

    if (token) {
        user = await usersApi.getCurrentUser();
    }
    context.user = user;
    context.token = token;
    // return context.next(request);
}