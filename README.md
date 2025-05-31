# BlockChainBets Platform

BlockChainBets é uma plataforma descentralizada (dApp) para apostas em diversos eventos, construída primariamente sobre a **Base Chain (L2 da Coinbase)**. O projeto visa explorar e demonstrar as capacidades de aplicações Web3 modernas, combinando lógica on-chain com serviços descentralizados e uma interface de usuário reativa.

## Visão Geral

A plataforma permite que usuários conectem suas carteiras digitais, visualizem eventos de apostas, coloquem apostas diretamente no smart contract na Base Chain, e (futuramente) recebam pagamentos. A arquitetura é projetada para ser transparente, segura e eficiente, aproveitando a escalabilidade da Base Chain.

## Tecnologias Principais

### Frontend
- **React 18** com TypeScript
- **Vite**: Build tool e servidor de desenvolvimento
- **Tailwind CSS** & **Radix UI**: Estilização e componentes UI
- **Wouter**: Roteamento
- **TanStack Query**: Gerenciamento de estado do servidor
- **Ethers.js**: Interação com a Base Chain e carteiras (MetaMask, Coinbase Wallet, etc.)
- **Framer Motion**: Animações
- **Recharts**: Visualização de dados

### Smart Contracts (On-Chain Logic on Base Chain)
- **Solidity**: Linguagem de programação para smart contracts
- **Foundry**: Toolkit para desenvolvimento, teste e deploy de smart contracts
- **BettingSystem.sol**: Contrato principal para lógica de apostas (detalhes em `contracts/README.md`)
- **OpenZeppelin Contracts**: Utilizados para padrões de segurança e interfaces (vendored manualmente)

### Backend (Servidor de Apoio e APIs)
- **Express.js** com TypeScript: Para funcionalidades que não são puramente on-chain (ex: gerenciamento de conteúdo, dados de usuário não sensíveis).
- **Drizzle ORM**: Para interação com banco de dados PostgreSQL.
- **PostgreSQL**: Banco de dados para dados de aplicação gerenciados pelo servidor.
- **Zod**: Validação de esquemas.
- **WebSockets**: Para comunicação em tempo real (se aplicável).
- **Passport.js**: Para autenticação (se aplicável a serviços centralizados).

### Serviços Descentralizados e Off-Chain
- **IPFS**: Armazenamento de metadados de apostas (JSON objects linkados por CID no smart contract).
- **The Graph**: Indexação de eventos do smart contract (`NewBet`) para consultas eficientes pelo frontend.
- **Chainlink Data Streams (Planejado)**: Oráculos para fornecer resultados de eventos externos de forma confiável.
- **Arweave (Planejado)**: Armazenamento imutável de dados históricos de apostas a longo prazo.

## Estrutura do Projeto

```
BlockChainBets/
├── client/                 # Frontend React (Vite, TypeScript)
│   ├── src/
│   └── index.html
├── contracts/              # Smart Contracts (Foundry, Solidity)
│   ├── src/                # Código fonte dos contratos (ex: BettingSystem.sol)
│   ├── test/               # Testes dos contratos
│   ├── script/             # Scripts de deploy e interação
│   ├── lib/                # Dependências (ex: forge-std, openzeppelin)
│   └── foundry.toml        # Configuração do Foundry
├── server/                 # Backend Express (TypeScript)
│   ├── index.ts
│   └── ...
├── shared/                 # Código compartilhado (ex: esquemas Zod)
│   └── schema.ts
├── ARQ.md                  # Documento de arquitetura detalhado
├── drizzle.config.ts       # Configuração do Drizzle ORM
├── package.json            # Dependências e scripts do projeto (Node.js)
└── vite.config.ts          # Configuração do Vite
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
- Interface intuitiva para realizar apostas.
- Histórico completo de apostas do usuário (parcialmente on-chain, enriquecido por dados indexados).
- Cálculo automático de odds e potencial de ganho (gerenciado off-chain ou via metadados).
- **Lógica de apostas principal e registro de apostas no smart contract `BettingSystem.sol` na Base Chain.**
- Integração com carteiras blockchain para interagir com a Base Chain.

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
- Yarn (ou npm, ajustar comandos conforme necessário)
- Carteira digital configurada para Base Chain (e.g., MetaMask com rede Base Sepolia Testnet ou Mainnet)
- Foundry (para desenvolvimento de smart contracts): [Instruções de Instalação do Foundry](https://book.getfoundry.sh/getting-started/installation)

### 1. Instalação Geral (Frontend & Backend Server)

1. **Clone o repositório**

   ```bash
   git clone https://github.com/govinda777/BlockChainBets.git # (Substituir pela URL correta do repo, se diferente)
   cd BlockChainBets
   ```
2. **Instale as dependências Node.js**
   ```bash
   npm install
   # ou yarn install
   ```
3. **Configure o banco de dados (para funcionalidades do servidor de apoio)**
   ```bash
   # Configure a variável de ambiente DATABASE_URL (ex: para PostgreSQL)
   export DATABASE_URL="postgresql://user:password@localhost:5432/blockchainbets"
   # Execute as migrações do Drizzle ORM
   npm run db:push
   # ou yarn db:push
   ```

### 2. Desenvolvimento de Smart Contracts (na Base Chain)

1. **Navegue até o diretório dos contratos**
   ```bash
   cd contracts
   ```
2. **Construa os contratos**
   ```bash
   forge build
   ```
3. **Execute os testes dos contratos**
   ```bash
   forge test
   ```
4. Para mais detalhes sobre desenvolvimento, teste e deploy de contratos, consulte o `contracts/README.md`.

### 3. Executando a Aplicação

1. **Execute o servidor de desenvolvimento (Frontend & Backend Server)**:
   No diretório raiz do projeto:
   ```bash
   npm run dev
   # ou yarn dev
   ```
   Isto geralmente inicia o frontend Vite e o servidor Express (se configurado no `dev` script).
2. **Para interagir com os smart contracts na Base Chain:**
   *   Deploy os contratos para uma rede de teste Base (ex: Base Sepolia) ou uma instância local do Anvil.
   *   Configure o frontend para interagir com o endereço do contrato deployado na rede correta.

### 4. Build para Produção

1. **Frontend & Backend Server:**
   ```bash
   npm run build
   npm start
   # ou yarn build; yarn start
   ```
2. **Smart Contracts:**
   O deploy de smart contracts para produção é um processo separado, geralmente usando `forge script` ou `forge create` e gerenciando chaves privadas de forma segura.

## API Endpoints (Servidor de Apoio)

```bash
git clone https://github.com/govinda777/BlockChainBets.git
cd BlockChainBets
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute em modo desenvolvimento**
```bash
npm run dev
```

4. **Para produção**
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

## Esquema do Banco de Dados (Servidor de Apoio)

O projeto utiliza as seguintes tabelas principais para suas funcionalidades de servidor/backend de apoio:

- **users**: Informações dos usuários, carteiras e roles
- **events**: Eventos disponíveis para apostas (gerenciados pelo backend)
- **outcomes**: Resultados possíveis para cada evento (gerenciados pelo backend)
- **bets**: Registro de todas as apostas realizadas (potencialmente espelhando ou complementando dados on-chain, gerenciado pelo backend)
- **experts**: Informações de especialistas
- **follows**: Relacionamento usuário-especialista

## Contextos React

A aplicação utiliza três contextos principais:

- **WalletContext**: Gerenciamento de conexão com carteiras
- **BetsContext**: Estado global das apostas
- **EventsContext**: Gerenciamento de eventos

## Desenvolvimento (Scripts Node.js)

### Scripts Disponíveis
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Servidor de produção
- `npm run check` - Verificação de tipos TypeScript
- `npm run db:push` - Atualizar esquema do banco

### Estrutura de Desenvolvimento
O projeto está configurado para desenvolvimento com Vite e inclui hot-reload tanto para frontend quanto backend. A aplicação roda por padrão na porta 5000, servindo tanto a API quanto o cliente.

## Smart Contracts Detalhados

Para uma documentação detalhada sobre o smart contract `BettingSystem.sol`, sua arquitetura, funções e como interagir com ele usando Foundry, consulte o [README dentro do diretório `contracts`](./contracts/README.md).

## Arquitetura do Projeto

Para uma visão aprofundada da arquitetura geral do sistema, incluindo a interação entre componentes on-chain e off-chain, consulte o documento [ARQ.md](./ARQ.md).

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a MIT License.

## Sobre o Projeto

BlockChainBets é uma plataforma de apostas descentralizada com foco na **Base Chain**, desenvolvida para explorar e demonstrar conceitos avançados de Web3. O projeto integra smart contracts, armazenamento descentralizado, indexação de dados on-chain e uma interface de usuário moderna para fornecer uma experiência de apostas transparente e engajadora.

---

**Nota**: Este é um projeto experimental para fins educacionais e de demonstração. Transações em blockchain são irreversíveis e apostas envolvem risco financeiro. Use com responsabilidade.
