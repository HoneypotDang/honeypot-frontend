import { pg } from "@/lib/db";
import { get } from "lodash";

export const discussionService = {
  createComment: async (data: {
    project_id: number;
    commenter: string;
    comment: string;
    is_owner: boolean;
    parent_comment_id?: number;
  }) => {
    await pg`INSERT INTO projectcomments ${pg({
      project_id: data.project_id,
      commenter: data.commenter,
      comment: data.comment,
      is_owner: data.is_owner,
      parent_comment_id: data.parent_comment_id ?? null,
    })}`;
  },
  getCommentsByProjectId: async (data: {
    project_id: number;
    limit?: number;
    afterId?: number;
    beforeId?: number;
  }) => {
    const comments = await pg<
      {
        id: number;
        project_id: number;
        commenter: string;
        comment: string;
        is_owner: boolean;
        parent_comment_id: number | null;
        created_at_unix: number;
        updated_at_unix: number;
      }[]
    >`
      SELECT * 
      FROM projectcomments 
      WHERE project_id = ${data.project_id} 
      AND id > ${data.afterId ?? -1}
      AND id < ${data.beforeId ?? 2147483647}
      ORDER BY id DESC 
      LIMIT ${data.limit ?? 100}
      `;

    return comments;
  },
};
