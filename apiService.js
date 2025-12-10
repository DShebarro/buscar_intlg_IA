document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    const resultsArea = document.getElementById('resultsArea');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsContent = document.getElementById('resultsContent');
    const errorMessage = document.getElementById('errorMessage');

    const aiResponse = document.getElementById('aiResponse');
    const aiSources = document.getElementById('aiSources');

    const API_KEY = "";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

    // Função principal
    const handleSearch = async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        // Reset UI
        resultsArea.classList.remove('hidden');
        resultsContent.classList.add('hidden');
        errorMessage.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');
        aiResponse.textContent = '';
        aiSources.innerHTML = '';

        try {
            const systemPrompt = "Você é um assistente de pesquisa avançado.";

            const payload = {
                contents: [{ parts: [{ text: query }] }],
                tools: [{ google_search: {} }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
            };

            const response = await fetchWithBackoff(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`Status: ${response.status}`);

            const result = await response.json();
            const candidate = result.candidates?.[0];

            if (candidate && candidate.content?.parts?.[0]?.text) {
                aiResponse.textContent = candidate.content.parts[0].text;

                const groundingMetadata = candidate.groundingMetadata;
                let sources = [];

                if (groundingMetadata?.groundingAttributions) {
                    sources = groundingMetadata.groundingAttributions
                        .map(a => ({
                            uri: a.web?.uri,
                            title: a.web?.title
                        }))
                        .filter(s => s.uri && s.title);
                }

                if (sources.length > 0) {
                    sources.forEach(source => {
                        const el = document.createElement('a');
                        el.href = source.uri;
                        el.target = "_blank";
                        el.rel = "noopener noreferrer";
                        el.className = 'block p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors truncate';
                        el.innerHTML = `
                            <span class="font-medium text-indigo-300">${source.title}</span>
                            <span class="block text-sm text-gray-400">${source.uri}</span>
                        `;
                        aiSources.appendChild(el);
                    });
                } else {
                    aiSources.innerHTML = '<p class="text-gray-400">Nenhuma fonte específica encontrada.</p>';
                }

                resultsContent.classList.remove('hidden');

            } else {
                throw new Error("Resposta inválida.");
            }

        } catch (error) {
            console.error(error);
            errorMessage.classList.remove('hidden');
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    };
});