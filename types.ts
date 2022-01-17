export type Suggestion = {
  id?: number;
  name: string;
  address: string;
  url: string;
};

export type SuggestionGetResponse = {
  suggestion: Suggestion;
};

export type SuggestionPostResponse = {
  suggestion: Suggestion;
};

export type SuggestionListResponse = {
  suggestions: Suggestion[];
};

export type APIErrorResponse = {
  error_message: string;
};
