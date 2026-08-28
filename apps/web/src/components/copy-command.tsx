"use client";

import { useState } from "react";

export function CopyCommand({
  command,
  label,
  copiedLabel,
}: Readonly<{ command: string; label: string; copiedLabel: string }>) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="command-block">
      <code>{command}</code>
      <button type="button" onClick={copy} aria-live="polite">
        {copied ? copiedLabel : label}
      </button>
    </div>
  );
}
