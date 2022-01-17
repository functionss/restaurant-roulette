/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import React, { useState, useEffect } from "react";

import type { NextPage } from "next";
import Head from "next/head";

import PizzaIcon from "@icons/Pizza";
import RefreshIcon from "@icons/Refresh";
import AddIcon from "@icons/Add";

import NewSuggestionModalForm from "@components/NewSuggestionModalForm";
import SuggestionCard from "@components/SuggestionCard";
import type {
  Suggestion,
  SuggestionListResponse,
  APIErrorResponse,
} from "types";

import setupMirage from "@utils/mirage";

import styles from "@styles/Home.module.css";

setupMirage();

const Home: NextPage = () => {
  const [suggestionList, setSuggestionList] = useState<Suggestion[]>([]);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [destiny, setDestiny] = useState(false);

  // State and methods to manage the NewSuggestionModalForm
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const openModal = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  useEffect(() => {
    (async () => {
      try {
        let response = await fetch("/v1/suggestions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          const respJSON = (await response.json()) as SuggestionListResponse;
          setSuggestionList(respJSON.suggestions);
        } else {
          const respJSON = (await response.json()) as APIErrorResponse;
          setErrorMessage(respJSON.error_message);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Unable to fetch suggestions, please try again later.");
      }
    })();
  }, []);

  const triggerSpin = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    //  Start spinning as soon as the button is clicked
    setLoading(true);

    // If success message was set, clear it on the next spin
    setSuccessMessage(null);

    let randomSuggestion =
      suggestionList[Math.floor(Math.random() * suggestionList.length)];

    // NOTE: It is possible to spin the same suggestion multiple times in a row.
    // If you get the same suggestion twice in a row, it must be destiny!
    randomSuggestion.id === suggestion?.id
      ? setDestiny(true)
      : setDestiny(false);

    setTimeout(() => {
      setLoading(false);
      setSuggestion(randomSuggestion);
    }, 2000);
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
              <RefreshIcon className="add-margin" />
              Spin that pizza!
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
              destiny={destiny}
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
