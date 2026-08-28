import { LocaleRedirect } from "@/components/locale-redirect";

export default function RedirectPage() {
  return (
    <main>
      <p>Choose your language to continue.</p>
      <a href="/en">Continue in English</a>
      <LocaleRedirect />
    </main>
  );
}
