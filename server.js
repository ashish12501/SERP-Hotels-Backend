// Import required modules
import express from "express";
import fetch from "node-fetch";
import cors from "cors"; // Import cors middleware

const app = express();
app.use(cors()); // Use cors middleware to enable CORS

// Access the API key from the .env file
const apiKey = process.env.SERPAPI_KEY;

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
async function fetchHotels(q, currency, check_in_date, check_out_date) {
  try {
    // Build the URL for the API request
    let url = `https://serpapi.com/search.json?engine=google_hotels&q=${encodeURIComponent(
      q
    )}&currency=${currency}&api_key=${apiKey}&hl=en`;

    // Add optional parameters to the URL if they are provided
    if (check_in_date) url += `&check_in_date=${check_in_date}`;
    if (check_out_date) url += `&check_out_date=${check_out_date}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch hotels from SerpAPI");
    }

    const data = await response.json();
    console.log(data);
    return data.hotels_results || []; // Return hotel results if available
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
