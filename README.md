# 🛡️ Hybrid Zero-Knowledge Proof Verification Framework
*zk-SNARK, zk-STARK, zk-Rollup (2025)*

[![Live Demo](https://img.shields.io/badge/Vercel-Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://zkp-dashboard-c5xe.vercel.app/)
[![Python](https://img.shields.io/badge/Python-Analytics-3776ab?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Technologies](https://img.shields.io/badge/Tech-Cryptography_%7C_Blockchain_%7C_zk--Rollups-8A2BE2?style=for-the-badge&logo=ethereum)](https://ethereum.org/)
[![Next.js 15](https://img.shields.io/badge/Next.js_15-Dashboard-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)

A cutting-edge, hybrid ZKP verification pipeline that enables **secure, scalable, and low-cost batch verification** for decentralized systems. This dashboard visualizes the integration and orchestration of various zero-knowledge proof technologies into a unified, high-performance execution layer.

---

## 📜 Academic Publication
> **Conference:** ICNTCS-26 (Virtual)  
> **Paper ID:** SFE 23567  
> *Extended journal version currently in preparation.*

---

## 🚀 [Live Production Dashboard](https://zkp-dashboard-c5xe.vercel.app/)
*Interact with the hybrid framework in real-time. No setup required.*

---

## 💎 Core Value Proposition

| Protocol Module | Purpose & Characteristics | Focus Area |
| :--- | :--- | :--- |
| **zk-SNARKs** | Individual privacy generation. Fast verification with succinct proof sizes. | **Privacy** |
| **zk-STARKs** | Post-quantum secure proof generation without a trusted setup. | **Transparency** |
| **zk-Rollups** | Batches multiple transactions into a single Merkle root to reduce gas costs. | **Scalability** |
| **Hybrid Framework** | Orchestrates SNARKs for privacy, Rollups for batching, and STARKs for auditing. | **Efficiency** |

---

## 🏗️ System Architecture

Our Hybrid ZKP Flow sequentially integrates privacy, batching, and auditing:

```mermaid
graph TD
    subgraph "1. Privacy Layer (zk-SNARKs)"
        U1[User 1: SNARK Proof]
        U2[User 2: SNARK Proof]
        U3[User N: SNARK Proof]
    end

    subgraph "2. Scalability Layer (zk-Rollups)"
        BATCH[Batch Verification & Merkle Root Generation]
    end

    subgraph "3. Transparency Layer (zk-STARKs)"
        AUDIT[STARK Audit Proof]
    end

    subgraph "Layer 1 / Verification"
        BLOCKCHAIN[Blockchain Network]
    end

    U1 --> BATCH
    U2 --> BATCH
    U3 --> BATCH
    BATCH --> AUDIT
    AUDIT --> BLOCKCHAIN
```

---

## 🛠️ Technology Stack

*   **Core Systems:** Python, Cryptography, Blockchain, zk-Rollups
*   **Web Dashboard:** Next.js 15 (App Router), React 19, Tailwind CSS
*   **ZKP Engine:** `snarkjs` & `circom` (Circuit compilation & proof generation)
*   **Backend Support:** Node.js, Express, TypeScript
*   **Database Integration:** MongoDB (Mongoose)

---

## ⚙️ Usage & Simulation

To experience the Hybrid Flow locally or through the live demo:

1. Navigate to the **Demo** page from the dashboard home.
2. Switch to the **Hybrid** tab within the application.
3. Select your preferred execution mode (Single, Multi, or Auto Batch).
4. Click **Start Hybrid Flow** to witness the seamless pipeline of SNARKs, Rollups, and STARKs.

---

## 📦 Local Development Setup

### 1. Synchronize the Repository
```bash
git clone https://github.com/Varshiniamara/zkp-dashboard.git
cd zkp-dashboard
```

### 2. Install Dependencies
*(Note: `--legacy-peer-deps` is required for React 19 UI component bounds)*
```bash
npm install --legacy-peer-deps
```

### 3. Environment Configuration
Create a backend environment file from the provided example template:
```bash
cp backend/example.env backend/.env
```

### 4. Launch the Hybrid Environment
Start both the Frontend UI and Backend ZKP API simultaneously:
```bash
npm run dev:full
```
*   **Dashboard**: `http://localhost:3000`
*   **ZKP Backend**: `http://localhost:5001`

---

> Built for the advancement of decentralized cryptography protocols.
