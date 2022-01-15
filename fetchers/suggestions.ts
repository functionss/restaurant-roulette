import { Suggestion, SuggestionGetResponse } from "types";

export const getSuggestion = async () => {
  try {
    let response = await fetch("/v1/suggestions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  } catch (error) {
    // Error handling here!
  }
};

export const createSuggestion = async (suggestion: Suggestion) => {
  try {
    let response = await fetch("/v1/suggestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(suggestion),
    });
    return response.json();
  } catch (error) {
    // Error handling here!
  }
};
