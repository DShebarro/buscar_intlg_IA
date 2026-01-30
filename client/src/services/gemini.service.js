const API_URL = import.meta.env.VITE_GEMINI_API_URL;
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const searchWithAI = async (query) => {
    const systemPrompt = 
    "Você é um assistente de pesquisa avançado. Sua tarefa é responder à pergunta do usuário com base em informações da web. Forneça uma resposta clara, concisa e direta. NÃO use markdown na sua resposta, apenas texto simples."

    const payload = {
        constents: [{ parts: [{ text: query}] }],
        tools: [{ google_search: {} }],
        systemInstruction: { parts: [{ text: systemPrompt }]}
    };

    const response =  await fetchWithRetry (
        `${API_URL}?key=${API_KEY}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }
    );
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};

const fetchWithRetry = async (URL, PushSubscriptionOptions, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(URL, options);
            if (response.status === 429 && i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
                continue;
            }
            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
        }
    }
}