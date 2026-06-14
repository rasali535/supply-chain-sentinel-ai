import { NextResponse } from "next/server";
import OpenAI from "openai";

const featherless = new OpenAI({
  baseURL: "https://api.featherless.ai/v1",
  apiKey: process.env.FEATHERLESS_API_KEY,
});

const aiml = new OpenAI({
  baseURL: "https://api.aimlapi.com/v1",
  apiKey: process.env.AIML_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Step 1: Signal Monitoring Agent
    const signal = {
      signal: "cement shortage",
      region: "Botswana",
      severity: "high"
    };

    // Step 2: Disruption Detection Agent
    const disruption = {
      disruption: "transport delay",
      impact_level: "high",
      affected_sector: "construction"
    };

    // Step 3: Alternative Supplier Agent
    const alternatives = {
      alternatives: ["PPC Cement", "AfriSam", "Dangote Cement SA"],
      best_match: "PPC Cement",
      location: "South Africa"
    };

    // Step 4: Risk Scoring Agent (AI/ML API)
    let risk_scoring = {
      supplier: alternatives.best_match,
      trust_score: 85.5,
      risk_level: "low"
    };

    try {
      const aimlCompletion = await aiml.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a Risk Scoring AI. Output JSON only with supplier, trust_score (0-100), and risk_level (low, medium, high)." },
          { role: "user", content: `Score the supplier ${alternatives.best_match} in ${alternatives.location} given a ${signal.signal} in ${signal.region}.` }
        ],
        response_format: { type: "json_object" }
      });
      const content = aimlCompletion.choices[0].message.content;
      if (content) {
        risk_scoring = JSON.parse(content);
      }
    } catch (err) {
      console.warn("AI/ML API call failed, using fallback risk scoring.", err);
    }

    // Step 5: Strategy Agent (Featherless AI)
    let strategy = {
      strategy: "Reroute supply from South Africa",
      recommendation: "Establish immediate contract with PPC Cement.",
      expected_impact: "Will mitigate shortage within 7 days."
    };

    try {
      const featherlessCompletion = await featherless.chat.completions.create({
        model: "meta-llama/Meta-Llama-3-8B-Instruct", // common featherless model
        messages: [
          { role: "system", content: "You are a strategic logistics AI. Output JSON only with keys: strategy, recommendation, expected_impact." },
          { role: "user", content: `Provide strategy for ${signal.signal} in ${signal.region}. Recommended supplier: ${alternatives.best_match}. Risk: ${risk_scoring.risk_level}.` }
        ],
        response_format: { type: "json_object" }
      });
      const content = featherlessCompletion.choices[0].message.content;
      if (content) {
        strategy = JSON.parse(content);
      }
    } catch (err) {
      console.warn("Featherless API call failed, using fallback strategy.", err);
    }

    return NextResponse.json({
      success: true,
      agents: {
        signalMonitoring: signal,
        disruptionDetection: disruption,
        alternativeSupplier: alternatives,
        riskScoring: risk_scoring,
        strategy: strategy
      }
    });

  } catch (error) {
    console.error("Agent pipeline error:", error);
    return NextResponse.json({ error: "Pipeline failed" }, { status: 500 });
  }
}
