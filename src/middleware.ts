import { getAccessToken, validateToken } from "@/utils/connection";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getAccessToken();

  if (token === undefined) {
    return NextResponse.redirect(new URL("/?error=true", request.url));
  }

  const tokenValue = JSON.parse(token).value;

  try {
    await validateToken(tokenValue);
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/?error=true", request.url));
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/dashboard", "/vm/:fqdn*"],
};
