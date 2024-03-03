import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  boards: defineTable({
    title: v.string(),
    orgId: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    imageUrl: v.string(),
    type: v.union(v.literal("board"), v.literal("task")),
  })
    .index("by_org", ["orgId"])
    .index("by_type", ["type"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["orgId"],
    })
    .searchIndex("search_type", {
      searchField: "type",
      filterFields: ["orgId"],
    }),
  userFavorites: defineTable({
    userId: v.string(),
    boardId: v.id("boards"),
    orgId: v.string(),
  })
    .index("by_board", ["boardId"])
    .index("by_user_org", ["userId", "orgId"])
    .index("by_user_board", ["userId", "boardId"])
    .index("by_user_board_org", [
      "userId",
      "boardId",
      "orgId",
    ]),
  taskBoardCard: defineTable({
    title: v.string(),
    order: v.number(),
    description: v.optional(v.string()),
    listId: v.id("taskBoardList"),
    authorId: v.string(),
  })
    .index("by_list", ["listId"])
    .index("by_order", ["order"]),
  taskBoardList: defineTable({
    title: v.string(),
    order: v.number(),
    boardId: v.id("boards"),
    authorId: v.string(),
  })
    .index("by_board", ["boardId"])
    .index("by_order", ["order"])
    .index("by_author", ["authorId"]),
  taskBoardCardLog: defineTable({
    taskBoardCardId: v.id("taskBoardCard"),
    authorId: v.string(),
  }).index("by_card", ["taskBoardCardId"]),
});
