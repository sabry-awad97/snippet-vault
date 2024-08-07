import useQueryParams from './useQueryParams';
import { useSnippetsQuery } from './useSnippets';

const useSnippetsFilter = () => {
  const { data: snippets = [] } = useSnippetsQuery();
  const filter = useQueryParams();

  return snippets.filter(snippet => {
    // Search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      if (
        !(
          snippet.title.toLowerCase().includes(searchLower) ||
          snippet.description.toLowerCase().includes(searchLower) ||
          snippet.code.toLowerCase().includes(searchLower) ||
          snippet.language.toLowerCase().includes(searchLower)
        )
      ) {
        return false;
      }
    }

    // Title filter
    if (
      filter.title &&
      !snippet.title.toLowerCase().includes(filter.title.toLowerCase())
    ) {
      return false;
    }

    // Description filter
    if (
      filter.description &&
      !snippet.description
        .toLowerCase()
        .includes(filter.description.toLowerCase())
    ) {
      return false;
    }

    // Language filter
    if (
      filter.language &&
      snippet.language.toLowerCase() !== filter.language.toLowerCase()
    ) {
      return false;
    }

    // Code filter
    if (
      filter.code &&
      !snippet.code.toLowerCase().includes(filter.code.toLowerCase())
    ) {
      return false;
    }

    // State filter
    if (filter.state) {
      if (
        filter.state.isFavorite !== undefined &&
        snippet.state?.isFavorite !== filter.state.isFavorite
      ) {
        return false;
      }
      if (
        filter.state.isFavorite !== undefined &&
        snippet.state?.isDark !== filter.state.isDark
      ) {
        return false;
      }
    }

    // Tags filter
    if (filter.tags && filter.tags.length > 0) {
      const snippetTagNames = snippet.tags?.map(tag => tag.name.toLowerCase());
      if (
        !filter.tags.some(tagName =>
          snippetTagNames?.includes(tagName.toLowerCase()),
        )
      ) {
        return false;
      }
    }

    // If all filters pass, include this snippet
    return true;
  });
};

export default useSnippetsFilter;
