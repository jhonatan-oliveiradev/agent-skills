"use client";

import { motion, useReducedMotion } from "motion/react";
import { REMOTE_QUICK_INSTALL_COMMAND } from "@/lib/remote-installer.mjs";

export function InstallationTerminal({ command, label, success }: Readonly<{ command: string; label: string; success: string }>) {
  const reducedMotion = useReducedMotion();
  const transition = reducedMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section aria-label={label} className="installation-terminal" data-terminal-demo role="region">
      <div aria-hidden="true" className="installation-terminal__chrome"><span /><span /><span /><p>agent-skills — bash</p></div>
      <div className="installation-terminal__body">
        <p><span aria-hidden="true" className="installation-terminal__prompt">$</span> {REMOTE_QUICK_INSTALL_COMMAND}</p>
        <p className="installation-terminal__fallback">Local repository: <code>{command}</code></p>
        <motion.p animate={{ opacity: 1, y: 0 }} className="installation-terminal__success" initial={reducedMotion ? false : { opacity: 0, y: 8 }} transition={{ ...transition, delay: reducedMotion ? 0 : 0.25 }}>
          <span aria-hidden="true">✓</span> {success}
        </motion.p>
      </div>
    </section>
  );
}
