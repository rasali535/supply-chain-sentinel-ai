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
}

export const demoScenarios: DemoScenario[] = [
  {
    id: "cement-botswana",
    title: "Cement Shortage",
    description: "Sudden regional deficit of construction materials.",
    signal: "Critical cement shortage reported by regional distributors.",
    region: "Botswana",
    expectedDisruption: { disruption: "Supply Chain Halt", impact_level: "high", affected_sector: "Construction", severity_score: 9 },
    expectedAlternatives: { alternatives: [{ name: "PPC Cement", location: "South Africa" }, { name: "AfriSam", location: "South Africa" }], best_match: "PPC Cement" },
    expectedTrust: { "PPC Cement": { trust_score: 92, risk_level: "low" } },
    expectedStrategy: { strategy: "Cross-border procurement via SA.", recommendation: "Secure contract with PPC Cement immediately.", expected_impact: "Resolves shortage within 5 days.", confidence_score: 95 }
  },
  {
    id: "fuel-disruption",
    title: "Fuel Supply Disruption",
    description: "Logistics fuel constraint impacting fleet operations.",
    signal: "Diesel refinery output drops by 40%.",
    region: "South Africa",
    expectedDisruption: { disruption: "Fuel Rationing", impact_level: "high", affected_sector: "Logistics", severity_score: 10 },
    expectedAlternatives: { alternatives: [{ name: "Engen Petroleum", location: "Namibia" }], best_match: "Engen Petroleum" },
    expectedTrust: { "Engen Petroleum": { trust_score: 88, risk_level: "low" } },
    expectedStrategy: { strategy: "Reroute fleet fueling through Namibia.", recommendation: "Establish emergency fuel line with Engen.", expected_impact: "Maintains 85% of fleet uptime.", confidence_score: 91 }
  },
  {
    id: "agri-shortage",
    title: "Agricultural Input Shortage",
    description: "Fertilizer delays affecting crop cycles.",
    signal: "Port congestion delays fertilizer shipments by 3 weeks.",
    region: "Kenya",
    expectedDisruption: { disruption: "Planting Delay", impact_level: "medium", affected_sector: "Agriculture", severity_score: 7 },
    expectedAlternatives: { alternatives: [{ name: "Minjingu Mines", location: "Tanzania" }], best_match: "Minjingu Mines" },
    expectedTrust: { "Minjingu Mines": { trust_score: 75, risk_level: "medium" } },
    expectedStrategy: { strategy: "Source alternative regional phosphate.", recommendation: "Procure organic alternatives from Minjingu Mines.", expected_impact: "Prevents crop cycle failure.", confidence_score: 82 }
  },
  {
    id: "cross-border-delay",
    title: "Cross-Border Delay",
    description: "Customs strike causing massive border queues.",
    signal: "Beitbridge border customs strike causing 5-day truck queues.",
    region: "Zimbabwe/SA Border",
    expectedDisruption: { disruption: "Transit Halt", impact_level: "high", affected_sector: "Cross-border Trade", severity_score: 8 },
    expectedAlternatives: { alternatives: [{ name: "Plumtree Border Route", location: "Botswana Route" }], best_match: "Plumtree Border Route" },
    expectedTrust: { "Plumtree Border Route": { trust_score: 85, risk_level: "low" } },
    expectedStrategy: { strategy: "Reroute critical shipments.", recommendation: "Reroute via Plumtree/Botswana corridor.", expected_impact: "Reduces delay from 5 days to 2 days.", confidence_score: 88 }
  }
];
