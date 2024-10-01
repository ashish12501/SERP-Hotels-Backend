// Import required modules
import express from "express";
import fetch from "node-fetch";
import cors from "cors"; // Import cors middleware
import dotenv from "dotenv"; // Import dotenv

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(cors()); // Use cors middleware to enable CORS

// Access the API key from the .env file
const SERPAPI_KEY = process.env.SERPAPI_KEY;
// Define a route for fetching hotels

app.get("/hotels", async (req, res) => {
  try {
    // Extract query parameters from the request
    const { q, currency = "INR", check_in_date, check_out_date } = req.query;

    // Check if the required parameter `q` is provided
    if (!q) {
      return res
        .status(400)
        .json({ error: "Required parameter: q (search query)" });
    }

    const hotels = await fetchHotels(
      q,
      currency,
      check_in_date,
      check_out_date
    );

    res.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

// Function to fetch hotels from SerpAPI
async function fetchHotels(q, currency, checkInDate = "", checkOutDate = "") {
  try {
    // Start building the base URL with the required parameters
    let url = `https://serpapi.com/search?engine=google_hotels&q=${q}&api_key=${SERPAPI_KEY}`;

    // Append optional check-in and check-out dates if provided
    if (checkInDate) {
      url += `&check_in_date=${checkInDate}`;
    }
    if (checkOutDate) {
      url += `&check_out_date=${checkOutDate}`;
    }

    console.log("Here is our URL ", url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch hotels from SerpAPI");
    }

    const data = await response.json();
    return data; // Return hotel results if available
  } catch (error) {
    console.error("Error fetching hotels:", error);
    throw error;
  }
}

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
