const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const COMMENTS_FILE = path.join(__dirname, '../comments.json');

// Middleware de segurança
app.use(helmet());

// Configuração de CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];
app.use(cors({
  origin: (origin, callback) => {
    // Permitir requisições sem origem (como apps mobile ou curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(new Error('Acesso CORS bloqueado para esta origem.'), false);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Limite de requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  message: { error: 'Muitas requisições vindas deste IP. Tente novamente mais tarde.' }
});
app.use('/api/', limiter);

// Helper para ler comentários do arquivo JSON
const readComments = () => {
  try {
    if (!fs.existsSync(COMMENTS_FILE)) {
      // Retorna alguns comentários padrão iniciais se o arquivo não existir
      const defaultComments = [
        {
          id: '1',
          author_name: 'Ana Silva',
          content: 'Excelente ferramenta! As fontes ajudam muito a verificar as informações.',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString() // 2 horas atrás
        },
        {
          id: '2',
          author_name: 'Carlos Oliveira',
          content: 'As respostas da IA são bem objetivas. Economiza bastante tempo.',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString() // 1 dia atrás
        }
      ];
      fs.writeFileSync(COMMENTS_FILE, JSON.stringify(defaultComments, null, 2));
      return defaultComments;
    }
    const data = fs.readFileSync(COMMENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Erro ao ler arquivo de comentários:', err);
    return [];
  }
};

// Helper para escrever comentários
const writeComments = (comments) => {
  try {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
    return true;
  } catch (err) {
    console.error('Erro ao salvar comentários:', err);
    return false;
  }
};

// Rotas
app.get('/api/comments', (req, res) => {
  const comments = readComments();
  // Ordenar dos mais recentes para os mais antigos
  const sortedComments = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sortedComments);
});

app.post('/api/comments', (req, res) => {
  const { author_name, content } = req.body;

  if (!author_name || !author_name.trim()) {
    return res.status(400).json({ error: 'O nome do autor é obrigatório.' });
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'O conteúdo do comentário é obrigatório.' });
  }

  const comments = readComments();
  const newComment = {
    id: Date.now().toString(),
    author_name: author_name.trim(),
    content: content.trim(),
    createdAt: new Date().toISOString()
  };

  comments.push(newComment);
  
  if (writeComments(comments)) {
    res.status(201).json(newComment);
  } else {
    res.status(500).json({ error: 'Erro interno ao salvar o comentário.' });
  }
});

// Middleware de tratamento de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado no servidor!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} no modo ${process.env.NODE_ENV || 'production'}`);
});
