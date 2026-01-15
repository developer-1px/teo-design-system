import type React from "react";
import { Frame } from "../../design-system/Frame/Frame.tsx";

interface TableRootProps {
  children: React.ReactNode;
}

export function TableRoot({ children }: TableRootProps) {
  return (
    <Frame flex fill scroll>
      {children}
    </Frame>
  );
}
