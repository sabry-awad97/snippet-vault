import { Snippet } from '../schemas/snippet';

enum FilterType {
  SEARCH = 'search',
  DATE_RANGE = 'dateRange',
}

type Filter =
  | {
      type: FilterType.SEARCH;
      value: string;
    }
  | {
      type: FilterType.DATE_RANGE;
      value: [Date, Date];
    };

const filterSnippets = (snippets: Snippet[], filters: Filter[]): Snippet[] => {
  // Use the `filter` method to iterate over all snippets and apply all filters.
  return snippets.filter(snippet =>
    // Check that the snippet passes all filters using the `every` method.
    filters.every(filter => applyFilter(snippet, filter)),
  );
};

const applyFilter = (snippet: Snippet, filter: Filter): boolean => {
  switch (filter.type) {
    case FilterType.SEARCH:
      return applySearchFilter(snippet, filter.value);
    case FilterType.DATE_RANGE:
      return applyDateRangeFilter(snippet, filter.value);
    default:
      return true;
  }
};

const applySearchFilter = (snippet: Snippet, searchTerm: string): boolean => {
  const term = searchTerm.toLowerCase();
  return (
    snippet.title.toLowerCase().includes(term) ||
    snippet.description.toLowerCase().includes(term) ||
    snippet.code.toLowerCase().includes(term) ||
    snippet.tags?.some(tag => tag.name.toLowerCase().includes(term)) ||
    false
  );
};

const applyDateRangeFilter = (
  snippet: Snippet,
  range: [Date, Date],
): boolean => {
  const snippetDate = snippet.createdAt;
  return snippetDate >= range[0] && snippetDate <= range[1];
};
