import type { ReactNode } from "react";
import Header from "@/layouts/Header";

interface Props {
  children: ReactNode;
  page: string;
  setPage: (p: string) => void;
}

export default function MainLayout({ children, page, setPage }: Props) {
  return (
    <div>
      <Header page={page} setPage={setPage} />
      <main>{children}</main>
    </div>
  );
}
