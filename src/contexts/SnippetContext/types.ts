export enum FilterType {
  SEARCH = 'search',
  LANGUAGE = 'language',
  TAGS = 'tags',
  FAVORITE = 'favorite',
  DATE_RANGE = 'dateRange',
}

export type Filter =
  | {
      type: FilterType.SEARCH;
      value: string;
    }
  | {
      type: FilterType.LANGUAGE;
      value: string[];
    }
  | {
      type: FilterType.TAGS;
      value: string[];
    }
  | {
      type: FilterType.FAVORITE;
      value: boolean;
    }
  | {
      type: FilterType.DATE_RANGE;
      value: [Date, Date];
    };
