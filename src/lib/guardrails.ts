export function detectPII(text: string): { pii: boolean; hits: string[] } {
  const hits: string[] = [];
  const email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  const phone = /\b(?:\+?1[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}\b/;
  const ssn = /\b\d{3}-\d{2}-\d{4}\b/;

  if (email.test(text)) hits.push("email");
  if (phone.test(text)) hits.push("phone");
  if (ssn.test(text)) hits.push("ssn");
  return { pii: hits.length > 0, hits };
}

// Toy heuristic: hallucination risk rises when response contains lots of "definitely/guaranteed"
// or the prompt asks for factual info and model doesn't cite anything.
export function hallucinationRisk(prompt: string, response: string): number {
  const certainty = (response.match(/\b(definitely|guaranteed|always|never|100%)\b/gi) ?? []).length;
  const asksFacts = /\b(date|price|statistics|who is|current|latest|exact)\b/i.test(prompt);
  const hasCites = /\[[0-9]+\]|\(.*?,\s*\d{4}\)/.test(response);
  let risk = 10;
  risk += Math.min(40, certainty * 10);
  if (asksFacts && !hasCites) risk += 35;
  risk += Math.random() * 10;
  return Math.max(0, Math.min(100, risk));
}

export function estimateTokens(text: string): number {
  // Very rough: ~4 chars/token average in English
  return Math.max(1, Math.round(text.length / 4));
}

export function estimateCostUsd(model: string, promptTokens: number, completionTokens: number): number {
  // Demo costs (not authoritative): keep simple for portfolio demo
  const per1kIn = model.includes("gpt-4") ? 0.01 : 0.002;
  const per1kOut = model.includes("gpt-4") ? 0.03 : 0.006;
  return (promptTokens / 1000) * per1kIn + (completionTokens / 1000) * per1kOut;
}
