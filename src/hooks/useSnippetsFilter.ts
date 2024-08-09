import { Snippet, SnippetState } from '@/lib/schemas/snippet';
import { Tag } from '@/lib/schemas/tag';
import useQueryParams from './useQueryParams';
import { useSnippetsQuery } from './useSnippets';

type StateFilter = {
  isFavorite?: boolean;
  isDark?: boolean;
};

// Apply search filter
const applySearch = (snippet: Snippet, search: string) => {
  const searchLower = search.toLowerCase();
  return (
    snippet.title.toLowerCase().includes(searchLower) ||
    snippet.description.toLowerCase().includes(searchLower) ||
    snippet.code.toLowerCase().includes(searchLower) ||
    snippet.language.toLowerCase().includes(searchLower)
  );
};

// Apply general filter criterion
const applyFilterCriterion = (
  value: string | undefined,
  snippetValue: string,
) =>
  value === undefined ||
  snippetValue.toLowerCase().includes(value.toLowerCase());

// Apply state filter
const applyStateFilter = (
  stateFilter?: StateFilter,
  snippetState?: SnippetState,
) => {
  if (stateFilter) {
    return (
      (stateFilter.isFavorite === undefined ||
        snippetState?.isFavorite === stateFilter.isFavorite) &&
      (stateFilter.isDark === undefined ||
        snippetState?.isDark === stateFilter.isDark)
    );
  }
  return true;
};

// Apply tags filter
const applyTagsFilter = (tagsFilter?: string[], snippetTags?: Tag[]) => {
  if (tagsFilter && tagsFilter.length > 0) {
    const snippetTagNames =
      snippetTags?.map(tag => tag.name.toLowerCase()) || [];
    return tagsFilter.some(tagName =>
      snippetTagNames.includes(tagName.toLowerCase()),
    );
  }
  return true;
};

// Apply all filters to a snippet
const applyFilters = (
  snippet: Snippet,
  filter: {
    search?: string;
    title?: string;
    description?: string;
    code?: string;
    language?: string;
    state?: StateFilter;
    tags?: string[];
  },
) => {
  return (
    (!filter.search || applySearch(snippet, filter.search)) &&
    applyFilterCriterion(filter.title, snippet.title) &&
    applyFilterCriterion(filter.description, snippet.description) &&
    applyFilterCriterion(filter.code, snippet.code) &&
    (!filter.language ||
      snippet.language.toLowerCase() === filter.language.toLowerCase()) &&
    applyStateFilter(filter.state, snippet.state) &&
    applyTagsFilter(filter.tags, snippet.tags)
  );
};

// Main hook function to filter snippets based on query parameters
const useSnippetsFilter = () => {
  const { data: snippets = [] } = useSnippetsQuery();
  const filter = useQueryParams();
  return snippets.filter(snippet => applyFilters(snippet, filter));
};

export default useSnippetsFilter;
