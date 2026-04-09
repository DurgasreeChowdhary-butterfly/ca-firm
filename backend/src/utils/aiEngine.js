/**
 * AI Engine — uses Claude (Anthropic API) to answer Indian tax & compliance queries
 * Set ANTHROPIC_API_KEY in Render environment variables to activate
 * Falls back to keyword KB if API key not set
 */

const SYSTEM_PROMPT = `You are an expert Indian Chartered Accountant AI assistant. You answer questions about:
- GST (GSTR-1, GSTR-3B, GSTR-9, ITC, composition scheme, e-invoicing, e-way bill)
- Income Tax (ITR forms, tax slabs, deductions 80C/80D/80G, advance tax, TDS, capital gains)
- TDS/TCS (rates, due dates, returns 24Q/26Q, Form 16, Form 26AS)
- Company Law (ROC filings, MCA compliance, director KYC)
- Audit & Assurance (statutory audit, tax audit, internal audit)
- Business registration (GST registration, company/LLP/OPC registration)

Rules:
1. Give clear, direct, actionable answers with specific numbers, dates, and rates
2. Always mention applicable Act section / CBIC notification / IT Act section
3. Use Indian Rupee ₹ and Indian date formats
4. Keep answers concise — 3 to 6 sentences maximum
5. End with: "⚠️ This is general guidance. Consult your CA for advice specific to your situation."
6. If the question is completely unrelated to Indian taxation/finance/business, politely say you can only answer tax and compliance questions
7. Always respond in English`;

async function askClaude(query, category) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null; // No key — fall back to keyword KB

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // Fast + cheap for Q&A
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: `Category: ${category}\n\nQuestion: ${query}` }
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[AI] Anthropic API error:', response.status, err);
      return null;
    }

    const data = await response.json();
    const answer = data.content?.[0]?.text?.trim();
    if (!answer) return null;

    return {
      answer,
      citations: [{ source: 'Claude AI — Indian Tax Expert', section: `Category: ${category}` }],
      answeredBy: 'AI Engine (Claude)',
    };
  } catch (err) {
    console.error('[AI] Claude call failed:', err.message);
    return null;
  }
}

module.exports = { askClaude };
