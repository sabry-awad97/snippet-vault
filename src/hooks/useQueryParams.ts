import { SnippetFilter } from '@/lib/tauri/api/snippet';
import { useSearchParams } from 'next/navigation';

export default function useQueryParams() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');
  const search = searchParams.get('search');
  const tagsParam = searchParams.get('tags');

  const filter: SnippetFilter = {};

  if (filterParam === 'favorites') {
    filter.state = { isFavorite: true };
  } else if (filterParam === 'trash') {
    // filter.state = { isDeleted: true };
  }

  if (tagsParam) {
    filter.tags = tagsParam.split(',');
  }

  if (search) {
    filter.search = search;
  }

  return filter;
}
