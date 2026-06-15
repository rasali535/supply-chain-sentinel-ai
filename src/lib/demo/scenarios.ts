export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  signal: string;
  region: string;
  expectedDisruption: any;
  expectedAlternatives: any;
  expectedTrust: any;
  expectedStrategy: any;
  reasoning: string[];
  metrics: {
    agents: number;
    time: string;
    suppliers: number;
    risks: number;
  };
  executiveSummary: {
    recommendation: string;
    action: string;
    outcome: string;
    impact: string;
  };
}

export const demoScenarios: DemoScenario[] = [
  {
    id: "cement-botswana",
    title: "Cement Supply Shortage in Botswana",
    description: "A major cement supplier experiences production issues causing shortages across Botswana.",
    signal: "Critical cement shortage reported by regional distributors.",
    region: "Botswana",
    expectedDisruption: { disruption: "Supply Chain Halt", impact_level: "high", affected_sector: "Construction", severity_score: 9 },
    expectedAlternatives: { alternatives: [{ name: "PPC Cement", location: "South Africa" }, { name: "AfriSam", location: "South Africa" }], best_match: "PPC Cement" },
    expectedTrust: { "PPC Cement": { trust_score: 92, risk_level: "low" } },
    expectedStrategy: { strategy: "Cross-border procurement via SA.", recommendation: "Secure contract with PPC Cement immediately.", expected_impact: "Resolves shortage within 5 days.", confidence_score: 95 },
    reasoning: [
      "Detected 90% drop in local cement availability via signal processing.",
      "Identified regional construction halt risk (Severity: 9/10).",
      "Queried global DB: Found PPC Cement and AfriSam in neighboring South Africa.",
      "Evaluated PPC Cement: Trust Score 92 (High compliance, low geopolitical risk).",
      "Selected PPC Cement over AfriSam due to faster cross-border transit times (3 days vs 5 days)."
    ],
    metrics: { agents: 5, time: "28.4s", suppliers: 12, risks: 3 },
    executiveSummary: {
      recommendation: "Switch procurement to PPC Cement to reduce disruption impact.",
      action: "Approve cross-border procurement contract.",
      outcome: "Resolves shortage within 5 days.",
      impact: "Maintains 95% of active construction timelines."
    }
  },
  {
    id: "fuel-disruption",
    title: "Fuel Distribution Disruption",
    description: "A regional transport bottleneck delays fuel deliveries.",
    signal: "Diesel refinery output drops by 40% due to infrastructure failure.",
    region: "South Africa",
    expectedDisruption: { disruption: "Fuel Rationing", impact_level: "high", affected_sector: "Logistics", severity_score: 10 },
    expectedAlternatives: { alternatives: [{ name: "Engen Petroleum", location: "Namibia" }], best_match: "Engen Petroleum" },
    expectedTrust: { "Engen Petroleum": { trust_score: 88, risk_level: "low" } },
    expectedStrategy: { strategy: "Reroute fleet fueling through Namibia.", recommendation: "Establish emergency fuel line with Engen.", expected_impact: "Maintains 85% of fleet uptime.", confidence_score: 91 },
    reasoning: [
      "Monitored refinery output drop crossing critical threshold (-40%).",
      "Calculated immediate impact on logistics fleet (Severity: 10/10).",
      "Scanned adjacent energy markets: Namibia offers stable reserves.",
      "Vetted Engen Petroleum: Risk level low, strong historical fulfillment.",
      "Drafted reroute strategy bypassing affected SA infrastructure."
    ],
    metrics: { agents: 5, time: "26.1s", suppliers: 8, risks: 2 },
    executiveSummary: {
      recommendation: "Reroute fleet fueling operations to Namibian reserves.",
      action: "Establish emergency fuel line with Engen Petroleum.",
      outcome: "Secures fuel for next 30 days.",
      impact: "Maintains 85% of fleet uptime."
    }
  },
  {
    id: "agri-shortage",
    title: "Agricultural Input Shortage",
    description: "Demand for fertilizer exceeds available supply due to port delays.",
    signal: "Port congestion delays fertilizer shipments by 3 weeks.",
    region: "Kenya",
    expectedDisruption: { disruption: "Planting Delay", impact_level: "medium", affected_sector: "Agriculture", severity_score: 7 },
    expectedAlternatives: { alternatives: [{ name: "Minjingu Mines", location: "Tanzania" }], best_match: "Minjingu Mines" },
    expectedTrust: { "Minjingu Mines": { trust_score: 75, risk_level: "medium" } },
    expectedStrategy: { strategy: "Source alternative regional phosphate.", recommendation: "Procure organic alternatives from Minjingu Mines.", expected_impact: "Prevents crop cycle failure.", confidence_score: 82 },
    reasoning: [
      "Port tracking flagged anomalous 3-week delay for incoming vessels.",
      "Correlated delay with critical planting season (Severity: 7/10).",
      "Searched land-based regional alternatives.",
      "Identified Minjingu Mines in Tanzania as viable organic substitute.",
      "Risk assessed: Medium trust (75), acceptable for emergency bridging."
    ],
    metrics: { agents: 5, time: "24.8s", suppliers: 15, risks: 4 },
    executiveSummary: {
      recommendation: "Procure alternative regional phosphate to bridge supply gap.",
      action: "Execute emergency PO with Minjingu Mines.",
      outcome: "Secures necessary inputs before planting window closes.",
      impact: "Prevents complete crop cycle failure."
    }
  },
  {
    id: "cross-border-delay",
    title: "Cross-Border Logistics Delay",
    description: "Border processing delays impact incoming shipments.",
    signal: "Beitbridge border customs strike causing 5-day truck queues.",
    region: "Zimbabwe/SA Border",
    expectedDisruption: { disruption: "Transit Halt", impact_level: "high", affected_sector: "Cross-border Trade", severity_score: 8 },
    expectedAlternatives: { alternatives: [{ name: "Plumtree Border Route", location: "Botswana Route" }], best_match: "Plumtree Border Route" },
    expectedTrust: { "Plumtree Border Route": { trust_score: 85, risk_level: "low" } },
    expectedStrategy: { strategy: "Reroute critical shipments.", recommendation: "Reroute via Plumtree/Botswana corridor.", expected_impact: "Reduces delay from 5 days to 2 days.", confidence_score: 88 },
    reasoning: [
      "Ingested social and news signals indicating Beitbridge strike.",
      "Modeled supply chain halt across 5-day queue (Severity: 8/10).",
      "Evaluated alternative geographical corridors.",
      "Identified Plumtree route via Botswana as optimal bypass.",
      "Verified route safety and compliance: Trust Score 85."
    ],
    metrics: { agents: 5, time: "29.5s", suppliers: 3, risks: 5 },
    executiveSummary: {
      recommendation: "Reroute critical shipments via alternative corridor.",
      action: "Redirect fleet through Plumtree/Botswana border.",
      outcome: "Bypasses strike zone entirely.",
      impact: "Reduces expected delay from 5 days to 2 days."
    }
  }
];
