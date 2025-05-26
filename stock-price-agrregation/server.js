const express = require("express");
const app = express();
const PORT = 3000;

const stockData = {
  NVDA: [
    { price: 231.95296, lastUpdatedAt: new Date("2025-05-08T04:26:27.46584917Z") },
    { price: 124.95156, lastUpdatedAt: new Date("2025-05-08T04:30:23.465940341Z") },
    { price: 459.09558, lastUpdatedAt: new Date("2025-05-08T04:39:14.464887447Z") },
    { price: 998.27924, lastUpdatedAt: new Date("2025-05-08T04:50:03.464903606Z") },
  ],
  PYPL: [
    { price: 680.59766, lastUpdatedAt: new Date("2025-05-09T02:04:27.464908465Z") },
    { price: 652.6387, lastUpdatedAt: new Date("2025-05-09T02:16:15.466525768Z") },
    { price: 42.583908, lastUpdatedAt: new Date("2025-05-09T02:23:08.465127888Z") },
  ],
};

function filterPrices(prices, minutes) {
  const cutoff = new Date(Date.now() - minutes * 60 * 1000);
  return prices.filter(({ lastUpdatedAt }) => lastUpdatedAt >= cutoff);
}

function calculateAverage(prices) {
  if (!prices.length) return null;
  const sum = prices.reduce((acc, p) => acc + p.price, 0);
  return parseFloat((sum / prices.length).toFixed(6));
}

function alignPriceData(stockA, stockB, maxDiffMs = 5 * 60 * 1000) {
  const alignedA = [];
  const alignedB = [];
  let i = 0, j = 0;
  while (i < stockA.length && j < stockB.length) {
    const diff = stockA[i].lastUpdatedAt - stockB[j].lastUpdatedAt;
    if (Math.abs(diff) <= maxDiffMs) {
      alignedA.push(stockA[i].price);
      alignedB.push(stockB[j].price);
      i++;
      j++;
    } else if (diff < 0) {
      i++;
    } else {
      j++;
    }
  }
  return { alignedA, alignedB };
}

function pearsonCorrelation(x, y) {
  const n = x.length;
  if (n === 0 || y.length !== n) return null;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, val, idx) => acc + val * y[idx], 0);
  const sumX2 = x.reduce((acc, val) => acc + val * val, 0);
  const sumY2 = y.reduce((acc, val) => acc + val * val, 0);
  const numerator = (n * sumXY) - (sumX * sumY);
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  if (denominator === 0) return null;
  return parseFloat((numerator / denominator).toFixed(4));
}

app.get("/stockcorrelation", (req, res) => {
  const minutes = parseInt(req.query.minutes);
  const tickers = req.query.ticker;

  if (!minutes || isNaN(minutes) || minutes <= 0) {
    return res.status(400).json({ error: "Invalid minutes query param" });
  }

  if (!tickers || !Array.isArray(tickers) || tickers.length !== 2) {
    return res.status(400).json({ error: "Exactly two ticker query params required" });
  }

  const [tickerA, tickerB] = tickers.map(t => t.toUpperCase());

  if (!stockData[tickerA] || !stockData[tickerB]) {
    return res.status(404).json({ error: "One or both tickers not found" });
  }

  const pricesA = filterPrices(stockData[tickerA], minutes);
  const pricesB = filterPrices(stockData[tickerB], minutes);

  const avgA = calculateAverage(pricesA);
  const avgB = calculateAverage(pricesB);

  const { alignedA, alignedB } = alignPriceData(pricesA, pricesB);

  if (alignedA.length < 2) {
    return res.status(400).json({ error: "Not enough overlapping data to calculate correlation" });
  }

  const correlation = pearsonCorrelation(alignedA, alignedB);

  res.json({
    correlation,
    stocks: {
      [tickerA]: {
        averagePrice: avgA,
        priceHistory: pricesA.map(p => ({ price: p.price, lastUpdatedAt: p.lastUpdatedAt.toISOString() })),
      },
      [tickerB]: {
        averagePrice: avgB,
        priceHistory: pricesB.map(p => ({ price: p.price, lastUpdatedAt: p.lastUpdatedAt.toISOString() })),
      },
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
