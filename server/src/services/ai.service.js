import OpenAI from 'openai'; import { env } from '../config/env.js';
const fallbackCategories = { food: 'Food & dining', restaurant: 'Food & dining', uber: 'Transport', ola: 'Transport', rent: 'Rent', netflix: 'Entertainment', amazon: 'Shopping', pharmacy: 'Health', salary: 'Salary', electricity: 'Utilities' };
export function categorizeFallback(description = '') { const text = description.toLowerCase(); return Object.entries(fallbackCategories).find(([term]) => text.includes(term))?.[1] || 'Other'; }
export async function categorizeExpense(description) { if (!env.openaiApiKey) return { category: categorizeFallback(description), source: 'rules' }; const client = new OpenAI({ apiKey: env.openaiApiKey }); const response = await client.chat.completions.create({ model: env.openaiModel, temperature: 0, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: 'Return JSON only: {"category":"one of Food & dining, Groceries, Transport, Shopping, Rent, Utilities, Entertainment, Health, Education, Travel, Other","confidence":0-1}. Categorize the expense.' }, { role: 'user', content: description.slice(0, 1000) }] }); const result = JSON.parse(response.choices[0].message.content || '{}'); return { category: result.category || 'Other', confidence: result.confidence, source: 'ai' }; }
export async function analyzeReceipt(file) { const fallback = { merchant: file.originalname.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '), amount: null, date: new Date().toISOString().slice(0, 10), category: categorizeFallback(file.originalname), source: 'rules' }; if (!env.openaiApiKey) return fallback; const client = new OpenAI({ apiKey: env.openaiApiKey }); const image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`; const response = await client.chat.completions.create({ model: env.openaiModel, temperature: 0, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: 'Read this purchase receipt. Return JSON only: {"merchant":"string","amount":number|null,"date":"YYYY-MM-DD|null","category":"Food & dining|Groceries|Transport|Shopping|Rent|Utilities|Entertainment|Health|Education|Travel|Other"}. Never invent unreadable values; use null.' }, { role: 'user', content: [{ type: 'text', text: 'Extract receipt fields.' }, { type: 'image_url', image_url: { url: image } }] }] }); return { ...fallback, ...JSON.parse(response.choices[0].message.content || '{}'), source: 'ai' }; }
export function generateInsights(transactions = [], budgets = []) { const expenses = transactions.filter((t) => t.type === 'expense'); const byCategory = expenses.reduce((map, t) => map.set(t.category, (map.get(t.category) || 0) + t.amount), new Map()); const results = []; for (const budget of budgets) { const actual = byCategory.get(budget.category) || 0, ratio = actual / budget.limit; if (ratio >= 1) results.push({ type: 'budget', severity: 'critical', title: `${budget.category} budget exceeded`, message: `You've spent ${Math.round(ratio * 100)}% of your ${budget.category} budget.` }); else if (ratio >= .8) results.push({ type: 'alert', severity: 'warning', title: `${budget.category} is nearly full`, message: `${Math.round((1 - ratio) * 100)}% of this month's budget remains.` }); } const top = [...byCategory.entries()].sort((a, b) => b[1] - a[1])[0]; if (top) results.push({ type: 'saving', severity: 'info', title: `Most spending: ${top[0]}`, message: `This month, ${top[0]} accounts for ₹${top[1].toLocaleString('en-IN')} of your outgoings. Review it for a small saving opportunity.` }); return results.slice(0, 5); }

export async function askAiAdvisor(prompt, userContext = {}) {
  const { totalIncome = 125000, totalExpense = 48250, savingsRate = 61.4, topCategory = 'Food & dining' } = userContext;
  if (env.openaiApiKey) {
    try {
      const client = new OpenAI({ apiKey: env.openaiApiKey });
      const systemPrompt = `You are SmartSpend AI, a world-class certified personal financial advisor and wealth coach.
      User Financial Context:
      - Monthly Income: ₹${totalIncome}
      - Monthly Expense: ₹${totalExpense}
      - Savings Rate: ${savingsRate}%
      - Primary Expense Category: ${topCategory}
      Provide clear, actionable, friendly, structured financial advice formatted in clean Markdown. Include practical tips and estimated savings in INR (₹).`;
      const response = await client.chat.completions.create({
        model: env.openaiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      });
      return { answer: response.choices[0].message.content, source: 'ai' };
    } catch (e) {
      console.error('OpenAI Error fallback to rule engine:', e.message);
    }
  }

  // Intelligent context-aware rule engine for advisory answers
  const query = prompt.toLowerCase();
  let answer = "";
  if (query.includes('save') || query.includes('saving')) {
    answer = `### 💡 Smart Savings Strategy & Action Plan\n\nBased on your current cashflow (₹${totalIncome.toLocaleString('en-IN')} income, ₹${totalExpense.toLocaleString('en-IN')} expenses):\n\n1. **Optimize High-Volume Categories**: Your top spending category is **${topCategory}**. Cutting discretionary spending here by **15%** could save you **₹${Math.round(totalExpense * 0.15).toLocaleString('en-IN')}** every month.\n2. **Automate 50/30/20 Rule**: Allocate 50% for Needs, 30% for Wants, and direct 20% (₹${Math.round(totalIncome * 0.2).toLocaleString('en-IN')}) into automated high-yield recurring deposits or index mutual funds on payday.\n3. **Subscription Audit**: Cancel unused subscriptions (OTT, unused apps, unused memberships) to instantly liberate ₹1,500–₹3,000 monthly.`;
  } else if (query.includes('budget') || query.includes('plan')) {
    answer = `### 📊 Personalized Budget Framework\n\nHere is a recommended monthly allocation for your income of **₹${totalIncome.toLocaleString('en-IN')}**:\n\n* **Essentials & Rent (50%)**: ₹${Math.round(totalIncome * 0.5).toLocaleString('en-IN')}\n* **Lifestyle & Dining (25%)**: ₹${Math.round(totalIncome * 0.25).toLocaleString('en-IN')}\n* **Investments & Emergency Fund (25%)**: ₹${Math.round(totalIncome * 0.25).toLocaleString('en-IN')}\n\n> 🎯 **Next Step**: Set strict category alerts on SmartSpend for dining out to keep your monthly expense under control.`;
  } else if (query.includes('debt') || query.includes('loan') || query.includes('emi')) {
    answer = `### 🛡️ Debt Reduction & Snowball Strategy\n\n1. **Target High Interest First (Avalanche Method)**: Always prioritize credit card bills or personal loans carrying interest rates over 12-18% before standard home or car loans.\n2. **EMI Cap Rule**: Ensure total monthly EMIs do not exceed **40%** of your monthly net income (₹${Math.round(totalIncome * 0.4).toLocaleString('en-IN')}).\n3. **Prepayment Multiplier**: Adding just **1 extra EMI per year** on long-term loans reduces your total interest burden by up to 22%!`;
  } else if (query.includes('invest') || query.includes('grow') || query.includes('wealth')) {
    answer = `### 📈 Wealth Acceleration Blueprint\n\nTo scale your current savings rate of **${savingsRate}%**:\n\n- **Emergency Shield**: Maintain 6 months of expenses (₹${Math.round(totalExpense * 6).toLocaleString('en-IN')}) in a liquid fund before aggressive investing.\n- **Core Portfolio**: 70% Nifty 50 / Index Funds, 20% Flexi-Cap / Growth Funds, 10% Gold ETF or Sovereign Gold Bonds for hedging.\n- **Tax Savings**: Maximize Section 80C (ELSS Tax Saver Mutual Funds up to ₹1.5 Lakh/year).`;
  } else {
    answer = `### 🤖 SmartSpend AI Advisor Overview\n\nHello! I analyzed your profile:\n\n- **Monthly Net Savings**: ₹${(totalIncome - totalExpense).toLocaleString('en-IN')} (${savingsRate}% savings rate)\n- **Spending Pattern**: Highly active in ${topCategory}\n\n**Key Recommendation**: You are in a healthy position to increase your monthly automated investments by **10%** without compromising your lifestyle quality. Would you like me to map out a 1-year financial forecast for you?`;
  }

  return { answer, source: 'rule-engine' };
}

