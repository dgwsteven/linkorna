import type { PlanName } from "@/lib/data";

export const TRIAL_DAYS = 30;
export const TEST_ACCOUNT_EMAIL = "s.dai@choicell.de";

export const planTaskLimits: Record<PlanName, number> = {
  Starter: 80,
  Business: 150,
  Executive: 300
};

const planRank: Record<PlanName, number> = {
  Starter: 1,
  Business: 2,
  Executive: 3
};

export type AccessWorkspace = {
  plan: PlanName | null;
  monthly_task_limit: number | null;
  created_at: string | null;
  subscription_status?: string | null;
  paid_until?: string | null;
};

export type AccessState = {
  plan: PlanName;
  fullAccess: boolean;
  paidActive: boolean;
  trialActive: boolean;
  trialDaysRemaining: number;
  monthlyLimit: number;
  monthlyUsed: number;
  usageRemaining: number;
};

export function hasFullEmployeeAccess(email?: string | null) {
  return email?.toLowerCase() === TEST_ACCOUNT_EMAIL;
}

export function trialDaysRemaining(createdAt?: string | null, now = new Date()) {
  if (!createdAt) return 0;
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return 0;
  const elapsedMs = now.getTime() - created.getTime();
  const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  return Math.max(0, TRIAL_DAYS - elapsedDays);
}

export function canUsePlan(currentPlan: PlanName, requiredPlan: PlanName) {
  return planRank[currentPlan] >= planRank[requiredPlan];
}

function isFutureDate(value?: string | null, now = new Date()) {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.getTime() > now.getTime();
}

export function buildAccessState({
  email,
  workspace,
  monthlyUsed
}: {
  email?: string | null;
  workspace?: AccessWorkspace | null;
  monthlyUsed: number;
}): AccessState {
  const fullAccess = hasFullEmployeeAccess(email);
  const plan = fullAccess ? "Executive" : workspace?.plan ?? "Starter";
  const paidActive =
    workspace?.subscription_status === "active" ||
    workspace?.subscription_status === "trialing" ||
    isFutureDate(workspace?.paid_until);
  const remainingTrialDays = trialDaysRemaining(workspace?.created_at);
  const trialActive = !fullAccess && !paidActive && remainingTrialDays > 0;
  const monthlyLimit = fullAccess ? 9999 : planTaskLimits[plan];

  return {
    plan,
    fullAccess,
    paidActive,
    trialActive,
    trialDaysRemaining: remainingTrialDays,
    monthlyLimit,
    monthlyUsed,
    usageRemaining: Math.max(0, monthlyLimit - monthlyUsed)
  };
}

export function canRunEmployee(access: AccessState, employeePlan: PlanName) {
  if (access.fullAccess) return { allowed: true, reason: "" };

  if (!access.trialActive && !access.paidActive && access.plan === "Starter") {
    return {
      allowed: false,
      reason: "Your 30-day trial has ended. Please choose a paid plan to continue using Starter employees."
    };
  }

  if (access.trialActive && employeePlan !== "Starter") {
    return {
      allowed: false,
      reason: "During the free trial, you can use the three Starter AI employees. Upgrade to unlock Business or Executive employees."
    };
  }

  if (!access.trialActive && !canUsePlan(access.plan, employeePlan)) {
    return {
      allowed: false,
      reason: `${employeePlan} employee access requires the ${employeePlan} plan or higher.`
    };
  }

  if (access.monthlyUsed >= access.monthlyLimit) {
    return {
      allowed: false,
      reason: "Your monthly task quota has been used. Please upgrade your plan or wait for the next billing period."
    };
  }

  return { allowed: true, reason: "" };
}
