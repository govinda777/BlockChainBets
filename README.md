# BlockChainBets

BlockChainBets é uma aplicação descentralizada (dApp) de apostas agnóstica em relação a blockchains, permitindo que usuários façam apostas em eventos diversos através de múltiplas carteiras digitais. O projeto serve como uma prova de conceito para estudos em blockchain, oferecendo uma plataforma completa para apostas descentralizadas com funcionalidades avançadas de gerenciamento de eventos, especialistas e leaderboards.

## Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript para interface do usuário
- **Vite** como bundler e servidor de desenvolvimento
- **Tailwind CSS** para estilização responsiva
- **Radix UI** para componentes de interface acessíveis
- **Wouter** para roteamento
- **TanStack Query** para gerenciamento de estado servidor
- **Ethers.js** para integração com blockchain
- **Framer Motion** para animações
- **Recharts** para visualização de dados

### Backend
- **Express.js** com TypeScript para API REST
- **Drizzle ORM** para manipulação de banco de dados
- **PostgreSQL** como banco de dados principal
- **Zod** para validação de esquemas
- **WebSockets** para comunicação em tempo real
- **Passport.js** para autenticação

### Blockchain
- **Ethers.js** para integração com múltiplas carteiras
- Suporte agnóstico a diferentes blockchains
- Integração com carteiras populares (MetaMask, WalletConnect, etc.)

## Estrutura do Projeto

```
BlockChainBets/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   │   ├── dashboard/  # Componentes do dashboard
│   │   │   ├── events/     # Componentes de eventos
│   │   │   ├── layout/     # Layout da aplicação
│   │   │   └── ui/         # Componentes base da UI
│   │   ├── contexts/       # Contextos React (Wallet, Bets, Events)
│   │   ├── pages/          # Páginas da aplicação
│   │   └── main.tsx        # Ponto de entrada
│   └── index.html
├── server/                 # Backend Express
│   ├── index.ts           # Servidor principal
│   ├── routes.ts          # Definição das rotas da API
│   ├── storage.ts         # Camada de persistência
│   └── vite.ts            # Configuração do Vite
├── shared/                # Código compartilhado
│   └── schema.ts          # Esquemas do banco de dados
├── drizzle.config.ts      # Configuração do Drizzle ORM
├── package.json           # Dependências e scripts
└── vite.config.ts         # Configuração do Vite
```

## Funcionalidades Principais

### Dashboard
- **Cartão de Saldo**: Visualização do saldo atual e histórico
- **Apostas Ativas**: Monitoramento de apostas em andamento
- **Atividade Recente**: Histórico de transações e atividades
- **Estatísticas**: Métricas de desempenho e análises
- **Picks de Especialistas**: Recomendações de apostas

### Gerenciamento de Eventos
- Criação de novos eventos de apostas
- Visualização de eventos disponíveis
- Sistema de categorização
- Definição de outcomes (resultados) possíveis
- Eventos em destaque

### Sistema de Apostas
- Interface intuitiva para realizar apostas
- Histórico completo de apostas do usuário
- Cálculo automático de odds e potencial de ganho
- Integração com carteiras blockchain

### Sistema de Especialistas
- Cadastro e seguimento de especialistas
- Visualização de histórico de performance
- Sistema de recomendações
- Rankings baseados em resultados

### Leaderboard
- Rankings de usuários por performance
- Estatísticas detalhadas de apostadores
- Sistema de pontuação baseado em sucessos

## Configuração e Instalação

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL
- Carteira digital compatível (MetaMask, etc.)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/govinda777/BlockChainBets.git
cd BlockChainBets
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
```bash
# Configure a variável de ambiente DATABASE_URL
export DATABASE_URL="postgresql://user:password@localhost:5432/blockchainbets"

# Execute as migrações
npm run db:push
```

4. **Execute em modo desenvolvimento**
```bash
npm run dev
```

5. **Para produção**
```bash
npm run build
npm start
```

## API Endpoints

### Usuários
- `POST /api/users` - Criar usuário
- `GET /api/users/:id` - Buscar usuário por ID  
- `GET /api/users/wallet/:address` - Buscar usuário por carteira

### Eventos
- `POST /api/events` - Criar evento
- `GET /api/events` - Listar eventos
- `GET /api/events/featured` - Eventos em destaque
- `GET /api/events/:id` - Buscar evento específico

### Apostas
- `POST /api/bets` - Realizar aposta
- `GET /api/bets/user/:userId` - Apostas do usuário

### Especialistas e Social
- `GET /api/experts` - Listar especialistas
- `POST /api/experts/:expertId/follow` - Seguir especialista
- `GET /api/leaderboard` - Ranking de usuários
- `GET /api/stats` - Estatísticas gerais

## Esquema do Banco de Dados

O projeto utiliza as seguintes tabelas principais:

- **users**: Informações dos usuários, carteiras e roles
- **events**: Eventos disponíveis para apostas
- **outcomes**: Resultados possíveis para cada evento
- **bets**: Registro de todas as apostas realizadas
- **experts**: Informações de especialistas
- **follows**: Relacionamento usuário-especialista

## Contextos React

A aplicação utiliza três contextos principais:

- **WalletContext**: Gerenciamento de conexão com carteiras
- **BetsContext**: Estado global das apostas
- **EventsContext**: Gerenciamento de eventos

## Desenvolvimento

### Scripts Disponíveis
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Servidor de produção
- `npm run check` - Verificação de tipos TypeScript
- `npm run db:push` - Atualizar esquema do banco

### Estrutura de Desenvolvimento
O projeto está configurado para desenvolvimento com Vite e inclui hot-reload tanto para frontend quanto backend. A aplicação roda por padrão na porta 5000, servindo tanto a API quanto o cliente.

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a MIT License.

## Sobre o Projeto

BlockChainBets foi desenvolvido como uma prova de conceito para estudos em blockchain, demonstrando como criar uma aplicação agnóstica que funciona com múltiplas carteiras e blockchains. O projeto explora conceitos avançados de desenvolvimento descentralizado, integração com carteiras digitais e gerenciamento de estado em aplicações Web3.

---

**Nota**: Este é um projeto experimental para fins educacionais. Use com responsabilidade e esteja ciente dos riscos envolvidos em apostas e transações blockchain.

Citations:
[1] https://github.com/govinda777/BlockChainBets
