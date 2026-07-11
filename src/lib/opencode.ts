export async function callLLM(payload: { model: string; system: string; prompt: string; temperature?: number; maxTokens?: number }) {
  const key = process.env.OPENCODE_API_KEY;
  const res = await fetch("https://api.opencode.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: payload.model,
      messages: [{ role: "system", content: payload.system }, { role: "user", content: payload.prompt }],
      temperature: payload.temperature ?? 0.3,
      max_tokens: payload.maxTokens ?? 500,
    }),
  });
  if (!res.ok) throw new Error(`OpenCode API error ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.choices[0].message.content as string;
}
