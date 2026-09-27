"use client";

import { useState } from "react";
import { CopyCommand } from "@/components/copy-command";
import type { Locale } from "@/lib/locales";
import { MotionDrawer } from "@/registry/cojeev/ui/motion-drawer";

const labels = {
  en: {
    action: "Install now",
    close: "Close install guide",
    context: "INSTALL / CHOOSE YOUR TERMINAL",
    summary: "Copy the command for your terminal. The full installation notes and other options are further down this page.",
    remote: "Quick install · Bash / WSL / macOS",
    bash: "Local repository · Bash / WSL / macOS",
    powershell: "Local repository · Windows PowerShell",
    details: "See the complete installation guide",
    copy: "Copy",
    copied: "Copied",
  },
  "pt-BR": {
    action: "Instalar agora",
    close: "Fechar guia de instalação",
    context: "INSTALAÇÃO / ESCOLHA SEU TERMINAL",
    summary: "Copie o comando adequado ao seu terminal. As instruções completas e outras opções estão mais abaixo nesta página.",
    remote: "Instalação rápida · Bash / WSL / macOS",
    bash: "Repositório local · Bash / WSL / macOS",
    powershell: "Repositório local · Windows PowerShell",
    details: "Ver instruções completas",
    copy: "Copiar",
    copied: "Copiado",
  },
} as const;

export function QuickInstallDrawer({ locale, name, remoteCommand, commands }: Readonly<{
  locale: Locale;
  name: string;
  remoteCommand: string;
  commands: Readonly<{ bash: string; powershell: string }>;
}>) {
  const copy = labels[locale];
  const [open, setOpen] = useState(false);

  return (
    <MotionDrawer
      className="studio-quick-install"
      open={open}
      onOpenChange={setOpen}
      side="end"
      width={480}
      enableDrag={false}
      title={name}
      description={copy.summary}
      closeLabel={copy.close}
      trigger={<button type="button" className="studio-quick-install__trigger">{copy.action}<span aria-hidden="true">↗</span></button>}
    >
      <div className="studio-quick-install__content">
        <p className="studio-quick-install__eyebrow">{copy.context}</p>
        <p className="studio-quick-install__summary">{copy.summary}</p>
        {([
          [copy.remote, remoteCommand],
          [copy.bash, commands.bash],
          [copy.powershell, commands.powershell],
        ] as const).map(([label, command]) => (
          <div className="studio-quick-install__command" key={label}>
            <p>{label}</p>
            <CopyCommand command={command} label={copy.copy} copiedLabel={copy.copied} />
          </div>
        ))}
        <div className="studio-quick-install__foot">
          <a href="#installation" onClick={() => setOpen(false)}>{copy.details} ↗</a>
        </div>
      </div>
    </MotionDrawer>
  );
}
