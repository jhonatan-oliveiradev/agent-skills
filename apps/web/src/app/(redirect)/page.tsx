import Link from "next/link";
import { LocaleRedirect } from "@/components/locale-redirect";

export default function RedirectPage() {
  return (
    <main>
      <p>Choose your language to continue.</p>
      <Link href="/en">Continue in English</Link>
      <LocaleRedirect />
    </main>
  );
}
