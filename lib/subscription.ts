import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

const DAY_IN_MS = 86_400_00;

export const checkSubscription = async () => {
  const { orgId } = await auth();

  if (!orgId) return false;

  const orgSubscription = await db.orgSubscription.findUnique({
    where: { orgId },
    select: {
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
      stripeSubscriptionId: true,
    },
  });

  if (!orgSubscription) return false;

  const isValid =
    orgSubscription.stripePriceId &&
    orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  return !!isValid;
};
