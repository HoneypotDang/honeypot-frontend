import { authProcedure, publicProcedure, rateLimitMiddleware, router } from "../trpc";
import z from "zod";
import { discussionService } from "../service/discussion";

export const discussionRouter = router({
  createComment: publicProcedure
  // .use(rateLimitMiddleware({
  //   limit: 10,
  // }))
    .input(
      z.object({
        project_id: z.number(),
        commenter: z.string(),
        comment: z.string(),
        is_owner: z.boolean(),
        parent_comment_id: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await discussionService.createComment(input);
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }),
  getCommentsByProjectId: publicProcedure
    .input(
      z.object({
        project_id: z.number(),
        limit: z.number().optional(),
        afterId: z.number().optional(),
        beforeId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return (await discussionService.getCommentsByProjectId(input)).flatMap(
        (comment) => comment
      );
    }),
});
