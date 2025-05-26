const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;
const WINDOW_SIZE = 10;
const TIMEOUT_MS = 500;
const storedNumbers = [];

const NUMBER_API_URL = "https://test-server.com/numbers"; 


const fetchNumber = async (type) => {
    try {
        const source = axios.CancelToken.source();
        const timeout = setTimeout(() => source.cancel("Timeout exceeded"), TIMEOUT_MS);

        const response = await axios.get(`${NUMBER_API_URL}/${type}`, {
            cancelToken: source.token,
        });

        clearTimeout(timeout); 

        if (response.data && typeof response.data.number === "number") {
            return response.data.number;
        }
    } catch (error) {
        console.warn("Fetch failed:", error.message);
    }
    return null;
};

app.get("/numbers/:numberid", async (req, res) => {
    const { numberid } = req.params;

    if (!["p", "f", "e", "r"].includes(numberid)) {
        return res.status(400).json({ error: "Invalid number ID. Use 'p', 'f', 'e', or 'r'." });
    }

    const oldNumbers = [...storedNumbers]; 

    const newNumber = await fetchNumber(numberid);

    if (newNumber !== null && !storedNumbers.includes(newNumber)) {
        if (storedNumbers.length >= WINDOW_SIZE) {
            storedNumbers.shift(); 
        }
        storedNumbers.push(newNumber);
    }

    const average = storedNumbers.length > 0
        ? parseFloat((storedNumbers.reduce((a, b) => a + b, 0) / storedNumbers.length).toFixed(2))
        : null;

    return res.json({
        storedBefore: oldNumbers,
        storedAfter: storedNumbers,
        average,
    });
});


app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
