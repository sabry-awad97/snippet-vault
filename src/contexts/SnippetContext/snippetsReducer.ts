import { Snippet } from '@/lib/schemas/snippet';
import { Filter, FilterType } from './types';

export interface SnippetState {
  isSnippetDialogOpen: boolean;
  isEditMode: boolean;
  editingSnippet: Snippet | null;
  filters: Filter[];
}

export type SnippetAction =
  | { type: 'SET_SNIPPET_DIALOG'; payload: boolean }
  | { type: 'SET_EDIT_MODE'; payload: boolean }
  | { type: 'SET_EDITING_SNIPPET'; payload: Snippet | null }
  | { type: 'SET_FILTER'; payload: Filter }
  | { type: 'REMOVE_FILTER'; payload: `${FilterType}` }
  | { type: 'CLEAR_FILTERS' };

export const snippetReducer = (draft: SnippetState, action: SnippetAction) => {
  switch (action.type) {
    case 'SET_SNIPPET_DIALOG':
      draft.isSnippetDialogOpen = action.payload;
      break;
    case 'SET_EDIT_MODE':
      draft.isEditMode = action.payload;
      break;
    case 'SET_EDITING_SNIPPET':
      draft.editingSnippet = action.payload;
      break;
    case 'SET_FILTER':
      const existingFilterIndex = draft.filters.findIndex(
        f => f.type === action.payload.type,
      );
      if (existingFilterIndex !== -1) {
        draft.filters[existingFilterIndex] = action.payload;
      } else {
        draft.filters.push(action.payload);
      }
      break;
    case 'REMOVE_FILTER':
      draft.filters = draft.filters.filter(f => f.type !== action.payload);
      break;
    case 'CLEAR_FILTERS':
      draft.filters = [];
      break;
    default:
      break;
  }
};
