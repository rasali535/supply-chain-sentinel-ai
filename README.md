# SupplyChain Sentinel AI 🛡️

**Enterprise Procurement & High-Stakes Risk Compliance**

SupplyChain Sentinel AI is an autonomous multi-agent intelligence system designed for **Track 1 (Internal Enterprise Workflows)** and **Track 3 (Regulated & High-Stakes Workflows)**. It detects supply chain disruptions, coordinates automated procurement handoffs, and generates secure, auditable mitigation strategies in real-time.

---

## 🎯 Hackathon Track Alignment

### Track 1: Internal Enterprise Workflows (Procurement & Coordination)
We automate cross-departmental handoffs. When a supply chain signal triggers (e.g., a regional shortage), our multi-agent system automatically halts dependent supply lines, sources alternative vendors globally, and generates an actionable procurement strategy, dramatically reducing cross-team bottlenecks.

### Track 3: Regulated & High-Stakes Workflows (Compliance & Audit)
We built this system with **traceability and careful decision-making** as a core pillar. Every agent handoff, risk score evaluation, and strategy formulation is securely logged via our `HistoryService` and displayed in the **Secure Audit Trail**, ensuring full compliance and escalation visibility.

---

## 🚀 Live Demo Mode

The application features a dedicated **Live Demo Center** designed specifically for hackathon judging. It visually simulates our 5-agent orchestration pipeline across 4 high-stakes corporate scenarios:

1. **Cross-Department Procurement Escalation** (Cement Shortage)
2. **Operational Logistics Coordination** (Fuel Disruption)
3. **Vendor Escalation & Approval** (Agricultural Input Shortage)
4. **High-Stakes Compliance Investigation** (Cross-Border Delay)

### Agent Pipeline (Band SDK Collaboration)
Our multi-agent system runs natively on the Band platform, coordinating task handoffs and state through a Band room message cascade:
1. **Coordinator Agent**: Creates a dedicated Band chatroom, adds participants, and publishes the initial signal.
2. **Disruption Detection Agent**: Listens for signals, assesses severity impact, and posts disruption metrics back to the room.
3. **Alternative Supplier Agent**: Listens for disruptions, queries alternative suppliers, performs trust scoring/ranking, and posts findings.
4. **Strategy Agent**: Listens for alternative suppliers, reasons over context using Featherless AI, and publishes the final strategy.

---

## 💻 Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Framer Motion
- **Architecture**: In-Memory State Machine & Singleton History Services
- **AI Integration**:
  - `Featherless AI`: Strategic reasoning and natural language generation
  - `AI/ML API`: Risk evaluation and deterministic scoring

## ⚙️ Getting Started

### Prerequisites
- Node.js (v20+)
- Valid API keys for Featherless and AI/ML API.

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in a `.env` file:
```env
BAND_API_KEY=your_band_api_key
FEATHERLESS_API_KEY=your_featherless_api_key
AIML_API_KEY=your_aiml_api_key
```

3. Run the background Band agents runner:
```bash
npm run agents
```

4. Run the development server in a separate terminal:
```bash
npm run dev
```

The application will be available at `http://localhost:3006`. Navigate to `/dashboard/demo` to run the live hackathon pitch scenarios! If the background agents runner is active, the workflow will orchestrate live through Band chatrooms; otherwise, it will fall back to local simulation for reliability.
