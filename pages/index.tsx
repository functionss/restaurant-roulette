/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import React, { useState } from "react";

import type { NextPage } from "next";
import Head from "next/head";

import PizzaIcon from "@icons/Pizza";
import RefreshIcon from "@icons/Refresh";
import AddIcon from "@icons/Add";

import type { Suggestion } from "types";
import { getSuggestion, createSuggestion } from "@fetchers/suggestions";
import setupMirage from "@utils/mirage";

import styles from "@styles/Home.module.css";

setupMirage();

const Home: NextPage = () => {
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [same, setSame] = useState(false);

  const mapImage =
    suggestion !== null
      ? `https://maps.googleapis.com/maps/api/staticmap?&center=${suggestion.name}+${suggestion.address}&zoom=16&size=640x300&scale=2&key=AIzaSyBxnrgh8XKoeQQ7McVIjhZNfOPNRaG0FOM`
      : "";
  const mapLink =
    suggestion !== null
      ? `https://www.google.com/maps/search/?api=1&query=${suggestion.name}+${suggestion.address}`
      : "";

  const clickHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    //  Start spinning as soon as the button is clicked
    setLoading(true);

    let resp = await getSuggestion();

    // NOTE: It is possible that the API will return the same suggestion multiple times in a row.
    // If you get the same suggestion twice in a row, it must be destiny!
    resp.suggestion.id === suggestion?.id ? setSame(true) : setSame(false);

    setSuggestion(resp.suggestion);
    setLoading(false);
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
          <a href="#" onClick={clickHandler}>
            <PizzaIcon
              className={`${styles.pizzaLogo} ${loading ? styles.spin : ""}`}
              width={75}
              height={75}
            />
          </a>
          <a href="/">
            <h1>Restaurant Roulette</h1>
          </a>
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
          {suggestion && (
            <div
              className={`${styles.suggestion} ${loading ? styles.fade : ""}`}
            >
              <div className={styles.title}>
                <a
                  href={suggestion.url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <h2 className={styles.suggestionName}>{suggestion.name}</h2>
                </a>
                <h3 className={styles.suggestionAddress}>
                  {suggestion.address}
                </h3>
              </div>

              <div className={styles.map}>
                <a href={mapLink} target="_blank" rel="noreferrer noopener">
                  <img
                    src={mapImage}
                    alt={`${suggestion.name} - ${suggestion.address}`}
                  />
                </a>
              </div>

              {same && (
                <div className={styles.same}>
                  <p>
                    Whoa, you spun the same restaurant twice in a row. It must
                    be destiny!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
