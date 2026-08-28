import { type NextRequest, NextResponse } from "next/server";

const legacyPortuguesePrefix = "/pt-br";
const canonicalPortuguesePrefix = "/pt-BR";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLegacyPortuguesePath =
    pathname === legacyPortuguesePrefix || pathname.startsWith(`${legacyPortuguesePrefix}/`);

  if (!isLegacyPortuguesePath) return NextResponse.next();

  const destination = request.nextUrl.clone();
  destination.pathname = `${canonicalPortuguesePrefix}${pathname.slice(legacyPortuguesePrefix.length)}`;
  return NextResponse.redirect(destination, 308);
}

export const config = {
  matcher: "/pt-br/:path*",
};
