import { auth } from "@clerk/nextjs/server";

export async function GET(req) {
  const { userId, sessionId, getToken } = auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get JWT token from Clerk
  const token = await getToken();

  return Response.json({ message: "Logged in", userId, token });
}
