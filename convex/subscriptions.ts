import { v } from "convex/values";
import {
    query,
    internalQuery,
    internalMutation,
} from "./_generated/server";

export const get = internalQuery({
    args: {
        orgId: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("orgSubscription")
            .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
            .unique();
    }
});


export const getIsSubscribed = query({
    args: {
        orgId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (!args.orgId) {
            return false;
        }

        const orgSubscription = await ctx.db
            .query("orgSubscription")
            .withIndex("by_org", (q) => {
                return q.eq("orgId", args.orgId as string);
            })
            .unique();

        const periodEnd = orgSubscription?.stripeCurrentPeriodEnd;

        const isSubscribed = periodEnd && periodEnd > Date.now();

        return isSubscribed;
    }
});

export const create = internalMutation({
    args: {
        orgId: v.string(),
        stripePlanId: v.string(),
        stripePriceId: v.string(),
        stripeCustomerId: v.string(),
        stripeSubscriptionId: v.string(),
        stripeCurrentPeriodEnd: v.number(),
    },
    handler: async (ctx, {
        orgId,
        stripePlanId,
        stripePriceId,
        stripeCustomerId,
        stripeSubscriptionId,
        stripeCurrentPeriodEnd,
    }) => {

        return await ctx.db.insert("orgSubscription", {
            orgId,
            stripePlanId,
            stripePriceId,
            stripeCustomerId,
            stripeSubscriptionId,
            stripeCurrentPeriodEnd,
        });
    }
});


export const update = internalMutation({
    args: {
        stripeSubscriptionId: v.string(),
        stripeCurrentPeriodEnd: v.number(),
    },
    handler: async (ctx, {
        stripeSubscriptionId,
        stripeCurrentPeriodEnd
    }) => {
        try {
            const existingSubscription = await ctx.db
                .query("orgSubscription")
                .withIndex("by_subscription", (q) => {
                    return q.eq("stripeSubscriptionId", stripeSubscriptionId);
                })
                .unique();

            if (!existingSubscription) {
                throw new Error("Subscription not found");
            }

            await ctx.db.patch(existingSubscription._id, {
                stripeCurrentPeriodEnd,
            });

            return { success: true };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    }
});