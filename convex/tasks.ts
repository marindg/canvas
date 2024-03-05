import { v } from "convex/values";
import { ListWithCards } from "../types/taskBoard";
import { mutation, query } from "./_generated/server";

export const getTaskBoardList = query({
  args: { id: v.id("boards") },
  handler: async (
    ctx,
    args
  ): Promise<ListWithCards[] | undefined> => {
    const lists = ctx.db
      .query("taskBoardList")
      .filter((q) => q.eq(q.field("boardId"), args.id))
      .order("asc")
      .collect();

    const listOrdered = (await lists).sort(
      (a, b) => a.order - b.order
    );

    const ListWithCards = await Promise.all(
      (
        await listOrdered
      ).map(async (list) => {
        const cards = await ctx.db
          .query("taskBoardCard")
          .withIndex("by_list", (q) => {
            return q.eq("listId", list._id);
          })
          .order("asc")
          .collect();

        const cardsOrdered = cards.sort(
          (a, b) => a.order - b.order
        );

        return { ...list, cards: cardsOrdered };
      })
    );

    return ListWithCards;
  },
});

export const createList = mutation({
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
      authorId: identity.subject,
    });

    return newList;
  },
});

export const copyList = mutation({
  args: {
    listId: v.id("taskBoardList"),
    boardId: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const existingList = await ctx.db.get(args.listId);

    if (!existingList) {
      throw new Error("List not found");
    }

    const listsInBoard = await ctx.db
      .query("taskBoardList")
      .withIndex("by_board", (q) => {
        return q.eq("boardId", args.boardId);
      })
      .collect();

    const highestOrder = listsInBoard.reduce(
      (max, list) => Math.max(max, list.order),
      0
    );

    const newList = await ctx.db.insert("taskBoardList", {
      boardId: args.boardId,
      title: existingList.title,
      authorId: identity.subject,
      order: highestOrder + 1,
    });

    return newList;
  },
});

export const updateList = mutation({
  args: {
    listId: v.id("taskBoardList"),
    boardId: v.id("boards"),
    title: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const existingList = await ctx.db.get(args.listId);

    if (!existingList) {
      throw new Error("List not found");
    }

    const updatedList = await ctx.db.patch(args.listId, {
      title: args.title,
      order: args.order,
    });

    return updatedList;
  },
});

export const removeList = mutation({
  args: {
    listId: v.id("taskBoardList"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const existingList = await ctx.db.get(args.listId);

    if (existingList) {
      await ctx.db.delete(existingList._id);
    } else {
      throw new Error("List not found");
    }
  },
});

export const createCard = mutation({
  args: {
    boardId: v.id("boards"),
    listId: v.id("taskBoardList"),
    title: v.string(),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const existingList = await ctx.db.get(args.listId);

    if (!existingList) {
      throw new Error("List not found");
    }

    const lastCard = await ctx.db
      .query("taskBoardCard")
      .withIndex("by_list", (q) => {
        return q.eq("listId", args.listId);
      })
      .order("desc")
      .first();

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    const newCard = await ctx.db.insert("taskBoardCard", {
      title: args.title,
      listId: args.listId,
      order: newOrder,
      authorId: identity.subject,
    });

    return newCard;
  },
});

export const updateListOrder = mutation({
  args: {
    items: v.array(
      v.object({
        _id: v.id("taskBoardList"),
        title: v.string(),
        boardId: v.id("boards"),
        authorId: v.string(),
        _creationTime: v.number(),
        cards: v.array(
          v.object({
            title: v.string(),
            order: v.number(),
            description: v.optional(v.string()),
            listId: v.id("taskBoardList"),
            authorId: v.string(),
            _creationTime: v.number(),
            _id: v.id("taskBoardCard"),
          })
        ),
        order: v.number(),
      })
    ),
    boardId: v.id("boards"),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const updates = args.items.map((item) =>
      ctx.db.patch(item._id, {
        order: item.order,
      })
    );

    try {
      await Promise.all(updates);
    } catch (error: any) {
      throw new Error(
        "Failed to reorder: " + error.message
      );
    }

    return { success: true };
  },
});

export const updateCardOrder = mutation({
  args: {
    cards: v.array(
      v.object({
        title: v.string(),
        order: v.number(),
        description: v.optional(v.string()),
        listId: v.id("taskBoardList"),
        authorId: v.string(),
        _creationTime: v.number(),
        _id: v.id("taskBoardCard"),
      })
    ),
    listId: v.id("taskBoardList"),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const cardUpdates = args.cards.map((card) =>
      ctx.db.patch(card._id, {
        order: card.order,
        listId: args.listId,
      })
    );

    try {
      await Promise.all(cardUpdates);
    } catch (error: any) {
      throw new Error(
        "Failed to reorder cards: " + error.message
      );
    }

    return { success: true };
  },
});
