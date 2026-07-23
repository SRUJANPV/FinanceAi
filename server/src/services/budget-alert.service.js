import { Budget } from '../models/Budget.js';
import { Transaction } from '../models/Transaction.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { sendEmail, appLink } from './email.service.js';

/**
 * After a new expense transaction is saved, check every budget for the same
 * category & month. Send an email + in-app notification the FIRST TIME a
 * budget crosses its alertThreshold (default 80%) and again when it exceeds 100%.
 *
 * We track whether we already sent each alert type using two fields we add to
 * the budget document: `alertSentAt` and `exceededSentAt`.
 */
export async function checkBudgetAlerts(transaction) {
  // Only run for expense transactions
  if (transaction.type !== 'expense') return;

  const month = transaction.date.toISOString().slice(0, 7); // e.g. "2026-07"

  // Find budgets for this user + category + month
  const budgets = await Budget.find({
    user: transaction.user,
    category: transaction.category,
    month,
  });

  if (!budgets.length) return;

  // Sum ALL expenses in this category for this month
  const [result] = await Transaction.aggregate([
    {
      $match: {
        user: transaction.user,
        type: 'expense',
        category: transaction.category,
        date: {
          $gte: new Date(`${month}-01T00:00:00.000Z`),
          $lt:  new Date(
            new Date(`${month}-01T00:00:00.000Z`).setMonth(
              new Date(`${month}-01T00:00:00.000Z`).getMonth() + 1
            )
          ),
        },
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const totalSpent = result?.total ?? 0;

  // Fetch user once (for email)
  const user = await User.findById(transaction.user);
  if (!user) return;

  for (const budget of budgets) {
    const ratio = totalSpent / budget.limit;          // e.g. 0.85 = 85%
    const pct   = Math.round(ratio * 100);
    const threshold = budget.alertThreshold ?? 80;    // default 80

    const spent    = totalSpent.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    const limit    = budget.limit.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    const category = budget.category;

    /* ── EXCEEDED (100%+) ──────────────────────────────────────────────── */
    if (ratio >= 1 && !budget.exceededSentAt) {
      const title   = `🚨 ${category} budget exceeded!`;
      const message = `You've spent ${spent} — that's ${pct}% of your ${limit} ${category} budget for ${month}.`;

      await Promise.all([
        // In-app notification
        Notification.create({
          user:    user._id,
          type:    'budget',
          title,
          message,
          metadata: { category, month, spent: totalSpent, limit: budget.limit, pct },
        }),

        // Email
        sendEmail({
          to:      user.email,
          subject: `SmartSpend AI — ${category} budget exceeded`,
          html: budgetEmailHtml({
            name:     user.name,
            title,
            message,
            category,
            pct,
            spent,
            limit,
            month,
            severity: 'exceeded',
          }),
        }).catch((err) => console.error('[budget-alert] email error:', err)),
      ]);

      // Mark so we don't spam
      budget.exceededSentAt = new Date();
      await budget.save();

    /* ── WARNING (threshold%) ──────────────────────────────────────────── */
    } else if (ratio >= threshold / 100 && ratio < 1 && !budget.alertSentAt) {
      const title   = `⚠️ ${category} budget is ${pct}% used`;
      const message = `You've spent ${spent} of your ${limit} ${category} budget for ${month}. Only ${100 - pct}% remaining.`;

      await Promise.all([
        Notification.create({
          user:    user._id,
          type:    'budget',
          title,
          message,
          metadata: { category, month, spent: totalSpent, limit: budget.limit, pct },
        }),

        sendEmail({
          to:      user.email,
          subject: `SmartSpend AI — ${category} budget warning`,
          html: budgetEmailHtml({
            name:     user.name,
            title,
            message,
            category,
            pct,
            spent,
            limit,
            month,
            severity: 'warning',
          }),
        }).catch((err) => console.error('[budget-alert] email error:', err)),
      ]);

      budget.alertSentAt = new Date();
      await budget.save();
    }
  }
}

/** Simple, clean HTML email template */
function budgetEmailHtml({ name, title, message, category, pct, spent, limit, month, severity }) {
  const color     = severity === 'exceeded' ? '#ef4444' : '#f59e0b';
  const barColor  = severity === 'exceeded' ? '#ef4444' : '#f59e0b';
  const barWidth  = Math.min(pct, 100);

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#6366f1,#4f46e5);padding:32px 36px;">
            <p style="margin:0;color:#c7d2fe;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">SmartSpend AI</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:800;">${title}</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 36px;">
            <p style="margin:0 0 20px;color:#475569;font-size:15px;">Hi <strong>${name}</strong>,</p>
            <p style="margin:0 0 28px;color:#64748b;font-size:14px;line-height:1.6;">${message}</p>

            <!-- Progress bar -->
            <div style="background:#f1f5f9;border-radius:999px;height:12px;overflow:hidden;margin-bottom:8px;">
              <div style="background:${barColor};width:${barWidth}%;height:100%;border-radius:999px;transition:width 0.3s;"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;color:#94a3b8;margin-bottom:28px;">
              <span>Spent: <strong style="color:#1e293b;">${spent}</strong></span>
              <span><strong style="color:${color};">${pct}%</strong> used</span>
              <span>Limit: <strong style="color:#1e293b;">${limit}</strong></span>
            </div>

            <!-- CTA -->
            <div style="text-align:center;">
              <a href="${appLink('/budgets')}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;text-decoration:none;padding:13px 32px;border-radius:10px;font-size:14px;font-weight:700;">
                View My Budgets →
              </a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 36px;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
              You're receiving this because you set a budget for <strong>${category}</strong> in <strong>${month}</strong>.<br/>
              <a href="${appLink('/budgets')}" style="color:#6366f1;">Manage your budgets</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
