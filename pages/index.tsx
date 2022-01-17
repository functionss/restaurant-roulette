/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import React, { useState } from "react";

import type { NextPage } from "next";
import Head from "next/head";

import PizzaIcon from "@icons/Pizza";
import RefreshIcon from "@icons/Refresh";
import AddIcon from "@icons/Add";

import type { Suggestion } from "types";
import { getSuggestion } from "@fetchers/suggestions";
import setupMirage from "@utils/mirage";

import styles from "@styles/Home.module.css";
import NewSuggestionModalForm from "@components/NewSuggestionModalForm";
import SuggestionCard from "@components/SuggestionCard";

setupMirage();

const Home: NextPage = () => {
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [same, setSame] = useState(false);

  // State and methods to manage the NewSuggestionModalForm
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const openModal = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const triggerSpin = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    //  Start spinning as soon as the button is clicked
    setLoading(true);

    // If success message was set, clear it on the next spin
    setSuccessMessage(null);

    let resp = await getSuggestion();

    // NOTE: It is possible that the API will return the same suggestion multiple times in a row.
    // If you get the same suggestion twice in a row, it must be destiny!
    resp.suggestion.id === suggestion?.id ? setSame(true) : setSame(false);

    setSuggestion(resp.suggestion);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Restaurant Roulette</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <div className={styles.wrapper}>
        <div className={styles.header}>
          <a className={styles.brand} href="#" onClick={triggerSpin}>
            <PizzaIcon
              className={`${styles.pizzaLogo} ${loading ? styles.spin : ""}`}
              width={75}
              height={75}
            />
            <h1>Restaurant Roulette</h1>
          </a>

          <div className={styles.actions}>
            <button className="primary" onClick={triggerSpin}>
              <RefreshIcon className="add-margin" /> Get Suggestion
            </button>
            <button className="secondary" onClick={openModal}>
              <AddIcon />
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {successMessage && (
            <div className={styles.successMessage}>
              <img
                className={styles.drFarnsworth}
                src="/good-news.png"
                alt="Good news everyone!"
              />
              {successMessage}
            </div>
          )}

          {suggestion && (
            <SuggestionCard
              suggestion={suggestion}
              same={same}
              loading={loading}
            />
          )}
        </div>
      </div>

      <NewSuggestionModalForm
        isOpen={showModal}
        setShowModal={setShowModal}
        setSuccessMessage={setSuccessMessage}
        setSuggestion={setSuggestion}
      />
    </>
  );
};

export default Home;
