"use node";

import Stripe from "stripe";
import { v } from "convex/values";

import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

const url = process.env.NEXT_PUBLIC_APP_URL!;
const stripe = new Stripe(
    process.env.STRIPE_API_KEY!,
    {
        apiVersion: "2024-06-20",
    }
);

export const portal = action({
    args: {
        orgId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        if (!args.orgId) {
            throw new Error("Invalid organization ID");
        }

        const orgSubscription = await ctx.runQuery(internal.subscriptions.get, {
            orgId: args.orgId,
        });

        if (!orgSubscription) {
            throw new Error("Organization not found");
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: orgSubscription.stripeCustomerId,
            return_url: url,
        });

        return session.url!;
    }
});


export const pay = action({
    args: {
        orgId: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        if (!args.orgId) {
            throw new Error("Invalid organization ID");
        }

        const session = await stripe.checkout.sessions.create({
            success_url: url,
            cancel_url: url,
            customer_email: identity.email,
            line_items: [
                {
                    price_data: {
                        currency: "USD",
                        product_data: {
                            name: "Board Pro",
                            description: "Unlimited boards for your organization"
                        },
                        unit_amount: 2000,
                        recurring: {
                            interval: "month"
                        }
                    },
                    quantity: 1
                }
            ],
            // metadata is important! backend will use it to identify the organization
            // backend needs a way to know for which organization is this payment coming from,
            // because this is not gonna be any authorization from a user or something like that
            metadata: {
                orgId: args.orgId
            },
            mode: "subscription"
        });
        return session.url!;
    },
});


export const fulfill = internalAction({
    args: { signature: v.string(), payload: v.string() },
    handler: async (ctx, { signature, payload }) => {
        const webhooklSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
        try {
            const event = stripe.webhooks.constructEvent(
                payload,
                signature,
                webhooklSecret
            );

            const session = event.data.object as Stripe.Checkout.Session;

            if (event.type === "checkout.session.completed") {
                const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

                if (!session?.metadata?.orgId) {
                    throw new Error("Organization ID not found");
                }

                await ctx.runMutation(internal.subscriptions.create, {
                    orgId: session.metadata.orgId as string,
                    stripeSubscriptionId: subscription.id as string,
                    stripeCustomerId: subscription.customer as string,
                    stripePriceId: subscription.items.data[0].price.id as string,
                    stripeCurrentPeriodEnd: subscription.current_period_end * 1000,
                    stripePlanId: "// TODO: Add different plans" as string,
                });
            }

            if (event.type === "invoice.payment_succeeded") {
                const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

                await ctx.runMutation(internal.subscriptions.update, {
                    stripeSubscriptionId: subscription.id as string,
                    stripeCurrentPeriodEnd: subscription.current_period_end * 1000,
                });
            }

            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, error };
        }
    }
});


