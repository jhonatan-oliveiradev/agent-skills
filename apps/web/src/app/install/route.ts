import {
  generateRemoteInstallScript,
  resolveRemoteInstallRevision,
} from "@/lib/remote-installer.mjs";

export function GET() {
  const revision = resolveRemoteInstallRevision(process.env.VERCEL_GIT_COMMIT_SHA);
  const script = generateRemoteInstallScript({ revision });

  return new Response(script, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=300",
      "Content-Type": "text/x-shellscript; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
