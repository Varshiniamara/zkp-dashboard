# ZKP Dashboard: Privacy-Preserving Logic & Proof Visualization

## 🌐 Live Demo
**[Launch Application](https://zkp-dashboard-c5xe.vercel.app/)**

This project demonstrates a comprehensive Zero-Knowledge Proof (ZKP) system, integrating **zk-SNARKs**, **zk-STARKs**, and **zk-Rollups** into a unified dashboard. It features a novel **Hybrid ZKP Framework** that orchestrates these technologies to achieve privacy, scalability, and transparency simultaneously.

## 🚀 Features

*   **zk-SNARK Demo (Privacy)**: Generate proofs for credit scores and financial eligibility without revealing raw user data. Implements deterministic logic to simulate passing and failing scenarios based on defined thresholds (e.g., Credit Score > 700).
*   **zk-STARK Demo (Transparency)**: Demonstrate post-quantum secure proofs for age and country verification with no trusted setup.
*   **zk-Rollup Demo (Scalability)**: Batch multiple transactions into a single Merkle root to showcase gas cost reduction and throughput scaling.
*   **Hybrid Flow Framework**: An advanced orchestrated flow that:
    1.  Generates individual SNARK proofs for user privacy.
    2.  Filters valid proofs and batches them using a Rollup mechanism.
    3.  Audits the entire batch using a STARK proof for transparency.
*   **Interactive UI**: A modern, responsive dashboard built with Next.js and Tailwind CSS, featuring real-time charts and blockchain activity logs.
*   **Deterministic Validation**: Backend services implementing real logic constraints to ensure consistent and reproducible demonstration results.

## 🛠️ Technology Stack

*   **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Recharts, Lucide Icons, Radix UI.
*   **Backend**: Node.js, Express, TypeScript.
*   **ZKP Libraries**:
    *   `snarkjs` & `circom`: For zk-SNARK circuit compilation and proof generation.
    *   Custom simulation services for STARK and Rollup logic demonstration.
*   **Database**: MongoDB (Mongoose) for storing proof history and user datasets (optional, runs in demo mode without DB).
*   **Styling**: Shadcn/UI components for a premium look and feel.

## 📦 Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Varshiniamara/zkp-dashboard.git
    cd zkp-dashboard
    ```

2.  **Install dependencies**:
    ```bash
    npm install --legacy-peer-deps
    ```
    *Note: The `--legacy-peer-deps` flag is required due to React 19 compatibility checks.*

3.  **Environment Setup**:
    The project comes with a backend configuration. Ensure `backend/.env` exists or create it from `backend/example.env`.
    ```bash
    cp backend/example.env backend/.env
    ```

## ▶️ Usage

### Running Locally (Recommended)
This command runs both the Next.js frontend and the Express backend concurrently.

```bash
npm run dev:full
```

*   **Frontend**: Open [http://localhost:3000](http://localhost:3000)
*   **Backend API**: Running on port `5001`

### Running Hybrid Flow Demo
1.  Navigate to the **Demo** page from the dashboard home.
2.  Switch to the **Hybrid** tab.
3.  Select a mode (Single, Multi, or Auto Batch).
4.  Click **Start Hybrid Flow** to witness the orchestration of SNARKs, Rollups, and STARKs in real-time.

## 📂 Project Structure

*   `app/`: Next.js frontend pages and layouts.
*   `backend/`: Express server, ZKP controllers, and services.
    *   `src/services/`: Core logic for `snarkService`, `starkService`, `rollupService`, and `hybridService`.
*   `circuits/`: Circom circuit definitions (e.g., `credit_score.circom`).
*   `components/`: Reusable React components and UI elements.
*   `public/`: Static assets.

## 🤝 Contribution

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available for educational and research purposes.
