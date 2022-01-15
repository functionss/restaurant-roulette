import type { NextPage } from "next";
import Head from "next/head";
import { createServer, Model } from "miragejs";

import PizzaIcon from "@icons/Pizza";
import { Suggestion, SuggestionGetResponse } from "types";

import { getSuggestion, createSuggestion } from "@fetchers/suggestions";

import { getRandomIntInRange } from "@utils/random";
import React, { useState } from "react";

// pull in default fixture data
import seedSuggestions from "@utils/seed";

// Instantiate mirage server for mocked API calls
createServer({
  models: {
    suggestion: Model,
  },

  // Load default suggestions seed data into mirage.
  seeds(server) {
    seedSuggestions.map((suggestion) => {
      server.create("suggestion", suggestion as any);
    });
  },

  routes() {
    // Return random record from suggestions collection.
    this.get("/v1/suggestions", (schema, request) => {
      //
      const suggestions = schema.suggestions.all();
      const recordCount = suggestions.models.length;

      return schema.suggestions.find(getRandomIntInRange(1, recordCount));
    });

    // Handle POST request to create new suggestion.
    this.post("/v1/suggestions", (schema, request) => {
      const suggestions = schema.suggestions.all();
      const recordCount = suggestions.models.length;

      let suggestion = JSON.parse(request.requestBody);
      suggestion.id = recordCount + 1;

      return schema.suggestions.create(suggestion);
    });
  },
});

const Home: NextPage = () => {
  const [suggestion, setSuggestion] = useState<Suggestion>();
  const [same, setSame] = useState(false);

  const clickHandler = async () => {
    let resp = await getSuggestion();

    // NOTE: It is possible that the API will return the same suggestion multiple times in a row.
    // If you get the same suggestion twice in a row, it must be destiny!
    if (resp.suggestion.id === suggestion?.id) {
      setSame(true);
    } else {
      setSame(false);
    }

    setSuggestion(resp.suggestion);
  };

  const handleNewSuggestion = async () => {
    const suggestion = {
      name: "Mau",
      address: "180 Spear St. San Francisco, CA",
      url: "https://www.yelp.com/biz/mau-san-francisco",
    } as Suggestion;

    const resp = await createSuggestion(suggestion);
  };

  return (
    <>
      <Head>
        <title>Restaurant Roulette</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <div className="wrapper">
        <div className="header">
          <PizzaIcon />
          <h1>Restaurant Roulette</h1>
          <button onClick={clickHandler}>Get Suggestion</button>
          <button onClick={handleNewSuggestion}>Add Suggestion</button>
        </div>
        <div className="body">
          {same && <h3 style={{ color: "red" }}>SAME!</h3>}
          {suggestion && (
            <div className="suggestion">
              {suggestion.name}
              {suggestion.address}
              {suggestion.url}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
