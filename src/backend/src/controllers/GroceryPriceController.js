import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const FLIPP_URL = "https://flipp.com/en-ca/montreal-qc/flyers";

export const getGroceryPrices = async (req, res) => {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ message: "ingredients array is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ message: "AI service not configured" });
    }

    const results = [];

    for (const ingredient of ingredients) {
        try {
            // Step 1: Use Google Search grounding to find real deals
            const searchModel = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                tools: [{ googleSearch: {} }],
            });

            const searchPrompt =
                `Search flipp.com and grocery flyers for current deals on "${ingredient}" ` +
                `at grocery stores in Montreal, Quebec, Canada. ` +
                `Find specific store names, prices, and product details from current weekly flyers.` +
                'find the specific store flyer link and link it (eg "https://www.metro.ca/en/flyer", "https://www.maxi.ca/en/print-flyer?navid=flyout-L2-Flyer")';

            const searchResponse = await searchModel.generateContent(searchPrompt);
            const rawDeals = searchResponse.response.text().trim();

            // Step 2: Use a plain model to extract structured JSON from the search results
            const formatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const formatPrompt =
                `Based on the following grocery deal information for "${ingredient}" in Montreal:\n\n` +
                `${rawDeals}\n\n` +
                `Extract the top 3 best deals and return ONLY a raw JSON array (absolutely no markdown, no code fences, no explanation). ` +
                `Each object must have exactly these fields: ` +
                `"name" (string – product name), ` +
                `"price" (string – formatted price like "$6.57 (per kg)" or "$12.99 (500g pack)" — always start with $ and include unit/size in parentheses), ` +
                `"storeName" (string – store name, e.g. "Maxi", "IGA", "Metro"), ` +
                `"link" (string – use "" if no direct link available). ` +
                `If no deals were found, return an empty array [].`;

            const formatResponse = await formatModel.generateContent(formatPrompt);
            const aiText = formatResponse.response.text().trim();
            console.log(`[GroceryPrices] Raw AI output for "${ingredient}":\n`, aiText);

            // Strip markdown code fences if present
            const cleaned = aiText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
            const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
            const offers = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

            results.push({ ingredient, offers, source: FLIPP_URL });
        } catch (err) {
            console.error(`Error processing "${ingredient}":`, err.message);
            results.push({
                ingredient,
                offers: [
                    {
                        name: ingredient,
                        price: "N/A",
                        storeName: "",
                        link: FLIPP_URL,
                    },
                ],
            });
        }
    }

    res.json({ results });
};
