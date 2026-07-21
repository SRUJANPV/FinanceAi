import test from 'node:test';
import assert from 'node:assert/strict';
import { categorizeFallback, generateInsights } from '../src/services/ai.service.js';

test('categorizeFallback classifies common merchant descriptions', () => {
  assert.equal(categorizeFallback('Uber trip to airport'), 'Transport');
  assert.equal(categorizeFallback('Monthly Netflix payment'), 'Entertainment');
  assert.equal(categorizeFallback('Unrecognized vendor'), 'Other');
});

test('generateInsights emits budget warnings and a category recommendation', () => {
  const insights = generateInsights([
    { type: 'expense', category: 'Food & dining', amount: 950 },
    { type: 'expense', category: 'Transport', amount: 100 }
  ], [{ category: 'Food & dining', limit: 1000, alertThreshold: 80 }]);
  assert.ok(insights.some((insight) => insight.type === 'alert' && insight.severity === 'warning'));
  assert.ok(insights.some((insight) => insight.type === 'saving' && insight.title.includes('Food & dining')));
});

test('generateInsights reports an exceeded budget as critical', () => {
  const insights = generateInsights([{ type: 'expense', category: 'Utilities', amount: 1100 }], [{ category: 'Utilities', limit: 1000, alertThreshold: 80 }]);
  assert.ok(insights.some((insight) => insight.type === 'budget' && insight.severity === 'critical'));
});
