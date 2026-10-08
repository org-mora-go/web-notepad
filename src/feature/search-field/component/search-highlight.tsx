import type { ReactNode } from "react";

type Props = {
  text: string;
  query: string;
};

export function SearchHighlight({ text, query }: Props) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return text;

  const normalizedText = text.toLowerCase();
  const parts: ReactNode[] = [];
  let cursor = 0;
  let matchIndex = normalizedText.indexOf(normalizedQuery, cursor);

  while (matchIndex !== -1) {
    const matchEnd = matchIndex + normalizedQuery.length;
    parts.push(text.slice(cursor, matchIndex));
    parts.push(
      <mark className="search-highlight" key={matchIndex}>
        {text.slice(matchIndex, matchEnd)}
      </mark>,
    );
    cursor = matchEnd;
    matchIndex = normalizedText.indexOf(normalizedQuery, cursor);
  }

  parts.push(text.slice(cursor));
  return <>{parts}</>;
}