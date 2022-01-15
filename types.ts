export type Suggestion = {
  id?: number;
  name: string;
  address: string;
  url: string;
};

export type SuggestionGetResponse = {
  suggestion: Suggestion;
};

export type SuggestionListResponse = {
  suggestions: Suggestion[];
};
