import { useState } from 'react';
import { searchWithAI } from '../services/gemini.service';

export const useSearch = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);

    const performSearch = async (query) => {
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        setResults(null);

        try {
            const data = await searchWithAI(query);
            const candidate = data.candidates?.[0];

            if (candidate?.content?.parts?.[0]?.text) {
                const text = candidate.content.parts[0].text;
                const sources = extractSources(candidate.groundingMetadata);

                setResults({ text, sources });
            } else {
                throw new Error('Resposta inválida da API');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return { performSearch, isLoading, error, results };
};

const extractSources = (metadata) => {
    if (!metadata?.groundingAttributions) return [];

    return metadata.groundingAttributions.map(attr => ({
        uri: attr.web?.uri,
        title: attr.web?.title
    }))
    .filter(source => source.uri && source.title);
};