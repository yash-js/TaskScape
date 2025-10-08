"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { StripeRedict } from "./schema";
import { absoluteUrl } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

const handler = async (): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  const user = await currentUser();
  if (!userId || !user || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const settingsUrl = absoluteUrl(`/organization/${orgId}`);
  let url;

  try {
    const orgSubscription = await db.orgSubscription.findUnique({
      where: {
        orgId,
      },
    });

    if (orgSubscription && orgSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      url = stripeSession.url;
    } else {
      // const stripeSession = await stripe.checkout.sessions.create({
      //   success_url: settingsUrl,
      //   cancel_url: settingsUrl,
      //   payment_method_types: ["card"],
      //   mode: "subscription",
      //   billing_address_collection: "auto",
      //   customer_email: user.emailAddresses[0].emailAddress,
      //   line_items: [
      //     {
      //       price_data: {
      //         currency: "INR",
      //         product_data: {
      //           name: "TaskScape Pro",
      //           description: "Unlimited boards for your Organization!",
      //         },
      //         unit_amount: 199900,
      //         recurring: {
      //           interval: "month",
      //         },
      //       },
      //       quantity: 1,
      //     },
      //   ],
      //   metadata: {
      //     orgId,
      //   },
      // });
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "required",
        customer_email: user.emailAddresses[0]?.emailAddress,
        line_items: [
          {
            price_data: {
              currency: "INR",
              product_data: {
                name: "TaskScape Pro",
                description: "Unlimited boards for your organization",
              },
              unit_amount: 19900,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          orgId,
        },
      });
      url = stripeSession.url || "";
    }
  } catch (error) {
    return { error: "Something Went Wrong!" };
  }
  revalidatePath(`/organization/${orgId}`);
  return { data: url };
};

export const stripeRedirect = createSafeAction(StripeRedict, handler);
