const API_URL = `${typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000'}/api/grocery-prices`;

/**
 * Fetch grocery prices for given ingredients from the backend
 * @param {string[]} ingredients - Array of ingredient names
 * @param {function} onData - Callback function to handle streamed data
 * @returns {Promise<void>}
 */
export async function getGroceryPrices(ingredients, onData) {
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    throw new Error("ingredients array is required");
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch grocery prices: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      buffer = lines[lines.length - 1];

      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i];
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.done) return;
            if (onData) onData(data);
          } catch (e) {
            console.error("Failed to parse SSE data:", e);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching grocery prices:", error);
    throw error;
  }
}

/**
 * Legacy function for getting a static list (kept for backward compatibility)
 * @deprecated Use getGroceryPrices instead
 */
export async function getGroceryList() {
  return [];
}