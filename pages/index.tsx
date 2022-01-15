import type { NextPage } from "next";
import Head from "next/head";

import PizzaIcon from "@icons/Pizza";

const Home: NextPage = () => {
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
        </div>
      </div>
    </>
  );
};

export default Home;
