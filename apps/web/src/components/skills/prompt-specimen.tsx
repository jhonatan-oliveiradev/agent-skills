import { CopyCommand } from "@/components/copy-command";

export function PromptSpecimen({
  index,
  prompt,
  promptLabel,
  copyLabel,
  copiedLabel,
}: Readonly<{
  index: number;
  prompt: string;
  promptLabel: string;
  copyLabel: string;
  copiedLabel: string;
}>) {
  return (
    <article className="prompt-specimen" data-prompt-specimen>
      <header className="prompt-specimen__header">
        <span>{promptLabel}</span>
        <span aria-hidden="true">/</span>
        <span>{String(index + 1).padStart(2, "0")}</span>
      </header>
      <div className="prompt-specimen__body" data-interaction="confirm">
        <CopyCommand command={prompt} label={copyLabel} copiedLabel={copiedLabel} />
      </div>
    </article>
  );
}
