const API_URL = import.meta.env.VITE_GEMINI_API_URL;
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Mock de respostas para testes sem API Key real
const getMockResponse = (query) => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('solar') || lowerQuery.includes('energia')) {
    return {
      candidates: [{
        content: {
          parts: [{
            text: "A energia solar no Brasil tem crescido exponencialmente. Em 2026, ela se consolidou como uma das principais fontes da matriz elétrica nacional, ultrapassando marcas históricas em capacidade instalada. O investimento na instalação de painéis fotovoltaicos residenciais e comerciais continua sendo viabilizado por incentivos fiscais e pela busca por redução na conta de luz, além dos benefícios ambientais óbvios, como a redução da pegada de carbono."
          }]
        },
        groundingMetadata: {
          groundingAttributions: [
            {
              web: {
                uri: "https://www.canalenergia.com.br",
                title: "CanalEnergia - Notícias e Análises do Setor Elétrico"
              }
            },
            {
              web: {
                uri: "https://www.absolar.org.br",
                title: "ABSOLAR - Associação Brasileira de Energia Solar Fotovoltaica"
              }
            }
          ]
        }
      }]
    };
  }

  if (lowerQuery.includes('ia') || lowerQuery.includes('inteligência artificial') || lowerQuery.includes('gemini')) {
    return {
      candidates: [{
        content: {
          parts: [{
            text: "O Gemini 2.5 representa um avanço significativo em modelos multimodais de inteligência artificial da Google. Ele traz respostas muito mais rápidas, capacidades aprimoradas de raciocínio lógico, tradução simultânea e integração nativa com ferramentas de pesquisa na web em tempo real (Google Search Grounding). No Brasil, o uso corporativo e acadêmico dessas tecnologias cresceu mais de 45% nos últimos dois anos."
          }]
        },
        groundingMetadata: {
          groundingAttributions: [
            {
              web: {
                uri: "https://blog.google/intl/pt-br/",
                title: "Google Blog Brasil - Novidades e Lançamentos"
              }
            },
            {
              web: {
                uri: "https://g1.globo.com/tecnologia/",
                title: "G1 Tecnologia - Notícias sobre Inteligência Artificial"
              }
            }
          ]
        }
      }]
    };
  }

  if (lowerQuery.includes('receita') || lowerQuery.includes('jantar') || lowerQuery.includes('comida')) {
    return {
      candidates: [{
        content: {
          parts: [{
            text: "Uma excelente receita para um jantar prático e sofisticado é o Salmão ao Molho de Maracujá acompanhado de risoto de limão siciliano. O prato fica pronto em menos de 40 minutos e combina o frescor e a acidez do maracujá com a suavidade do peixe grelhado. Outra opção rápida são os bowls de quinoa com vegetais grelhados e molho tahine."
          }]
        },
        groundingMetadata: {
          groundingAttributions: [
            {
              web: {
                uri: "https://www.tudogostoso.com.br",
                title: "TudoGostoso - Receitas Rápidas e Práticas para Jantar"
              }
            },
            {
              web: {
                uri: "https://www.panelinha.com.br",
                title: "Panelinha (Rita Lobo) - Comida de Verdade e Prática"
              }
            }
          ]
        }
      }]
    };
  }

  // Resposta genérica padrão
  return {
    candidates: [{
      content: {
        parts: [{
          text: `Esta é uma resposta de demonstração inteligente gerada para a sua pergunta: "${query}". Para obter resultados em tempo real baseados na API do Gemini com Google Search, configure uma chave de API (VITE_GEMINI_API_KEY) válida no arquivo .env do cliente.`
        }]
      },
      groundingMetadata: {
        groundingAttributions: [
          {
            web: {
              uri: "https://ai.google.dev",
              title: "Google AI para Desenvolvedores - Documentação Gemini"
            }
          },
          {
            web: {
              uri: "https://github.com/DShebarro",
              title: "GitHub - DShebarro (Criador do Projeto)"
            }
          }
        ]
      }
    }]
  };
};

export const searchWithAI = async (query) => {
    // Se não houver chave ou ela for provisória, usar mock
    if (!API_KEY || API_KEY === 'sua_chave_aqui' || !API_URL) {
      console.log("Modo de teste: Utilizando resposta mockada do Gemini.");
      // Simula latência de rede
      await new Promise(resolve => setTimeout(resolve, 1500));
      return getMockResponse(query);
    }

    const systemPrompt = 
    "Você é um assistente de pesquisa avançado. Sua tarefa é responder à pergunta do usuário com base em informações da web. Forneça uma resposta clara, concisa e direta. NÃO use markdown na sua resposta, apenas texto simples."

    const payload = {
        contents: [{ parts: [{ text: query}] }],
        tools: [{ google_search: {} }],
        systemInstruction: { parts: [{ text: systemPrompt }]}
    };

    const response = await fetchWithRetry(
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

const fetchWithRetry = async (URL, options, retries = 3, delay = 1000) => {
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