export type PlanType = "free" | "pro" | "enterprise";

export interface Plan {
  id: PlanType;
  name: string;
  description: string;
  price: {
    monthly: number;
    annual?: number;
  };
  features: string[];
  limits: {
    analysesPerMonth: number | "unlimited";
    features: string[];
  };
  stripePriceId?: {
    monthly?: string;
    annual?: string;
  };
  recommended?: boolean;
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    price: {
      monthly: 0,
    },
    features: [
      "10 analyses per month",
      "Basic INVEST analysis",
      "Story history",
      "Email support",
    ],
    limits: {
      analysesPerMonth: 10,
      features: ["basic_analysis", "story_history"],
    },
  },
  {
    id: "pro",
    name: "Pro",
    description: "For professional Business Analysts",
    price: {
      monthly: 49,
      annual: 490, // ~17% discount
    },
    features: [
      "100 analyses per month",
      "Advanced INVEST analysis",
      "Detailed recommendations",
      "Export to PDF/Markdown",
      "Priority email support",
      "Story history",
    ],
    limits: {
      analysesPerMonth: 100,
      features: [
        "basic_analysis",
        "advanced_analysis",
        "story_history",
        "export",
        "priority_support",
      ],
    },
    stripePriceId: {
      monthly: "price_1SejUcKoI2CWEIGNx0ju4db2",
      annual: "price_1SejXOKoI2CWEIGNg0hVXHsp",
    },
    recommended: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For teams and organizations",
    price: {
      monthly: 99,
      annual: 990, // ~17% discount
    },
    features: [
      "Unlimited analyses",
      "Advanced INVEST analysis",
      "Detailed recommendations",
      "Export to PDF/Markdown",
      "Priority support",
      "Story history",
      "Team collaboration",
      "API access",
    ],
    limits: {
      analysesPerMonth: "unlimited",
      features: [
        "basic_analysis",
        "advanced_analysis",
        "story_history",
        "export",
        "priority_support",
        "team_collaboration",
        "api_access",
      ],
    },
    stripePriceId: {
      monthly: "price_1SejaLKoI2CWEIGNbnbZJtLR",
      annual: "price_1SejaLKoI2CWEIGNzhsrBDJk",
    },
  },
];

export function getPlanById(id: PlanType): Plan | undefined {
  return plans.find((plan) => plan.id === id);
}

export function getPlanFeatures(planId: PlanType): string[] {
  const plan = getPlanById(planId);
  return plan?.features || [];
}

export function getPlanLimit(planId: PlanType): number | "unlimited" {
  const plan = getPlanById(planId);
  return plan?.limits.analysesPerMonth || 10;
}

export function hasFeature(planId: PlanType, feature: string): boolean {
  const plan = getPlanById(planId);
  return plan?.limits.features.includes(feature) || false;
}