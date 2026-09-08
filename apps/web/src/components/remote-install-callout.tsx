import { CopyCommand } from "@/components/copy-command";
import type { Locale } from "@/lib/locales";

const copy = {
  en: {
    eyebrow: "Quick install",
    title: "Run from any directory",
    summary:
      "No repository clone required. The remote bootstrap downloads the deployment-pinned source and delegates installation to the canonical install.sh. Windows PowerShell remains available in the detailed installer.",
    bash: "Bash / WSL / Linux / macOS",
    copy: "Copy",
    copied: "Copied",
  },
  "pt-BR": {
    eyebrow: "Instalação rápida",
    title: "Execute de qualquer diretório",
    summary:
      "Não é necessário clonar o repositório. O bootstrap remoto baixa a fonte fixada no deployment e delega a instalação ao install.sh canônico. O Windows PowerShell continua disponível no instalador detalhado.",
    bash: "Bash / WSL / Linux / macOS",
    copy: "Copiar",
    copied: "Copiado",
  },
} as const;

export function RemoteInstallCallout({
  locale,
  command,
}: Readonly<{ locale: Locale; command: string }>) {
  const localized = copy[locale];

  return (
    <aside
      className="installation-command-row remote-install-callout"
      data-remote-install
      aria-labelledby="remote-install-title"
    >
      <div className="installation-command-row__label">
        <p className="eyebrow">{localized.eyebrow}</p>
        <h3 id="remote-install-title">{localized.title}</h3>
        <p>{localized.summary}</p>
      </div>
      <div className="command-entry">
        <p>{localized.bash}</p>
        <CopyCommand
          command={command}
          label={localized.copy}
          copiedLabel={localized.copied}
        />
      </div>
    </aside>
  );
}
