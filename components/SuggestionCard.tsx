/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import React, { useState } from "react";

import Image from "next/image";

import PizzaIcon from "@icons/Pizza";
import RefreshIcon from "@icons/Refresh";
import AddIcon from "@icons/Add";

import type { Suggestion } from "types";
import { getSuggestion, createSuggestion } from "@fetchers/suggestions";
import setupMirage from "@utils/mirage";

import styles from "@styles/SuggestionCard.module.css";

interface PropTypes {
  suggestion: Suggestion;
  loading: boolean;
  destiny: boolean;
}

function SuggestionCard({ suggestion, loading, destiny }: PropTypes) {
  const mapImage =
    suggestion !== null
      ? `https://maps.googleapis.com/maps/api/staticmap?markers=${suggestion.address}&center=${suggestion.name}+${suggestion.address}&zoom=16&size=640x300&scale=2&style=feature:poi.business|visibility:on&key=AIzaSyBxnrgh8XKoeQQ7McVIjhZNfOPNRaG0FOM`
      : "";
  const mapLink =
    suggestion !== null
      ? `https://www.google.com/maps/search/?api=1&query=${suggestion.name}+${suggestion.address}`
      : "";

  return (
    <div className={`${styles.suggestion} ${loading ? styles.fade : ""}`}>
      <div className={styles.title}>
        <a href={suggestion.url} target="_blank" rel="noreferrer noopener">
          <h2 className={styles.suggestionName}>{suggestion.name}</h2>
        </a>
        <h3 className={styles.suggestionAddress}>{suggestion.address}</h3>

        {destiny && (
          <p className={styles.destiny}>
            Whoa, you spun the destiny restaurant twice in a row. it must be{" "}
            <strong>DESTINY!</strong>
          </p>
        )}
      </div>

      <div className={styles.map}>
        <a href={mapLink} target="_blank" rel="noreferrer noopener">
          <Image
            src={mapImage}
            alt={`${suggestion.name} - ${suggestion.address}`}
            width={640}
            height={300}
          />
        </a>
      </div>
    </div>
  );
}

export default SuggestionCard;
