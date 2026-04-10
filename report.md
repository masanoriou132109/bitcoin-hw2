# HW 2: Robo-Advisor Report

## 1. Selected Indicator

**What indicator did you choose?**
The indicator selected for this project is the **MSTR Premium to NAV (Net Asset Value)**. It tracks the percentage difference between MicroStrategy's (MSTR) market capitalization and the actual market value of the Bitcoin (BTC) held in its corporate treasury.

**Why did you choose it?**
MicroStrategy is the most prominent Digital Asset Treasury (DAT.co) company globally. Watching its Premium to NAV is one of the most widely used statistical arbitrage metrics by institutional traders. I chose this indicator because it beautifully bridges traditional finance (TradFi) and the crypto market, providing a highly quantifiable "fear and greed" gauge specifically tailored to institutional sentiment.

## 2. Relationship with Bitcoin (BTC)

**Explain how your indicator is related to BTC**
MicroStrategy has essentially transformed into a leveraged proxy for Bitcoin. Currently holding hundreds of thousands of BTC, the underlying value of the company is intrinsically bound to Bitcoin's price. 
The "NAV" is simply the current price of BTC multiplied by MSTR's total holdings. The "Premium" exists because structural advantages—such as the ability to buy MSTR in a traditional brokerage account, options market liquidity, and the CEO's strategy of issuing debt to buy more BTC—make investors willing to pay *more* for an MSTR share than its strictly proportional fraction of BTC.

**Provide insights or hypotheses about how it affects or reflects BTC price behavior**
1. **Institutional Sentiment Gauge**: A rapidly expanding premium (e.g., soaring above 50%) historically indicates intense bullish FOMO (Fear Of Missing Out). Traditional investors are desperate for BTC exposure and are willing to overpay. This often coincides with strong upward momentum in BTC but can also serve as a warning sign for a local overheat.
2. **Mean Reversion / Arbitrage**: The premium tends to revert to a mean. If it drops to an abnormally low level (or even a discount), it typically signals a cooling of institutional interest or a potential bottoming out, opening a statistical arbitrage window (e.g., go long on MSTR, short on BTC).
3. **Structural Shift Hypothesis**: With the recent approval of US Spot Bitcoin ETFs (which offer zero-premium exposure), my hypothesis is that the historical baseline for MSTR's premium will face structural compression. MSTR is no longer the *only* game in town for traditional accounts to hold BTC, which alters how heavily the premium will correlate with BTC's upward trends moving forward.

## 3. Bonus: AI-Assisted Insights Integration
To fulfill the optional bonus requirement, this project integrates the **Google Gemini 2.5 Flash API**. 
The AI feature automatically ingests the last 15 days of price and premium data and generates a professional, contextualized summary of the current market trend (expanding vs. contracting premium) directly within the dashboard.

## 4. Deployed Website URL
**Live Demo:** [https://bitcoin-hw2-six.vercel.app](https://bitcoin-hw2-six.vercel.app)
