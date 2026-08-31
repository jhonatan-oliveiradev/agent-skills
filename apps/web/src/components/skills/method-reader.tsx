import type { ReactNode } from "react";
import {
  EditorialReaderNav,
  type EditorialReaderNavItem,
} from "@/components/editorial/editorial-reader-nav";

export function MethodReader({
  label,
  sections,
  children,
}: Readonly<{
  label: string;
  sections: readonly EditorialReaderNavItem[];
  children: ReactNode;
}>) {
  return (
    <div className="method-reader" data-method-reader>
      <div className="method-reader__navigation">
        <EditorialReaderNav label={label} items={sections} />
      </div>
      <div className="method-reader__main">{children}</div>
    </div>
  );
}
