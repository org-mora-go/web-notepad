import { SearchHighlight } from "@/src/feature/search-field/component";

type Props = {
  category: string;
  groupName?: string;
  title: string;
  description?: string;
  query: string;
  ariaLabel: string;
  onSelect: () => void;
};

export function SearchResult({
  category,
  groupName,
  title,
  description,
  query,
  ariaLabel,
  onSelect,
}: Props) {
  return (
    <button
      className="global-search-result"
      type="button"
      aria-label={ariaLabel}
      onClick={onSelect}
    >
      <span className="global-search-result-category">
        {category}
        {groupName && (
          <>
            {" · "}
            <SearchHighlight text={groupName} query={query} />
          </>
        )}
      </span>
      <strong>
        <SearchHighlight text={title} query={query} />
      </strong>
      {description !== undefined && (
        <p>
          <SearchHighlight text={description} query={query} />
        </p>
      )}
    </button>
  );
}