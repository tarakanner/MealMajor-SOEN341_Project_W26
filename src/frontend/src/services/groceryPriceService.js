const API_BASE = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000";

export function streamGroceryPrices(ingredients, onResult, onDone, onError) {
    fetch(`${API_BASE}/api/grocery-prices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
    }).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch grocery prices");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        function read() {
            reader.read().then(({ done, value }) => {
                if (done) { onDone(); return; }

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop(); // keep incomplete line

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;
                    try {
                        const data = JSON.parse(line.slice(6));
                        if (data.done) { onDone(); return; }
                        onResult(data);
                    } catch { /* skip malformed */ }
                }
                read();
            });
        }
        read();
    }).catch(onError);
}
