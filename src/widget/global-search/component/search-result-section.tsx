import type { ReactNode } from "react";

type Props = {
  title: string;
  className: string;
  children: ReactNode;
};

export function SearchResultSection({ title, className, children }: Props) {
  return (
    <section className={`global-search-section ${className}`}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}