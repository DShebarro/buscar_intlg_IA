import { useState, useEffect } from 'react';
import { useSearch } from './hooks/useSearch';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const { performSearch, isLoading, error, results } = useSearch();
  const [comments, setComments] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [commentSuccess, setCommentSuccess] = useState('');

  const popularSearches = [
    'Futuro da IA no Brasil',
    'Investimento em energia solar',
    'Como funciona o Gemini 2.5',
    'Melhores receitas para jantar',
    'Notícias de tecnologia'
  ];

  // Carregar comentários
  const fetchComments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/comments');
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (err) {
      console.error('Erro ao carregar comentários do servidor:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
    }
  };

  const handleTagClick = (tagText) => {
    setQuery(tagText);
    performSearch(tagText);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!authorName.trim() || !commentContent.trim()) return;

    setSubmittingComment(true);
    setCommentError(null);
    setCommentSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          author_name: authorName,
          content: commentContent
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Erro ao enviar comentário.');
      }

      setAuthorName('');
      setCommentContent('');
      setCommentSuccess('Comentário enviado com sucesso!');
      fetchComments(); // Recarregar comentários
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Helper para formatar data dos comentários
  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  // Helper para extrair o domínio da URI da fonte
  const getDomain = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace('www.', '');
    } catch {
      return 'web';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navegação */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              Ds
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              intelli<span className="text-indigo-400">.IA</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://dshebarro.github.io/Profile_Dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Portfólio
            </a>
            <a
              href="#feedback"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Feedback
            </a>
            <a
              href="mailto:yvda.shebs20@gmail.com"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg transition-all"
            >
              Contato
            </a>
          </div>
        </div>
      </nav>

      {/* Seção Hero & Busca */}
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex flex-col gap-12">
        <section className="text-center space-y-4">
          <span className="px-3 py-1 text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full animate-pulse-slow">
            Pesquisa Conectada à Web
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Sua busca, uma definição com a <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              DsIntelli-IA
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Obtenha resultados mais precisos e respostas diretas. A inteligência artificial analisa,
            resume as informações em tempo real e fornece fontes verificadas da web.
          </p>
        </section>

        {/* Input de Busca */}
        <section className="w-full">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-30 group-focus-within:opacity-50 transition duration-300"></div>
            <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-2 pl-4">
              <svg className="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="O que você deseja pesquisar hoje?"
                className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-white text-base sm:text-lg px-3 placeholder:text-slate-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 mr-2 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/40 disabled:text-slate-400 text-white font-semibold rounded-xl px-6 py-3 text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Buscando...</span>
                  </>
                ) : (
                  <span>Pesquisar</span>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Sugestões Rápidas */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase text-center sm:text-left">
            O que estão buscando?
          </h3>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {popularSearches.map((searchTag) => (
              <button
                key={searchTag}
                type="button"
                onClick={() => handleTagClick(searchTag)}
                className="px-4 py-2 text-xs font-medium bg-slate-900 border border-slate-800 rounded-full hover:border-indigo-500/50 hover:bg-slate-900/50 transition-all text-slate-300 hover:text-indigo-400 cursor-pointer"
              >
                {searchTag}
              </button>
            ))}
          </div>
        </section>

        {/* Resultados */}
        {(isLoading || results || error) && (
          <section className="border border-slate-900 bg-slate-900/30 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
            {isLoading && (
              <div className="space-y-6 animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                  <div className="h-8 bg-slate-800 rounded w-3/4"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-800 rounded"></div>
                  <div className="h-4 bg-slate-800 rounded"></div>
                  <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                </div>
                <div className="border-t border-slate-800 pt-6 space-y-3">
                  <div className="h-4 bg-slate-800 rounded w-1/6"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="h-16 bg-slate-800 rounded-xl"></div>
                    <div className="h-16 bg-slate-800 rounded-xl"></div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 bg-red-950/30 border border-red-900/50 rounded-xl p-5 text-red-300">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <div className="space-y-1">
                  <h4 className="font-semibold text-red-200">Ops, ocorreu um erro</h4>
                  <p className="text-sm text-red-400/90">{error}</p>
                </div>
              </div>
            )}

            {!isLoading && results && (
              <div className="space-y-8 animate-fadeIn">
                {/* Resposta Principal */}
                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-slate-400 uppercase tracking-wide">
                    Resposta Gerada
                  </h2>
                  <p className="text-slate-200 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                    {results.text}
                  </p>
                </div>

                {/* Fontes de Origem */}
                <div className="border-t border-slate-900 pt-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">
                    Fontes de Informação
                  </h3>
                  {results.sources && results.sources.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.sources.map((src, index) => (
                        <a
                          key={index}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group border border-slate-900 hover:border-slate-800 bg-slate-950 hover:bg-slate-900/50 rounded-xl p-4 transition-all flex flex-col justify-between gap-2 overflow-hidden"
                        >
                          <span className="font-medium text-slate-200 group-hover:text-indigo-400 transition-colors text-sm line-clamp-1">
                            {src.title}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                            <span className="px-1.5 py-0.5 bg-slate-900 rounded font-semibold text-[10px] text-slate-400 group-hover:bg-slate-800 group-hover:text-indigo-300 uppercase tracking-wider">
                              {getDomain(src.uri)}
                            </span>
                          </span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Nenhuma fonte específica encontrada.</p>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Seção de Comentários e Feedback */}
        <section id="feedback" className="border-t border-slate-900 pt-16 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Deixe seu comentário</h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              Sua opinião nos ajuda a melhorar nossa inteligência artificial. Deixe feedbacks ou sugestões de novos recursos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Formulário de Envio */}
            <div className="md:col-span-5 bg-slate-900/30 border border-slate-900 rounded-2xl p-6">
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="author_name" className="block text-xs font-semibold text-slate-400 uppercase">
                    Seu Nome
                  </label>
                  <input
                    id="author_name"
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Digite seu nome"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="content" className="block text-xs font-semibold text-slate-400 uppercase">
                    Comentário
                  </label>
                  <textarea
                    id="content"
                    rows="4"
                    required
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Deixe seu comentário..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white resize-none"
                  ></textarea>
                </div>

                {commentError && <p className="text-xs text-red-400">{commentError}</p>}
                {commentSuccess && <p className="text-xs text-green-400">{commentSuccess}</p>}

                <button
                  type="submit"
                  disabled={submittingComment || !authorName.trim() || !commentContent.trim()}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/40 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {submittingComment ? 'Enviando...' : 'Enviar Comentário'}
                </button>
              </form>
            </div>

            {/* Listagem de Comentários */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">
                Feedbacks Recebidos ({comments.length})
              </h3>
              <div className="max-h-[350px] overflow-y-auto pr-2 space-y-3">
                {comments.length > 0 ? (
                  comments.map((c) => (
                    <div key={c.id} className="bg-slate-900/20 border border-slate-900/60 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-indigo-400">{c.author_name}</span>
                        <span className="text-slate-500">{formatDate(c.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed break-words">{c.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 border border-dashed border-slate-900 rounded-xl">
                    <p className="text-slate-500 text-sm">Nenhum comentário recebido ainda.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-16 text-center text-xs text-slate-500">
        <p>
          &copy; <strong>2026</strong> Busca Inteligente IA. Todos os direitos reservados.
        </p>
        <p className="mt-1 text-slate-600">
          Desenvolvido com carinho por <em>DSheb's & Antigravity</em>
        </p>
      </footer>
    </div>
  );
}

export default App;
