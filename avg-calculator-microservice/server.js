const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;
const WINDOW_SIZE = 10;
const TIMEOUT_MS = 500;
let storedNumbers = [];

const BASE_URL = "http://20.244.56.144/evaluation-service";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ4MjM1ODIwLCJpYXQiOjE3NDgyMzU1MjAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjBjMjhlZmExLTU5MTgtNGRkNC04ZDczLTVhODNmYjIwZDk5MyIsInN1YiI6ImR2ZW5rYXRhcmFvOTUyQGdtYWlsLmNvbSJ9LCJlbWFpbCI6ImR2ZW5rYXRhcmFvOTUyQGdtYWlsLmNvbSIsIm5hbWUiOiJkYXNhcmkgdmVua2F0YXJhbyIsInJvbGxObyI6IjIyMTAyYTAyMDAzOSIsImFjY2Vzc0NvZGUiOiJkSkZ1ZkUiLCJjbGllbnRJRCI6IjBjMjhlZmExLTU5MTgtNGRkNC04ZDczLTVhODNmYjIwZDk5MyIsImNsaWVudFNlY3JldCI6ImJjcUZCZmZ4WWJUSmdyVXcifQ.igksLdBssF0GbbIOySxR4JippTtIk8wkfLcQzBOSyhk";

async function fetchNumbers(type) {
    try {
        const response = await axios.get(`${BASE_URL}/numbers/${type}`, {
            timeout: TIMEOUT_MS,
            headers: {
                Authorization: AUTH_TOKEN
            }
        });

        return response.data.numbers || [];
    } catch (error) {
        return [];
    }
}

app.get("/numbers/:numberid", async (req, res) => {
    const { numberid } = req.params;

    if (!["p", "f", "e", "r"].includes(numberid)) {
        return res.status(400).json({
            error: "Invalid number ID. Use 'p', 'f', 'e', or 'r'."
        });
    }

    const numbers = await fetchNumbers(numberid);
    const windowPrevState = [...storedNumbers];

    for (const num of numbers) {
        if (!storedNumbers.includes(num)) {
            if (storedNumbers.length >= WINDOW_SIZE) {
                storedNumbers.shift();
            }
            storedNumbers.push(num);
        }
    }

    const avg =
        storedNumbers.length > 0
            ? parseFloat(
                  (
                      storedNumbers.reduce((sum, val) => sum + val, 0) /
                      storedNumbers.length
                  ).toFixed(2)
              )
            : 0;

    return res.json({
        windowPrevState,
        windowCurrState: [...storedNumbers],
        numbers,
        avg
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
