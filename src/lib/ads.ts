// Sample advertising assumptions for the estimate card; replace with real tariffs.
export const COST_PER_CLICK = 1_500; // toman
export const CONVERSION_RATE = 0.025;
export const AVERAGE_ORDER = 4_200_000; // toman

/** Rough daily estimate for a featured-product campaign with the given budget (toman). */
export function estimateCampaign(dailyBudget: number, cpc = COST_PER_CLICK) {
  const clicks = Math.floor(dailyBudget / cpc);
  const orders = clicks * CONVERSION_RATE;
  const sales = orders * AVERAGE_ORDER;
  return { clicks, orders, sales, roas: dailyBudget > 0 ? sales / dailyBudget : 0 };
}
