import { v } from "convex/values";
import { List } from "../types/taskBoard";
import { mutation, query } from "./_generated/server";

export const getTaskBoardList = query({
  args: { id: v.id("boards") },
  handler: async (
    ctx,
    args
  ): Promise<List[] | undefined> => {
    const taskBoardList = ctx.db
      .query("taskBoardList")
      .filter((q) => q.eq(q.field("boardId"), args.id))
      .order("asc")
      .collect();
    return taskBoardList;
  },
});

export const create = mutation({
  args: {
    boardId: v.id("boards"),
    title: v.string(),
    numberOfLists: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const newList = await ctx.db.insert("taskBoardList", {
      boardId: args.boardId,
      title: args.title,
      order: args.numberOfLists + 1,
    });

    return newList;
  },
});