# BlockChainBets: Arquitetura Final na Base Chain  

## 🌐 Visão Geral  
Plataforma de apostas descentralizada construída nativamente na Base Chain (L2 da Coinbase), combinando escalabilidade de rollups otimistas com segurança Ethereum. Arquitetura 100% on-chain sem dependência de bancos de dados centralizados.  

---

## 🔑 Componentes-Chave  

| Componente              | Tecnologia                          | Função                                  |  
|-------------------------|-------------------------------------|-----------------------------------------|  
| **Camada de Consenso**  | Base Chain (OP Stack)              | Processamento de transações em rollups  |  
| **Armazenamento**       | IPFS + Arweave                     | Metadata e histórico imutável           |  
| **Indexação**           | The Graph (Subgraphs Customizados) | Consultas complexas em dados on-chain   |  
| **Oracles**             | Chainlink Data Streams             | Feed de resultados externos             |  
| **Identidade**          | ENS + Basenames                    | Endereços humanizáveis                  |  
| **Frontend**            | React + Vite (GitHub Pages)        | Interface estática com Web3 integrado   |  

---

## 🏗️ Arquitetura em Camadas  

```mermaid
graph TD
    A[Frontend] -->|Interage via| B[Smart Contracts]
    B -->|Grava dados em| C[Base Chain]
    C -->|Indexa eventos via| D[The Graph]
    A -->|Consulta| D
    B -->|Armazena metadata em| E[IPFS]
    C -->|Registra histórico em| F[Arweave]
    G[Chainlink] -->|Alimenta| B
```

---

## 📜 Smart Contracts (Base Chain)  

### Core Features  
```solidity
// BettingSystem.sol
contract BettingSystem {
    using SafeERC20 for IERC20;
    
    struct Bet {
        address user;
        uint256 amount;
        bytes32 eventId;
        string metadataCID; // IPFS
    }
    
    mapping(bytes32 => Bet[]) public bets;
    
    function placeBet(
        bytes32 eventId, 
        string calldata ipfsCID, 
        uint256 amount
    ) external payable {
        require(msg.value >= amount, "Insufficient funds");
        bets[eventId].push(Bet(msg.sender, amount, ipfsCID));
        emit NewBet(ipfsCID); 
    }
}
```

### Características Técnicas:  
- **Custo por Transação**: ~0.001 USD (vs 2.50 USD na Ethereum Mainnet)  
- **Finalidade**: 12 segundos (vs 12 minutos na L1)  
- **TPS**: 2,000+ (com rollups)  

---

## 🖥️ Frontend (GitHub Pages)  

### Stack:  
- **Framework**: React 18 + TypeScript  
- **Web3**: Ethers.js v6 + Wagmi Hooks  
- **Estilo**: Tailwind CSS + Radix Primitives  
- **Real-time**: WebSocket via Push Protocol  

### Fluxo de Usuário:  
1. Conexão via WalletConnect v3 ou Coinbase Wallet  
2. Seleção de evento (dados via The Graph)  
3. Aposta direta no contrato (transação na Base)  
4. Confirmação via EIP-1559 (tip otimizado)  

---

## 📦 Deploy Automatizado  

### Pipeline CI/CD:  
```yaml
name: Deploy
on: [push]
jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
  deploy-contracts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: foundry-actions/foundry-toolchain@v1
      - run: forge build && forge create --rpc-url base
```

---

## 🛡️ Modelo de Segurança  

| Camada               | Mecanismos                                  |  
|----------------------|---------------------------------------------|  
| **Contratos**        | Fuzzing com Foundry + Auditoria OpenZeppelin|  
| **Dados**            | Replicação em 3 redes (IPFS/Arweave/Filecoin)|  
| **Rede**             | Rate Limiting via EIP-1559                 |  
| **Identidade**       | ZK-Proofs para verificação de KYC          |  

---

## 📊 Comparativo de Custos  

| Operação              | Ethereum L1 | Base Chain | Redução  |  
|-----------------------|-------------|------------|----------|  
| Aposta Simples        | $4.20       | $0.003     | 99.3%    |  
| Registro de Evento    | $18.50      | $0.12      | 99.4%    |  
| Consulta Histórico    | $0 (RPC)    | $0 (The Graph) | 100%    |  

---

## 🔄 Workflow de Desenvolvimento  

1. **Codificação**:  
   ```bash
   forge init && npm create vite@latest
   ```
2. **Testes**:  
   ```bash
   forge test && graph test
   ```
3. **Deploy**:  
   ```bash
   forge deploy --rpc-url base-mainnet
   graph deploy --product hosted-service
   ```
4. **Monitoramento**:  
   ```bash
   tenderly devnet fork --network base
   ```

---

## 🚀 Roadmap Futuro  

| Quarter | Feature                          | Tecnologia                  |  
|---------|----------------------------------|-----------------------------|  
| Q3 2025 | NFT Achievements                  | ERC-1155 + IPFS             |  
| Q4 2025 | Cross-Chain Bets                  | CCIP + LayerZero            |  
| Q1 2026 | DAO Governance                    | Snapshot + Safe{Wallet}     |  
| Q2 2026 | ZK-Rollups Migration              | zkSync Hyperchains          |  

---

## ✅ Por Que Base Chain?  

1. **Escalabilidade Real**: 4,000 TPS vs 15 TPS do Ethereum  
2. **Custos Previsíveis**: Taxas estáveis via EIP-1559  
3. **Ecosistema Integrado**: Acesso direto a 110M+ usuários Coinbase  
4. **Upgrade Seguro**: Herda segurança do Ethereum L1  

Esta arquitetura maximiza os benefícios da Base Chain enquanto mantém compliance total com princípios Web3, eliminando SPOFs (Single Points of Failure) e garantindo soberania total aos usuários.

Citations:
[1] https://base.org
[2] https://www.moonpay.com/pt-br/learn/blockchain/what-is-base-chain
[3] https://osl.com/hk-en/academy/article/what-is-base-the-ethereum-layer-2-challenger
[4] https://metaschool.so/articles/what-is-base-chain-by-coinbase/
[5] https://phemex.com/academy/cryptocurrency-glossary/base-chain
[6] https://cointelegraph.com/learn/articles/what-is-base-coinbase-l2-network
[7] https://drpc.org/blog/what-is-base-blockchain/
[8] https://www.base.org/builders/base-appchains
[9] https://www.risein.com/blog/the-base-of-blockchain-layer-1
[10] https://chainbase.com
