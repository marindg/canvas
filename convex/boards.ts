import { v } from "convex/values";
import { query } from "./_generated/server";

import { getAllOrThrow } from "convex-helpers/server/relationships";

export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
    type: v.optional(
      v.union(v.literal("board"), v.literal("task"))
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (args.favorites) {
      const favoritedBoards = await ctx.db
        .query("userFavorites")
        .withIndex("by_user_org", (q) => {
          return q
            .eq("userId", identity.subject)
            .eq("orgId", args.orgId);
        })
        .order("desc")
        .collect();

      const ids = favoritedBoards.map((b) => b.boardId);

      const boards = await getAllOrThrow(ctx.db, ids);

      return boards.map((board) => ({
        ...board,
        isFavorite: true,
      }));
    }

    if (args.type) {
      const boards = await ctx.db
        .query("boards")
        .withSearchIndex("search_type", (q) =>
          q
            .search("type", args.type || "board" || "task")
            .eq("orgId", args.orgId)
        )
        .collect();

      return boards.map((board) => ({
        ...board,
      }));
    }

    const title = args.search as string;
    let boards = [];

    if (title) {
      boards = await ctx.db
        .query("boards")
        .withSearchIndex("search_title", (q) =>
          q.search("title", title).eq("orgId", args.orgId)
        )
        .collect();
    } else {
      boards = await ctx.db
        .query("boards")
        .withIndex("by_org", (q) =>
          q.eq("orgId", args.orgId)
        )
        .order("desc")
        .collect();
    }
    const boardsWithFavoritesRelation = boards.map(
      (board) => {
        return ctx.db
          .query("userFavorites")
          .withIndex("by_user_board", (q) =>
            q
              .eq("userId", identity.subject)
              .eq("boardId", board._id)
          )
          .unique()
          .then((favorite) => {
            return {
              ...board,
              isFavorite: !!favorite,
            };
          });
      }
    );

    const boardsWithFavoriteBoolean = Promise.all(
      boardsWithFavoritesRelation
    );

    return boardsWithFavoriteBoolean;
  },
});
