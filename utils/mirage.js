import { createServer, Model } from "miragejs";

// pull in default fixture data
import seedSuggestions from "@utils/seed";
import { getRandomIntInRange } from "@utils/random";

export default function setupMirage() {
  // Instantiate mirage server for mocked API calls
  createServer({
    models: {
      suggestion: Model,
    },

    // Load default suggestions seed data into mirage.
    seeds(server) {
      seedSuggestions.map((suggestion) => {
        server.create("suggestion", suggestion);
      });
    },

    routes() {
      // Return random record from suggestions collection.
      this.get(
        "/v1/suggestions",
        (schema) => {
          const suggestions = schema.suggestions.all();
          const recordCount = suggestions.models.length;

          return schema.suggestions.find(getRandomIntInRange(1, recordCount));
        },
        { timing: 2000 }
      );

      // Handle POST request to create new suggestion.
      this.post(
        "/v1/suggestions",
        (schema, request) => {
          const suggestions = schema.suggestions.all();
          const recordCount = suggestions.models.length;

          let suggestion = JSON.parse(request.requestBody);
          suggestion.id = recordCount + 1;

          return schema.suggestions.create(suggestion);
        },
        { timing: 2000 }
      );
    },
  });
}
