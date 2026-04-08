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

    // Set up SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

    for (const ingredient of ingredients) {
        try {
            const searchModel = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                tools: [{ googleSearch: {} }],
            });

            const searchPrompt =
                `Search for current deals on "${ingredient}" at grocery stores in Montreal, Quebec, Canada. ` +
                `For each store you find, also search for that store's official website flyer page URL ` +
                `(for example: Metro's flyer is at https://www.metro.ca/en/flyer, ` +
                `Maxi's flyer is at https://www.maxi.ca/en/print-flyer, ` +
                `IGA's flyer is at https://www.iga.net/en/flyer, ` +
                `Super C's flyer is at https://www.superc.ca/en/flyer, ` +
                `Provigo's flyer is at https://www.provigo.ca/en/flyer). ` +
                `Find the correct flyer page URL for each store that has the deal.`;

            const searchResponse = await searchModel.generateContent(searchPrompt);
            const rawDeals = searchResponse.response.text().trim();
            console.log(`[GroceryPrices] Search results for "${ingredient}":\n`, rawDeals);

            const formatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const formatPrompt =
                `Based on the following grocery deal information for "${ingredient}" in Montreal:\n\n` +
                `${rawDeals}\n\n` +
                `Extract the top 3 best deals and return ONLY a raw JSON array (absolutely no markdown, no code fences, no explanation). ` +
                `Each object must have exactly these fields: ` +
                `"name" (string – product name), ` +
                `"price" (string – formatted price like "$6.57 (per kg)" or "$12.99 (500g pack)" — always start with $ and include unit/size in parentheses), ` +
                `"storeName" (string – store name, e.g. "Maxi", "IGA", "Metro"), ` +
                `"link" (string – the official flyer page URL of that store's website, e.g. "https://www.metro.ca/en/flyer" for Metro — use "${FLIPP_URL}" only if the store's flyer URL was not found). ` +
                `If no deals were found, return an empty array [].`;

            const formatResponse = await formatModel.generateContent(formatPrompt);
            const aiText = formatResponse.response.text().trim();

            const cleaned = aiText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
            const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
            const offers = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

            console.log(`[GroceryPrices] Parsed JSON for "${ingredient}":`, JSON.stringify(offers, null, 2));

            send({ ingredient, offers, source: FLIPP_URL });
        } catch (err) {
            console.error(`Error processing "${ingredient}":`, err.message);
            send({
                ingredient,
                offers: [{ name: ingredient, price: "N/A", storeName: "", link: FLIPP_URL }],
            });
        }
    }

    // Signal stream is done
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
};
