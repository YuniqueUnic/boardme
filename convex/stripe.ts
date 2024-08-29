"use node";

import Stripe from "stripe";
import { v } from "convex/values";

import { action, internalAction } from "./_generated/server";

const url = process.env.NEXT_PUBLIC_APP_URL!;
const stripe = new Stripe(
    process.env.STRIPE_API_KEY!,
    {
        apiVersion: "2024-06-20",
    }
);


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

            if (event.type === "checkout.session.completed") {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log("CHCKOUT SESSION COMPLETED");
            }

            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, error };
        }
    }
});


