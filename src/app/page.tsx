'use client';

import Image from "next/image";
import { Arbitrage, ArbitrageResult, arbitrageOpportunity, retrieveArbitrage } from "./data/arbitrage";
import { useQuery } from "react-query";

export default function Home() {
  const {
    data: arbitrages,
    error,
    isLoading,
  } = useQuery("postsData", retrieveArbitrage);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 right-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Frontend Challenge, powered By{" "}
            <Image
              src="/logo.webp"
              alt="OddsJam Logo"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
        <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
          <tr>
            <th scope="col" className="px-6 py-4">Match</th>
            <th scope="col" className="px-6 py-4">Market</th>
            <th scope="col" className="px-6 py-4">Arb Percent</th>
            <th scope="col" className="px-6 py-4">Opportunity</th>
            <th scope="col" className="px-6 py-4">Odd Books</th>
          </tr>
        </thead>
        <tbody>
          {arbitrages?.map((arbitrage, index) => {
            return <ArbitrageItem key={index} arbitrage={arbitrage} />;
          })}
        </tbody>
      </table>
    </main>
  );
}

function ArbitrageItem({ arbitrage }: { arbitrage: Arbitrage }) {
  const opportunity = arbitrageOpportunity(arbitrage);
  const oddBooks = opportunity === ArbitrageResult.BetOnHome ? arbitrage.best_price_home_odd_books : ArbitrageResult.BetOnAway ? arbitrage.best_price_away_odd_books : [];
  return (
    <tr className="border-b border-neutral-200 dark:border-white/10">
      <td>{arbitrage.home_team} vs. {arbitrage.away_team}</td>
      <td>{arbitrage.market}</td>
      <td>{arbitrage.arb_percent}</td>
      <td>{opportunity}</td>
      <td>
        <ul>
          {oddBooks.map((book) => (
            <li key={book}>{book}</li>
          ))}
        </ul>
      </td>
    </tr>
  );
}
