import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { stripUndefined } from "./helpers";

export const getConfig = query({
  args: {},
  handler: async (ctx) => {
    const configs = await ctx.db.query("osConfig").collect();
    return configs[0] || null;
  },
});

export const upsertOsConfig = mutation({
  args: {
    id: v.optional(v.id("osConfig")),
    icons: v.optional(
      v.array(
        v.object({
          label: v.string(),
          icon: v.string(),
          content: v.optional(v.string()),
          action: v.optional(v.string()),
          order: v.number(),
        })
      )
    ),
    initialWindows: v.optional(
      v.array(
        v.object({
          title: v.string(),
          content: v.string(),
          x: v.number(),
          y: v.number(),
        })
      )
    ),
    desktopColor: v.optional(v.string()),
    visible: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const filtered = stripUndefined(fields);

    if (id) {
      await ctx.db.patch(id, filtered);
      return id;
    } else {
      return await ctx.db.insert("osConfig", {
        icons: fields.icons || [
          { label: "My Computer", icon: "\u{1F4BB}", content: "Nothing here yet.", order: 0 },
          { label: "Trash", icon: "\u{1F5D1}\uFE0F", content: "Empty.", order: 1 },
          { label: "Documents", icon: "\u{1F4C1}", content: "CV.pdf\nProjects.txt", order: 2 },
          { label: "Exit OS", icon: "\u{1F50C}", action: "exit", order: 3 },
        ],
        initialWindows: fields.initialWindows || [
          { title: "Welcome.txt", content: "Welcome to OS Mode.\nDouble click icons to open.\nDrag windows to organize.", x: 100, y: 100 },
          { title: "System Info", content: "CPU: Neural Engine\nRAM: Infinite\nOS: S3NIK OS v1", x: 200, y: 200 },
        ],
        desktopColor: fields.desktopColor,
        visible: fields.visible ?? true,
      });
    }
  },
});
