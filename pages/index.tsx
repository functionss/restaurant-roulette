import React, { useState } from "react";

import type { NextPage } from "next";
import Head from "next/head";

import PizzaIcon from "@icons/Pizza";
import RefreshIcon from "@icons/Refresh";
import AddIcon from "@icons/Add";

import type { Suggestion, SuggestionGetResponse } from "types";
import { getSuggestion, createSuggestion } from "@fetchers/suggestions";
import setupMirage from "@utils/mirage";

import styles from "@styles/Home.module.css";

setupMirage();

const Home: NextPage = () => {
  const [suggestion, setSuggestion] = useState<Suggestion>();
  const [same, setSame] = useState(false);

  const clickHandler = async () => {
    let resp = await getSuggestion();

    // NOTE: It is possible that the API will return the same suggestion multiple times in a row.
    // If you get the same suggestion twice in a row, it must be destiny!
    resp.suggestion.id === suggestion?.id ? setSame(true) : setSame(false);

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

      <div className={styles.wrapper}>
        <div className={styles.header}>
          <PizzaIcon />
          <h1>Restaurant Roulette</h1>

          <div className={styles.actions}>
            <button className="primary" onClick={clickHandler}>
              <RefreshIcon className="add-margin" /> Get Suggestion
            </button>
            <button className="secondary" onClick={handleNewSuggestion}>
              <AddIcon />
            </button>
          </div>
        </div>
        <div className={styles.content}>
          {same && <h3 style={{ color: "red" }}>SAME!</h3>}
          {suggestion && (
            <div className={styles.suggestion}>
              {suggestion.name}
              <br />
              {suggestion.address}
              <br />
              {suggestion.url}
              <br />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
