const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getGroceryPrices(ingredients) {
    const res = await fetch(`${API_BASE}/api/grocery-prices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch grocery prices");
    }
    return res.json();
}
