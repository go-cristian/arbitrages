// create test for arbitrageOpportunity function

import { ArbitrageOpportunity, ArbitrageResult, arbitrageOpportunity } from "./arbitrage";


describe('arbitrage', () => {
  test('Bet on Home', () => {
    const arb = {
      best_price_home_odd: 100,
      best_price_away_odd: 200,
      arb_percent: 1,
    };
    const result = arbitrageOpportunity(arb);
    expect(result).toBe(ArbitrageResult.BetOnHome);
  });

  test('Bet on Away', () => {
    const arb = {
      best_price_home_odd: 200,
      best_price_away_odd: 100,
      arb_percent: 1,
    };
    const result = arbitrageOpportunity(arb);
    expect(result).toBe(ArbitrageResult.BetOnAway);
  });

  test('No arbitrage opportunity', () => {
    const arb = {
      best_price_home_odd: 100,
      best_price_away_odd: 100,
      arb_percent: 1,
    };
    const result = arbitrageOpportunity(arb);
    expect(result).toBe(ArbitrageResult.NoArbitrage);
  });
});
