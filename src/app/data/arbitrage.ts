import axios from "axios";

export type Arbitrage = {
  market: string;
  is_live: boolean;
  game_id: string;
  sport: string;
  league: string;
  home_team: string;
  away_team: string;
  start_date: string;
  best_price_home_name: string;
  best_price_home_odd: number;
  best_price_home_odd_books: string[];
  best_price_away_name: string;
  best_price_away_odd: number;
  best_price_away_odd_books: string[];
  oddsjam_price_home_odd: number | null;
  oddsjam_price_away_odd: number | null;
  type: string;
  arb_percent: number;
  bet_placed: boolean;
}

export const retrieveArbitrage = async () => {
  const response = await axios.get(
    "https://6286cb6d7864d2883e79cf96.mockapi.io/arbs",
  );
  const allData = response.data as Arbitrage[];
  const filterNoOportinuties2 = allData
    .filter((arb) => arbitrageOpportunity(arb) != ArbitrageResult.NoArbitrage)
    .sort((a, b) => b.arb_percent - a.arb_percent);
  return filterNoOportinuties2;
};

export enum ArbitrageResult {
  BetOnHome = "Bet on home team for arbitrage profit",
  BetOnAway = "Bet on away team for arbitrage profit",
  NoArbitrage = "No arbitrage opportunity",
}

export type ArbitrageOpportunity = {
  best_price_home_odd: number;
  best_price_away_odd: number;
  arb_percent: number;
}
/**
 * As my knowledge in betting is not very good, I'm not sure if this function is correct.
 * This is the conversation I had with ChatGPT about this function:
 * https://chat.openai.com/share/16d94bdd-b8fb-4100-bc77-7c811d350b12
 *
 * @param arb
 * @returns
 */
export function arbitrageOpportunity(arb: ArbitrageOpportunity): ArbitrageResult {
  const impliedProbHome = (arb.best_price_home_odd > 0) ? 100 / (arb.best_price_home_odd + 100) : -arb.best_price_home_odd / (-arb.best_price_home_odd + 100);
  console.log('🚀 => arbitrageOpportunity => impliedProbHome:', impliedProbHome)
  const impliedProbAway = (arb.best_price_away_odd > 0) ? 100 / (arb.best_price_away_odd + 100) : -arb.best_price_away_odd / (-arb.best_price_away_odd + 100);
  console.log('🚀 => arbitrageOpportunity => impliedProbAway:', impliedProbAway)

  // Check if arbitrage opportunity exists
  if (impliedProbHome + impliedProbAway < 1) {
      // Calculate arbitrage percentages
      const totalImpliedProb = impliedProbHome + impliedProbAway;

      const arbPercentHome = impliedProbHome * arb.arb_percent / totalImpliedProb;
      const arbPercentAway = impliedProbAway * arb.arb_percent / totalImpliedProb;
      // Compare arbitrage percentages
      if (arbPercentHome > arbPercentAway) {
          return ArbitrageResult.BetOnHome;
      } else {
          return ArbitrageResult.BetOnAway;
      }
  } else {
      return ArbitrageResult.NoArbitrage;
  }
}
