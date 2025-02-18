import {
  authProcedure,
  publicProcedure,
  rateLimitMiddleware,
  router,
} from "../trpc";
import z from "zod";
import { discussionService } from "../service/discussion";

const alphakek_api_key = process.env.ALPHAKEK_AI_API_KEY ?? "";
const base_url = "https://api.alphakek.ai/visuals/v2/create_image";

export const aiLaunchProjectRouter = router({
  generateAiProject: publicProcedure
    .use(
      rateLimitMiddleware({
        limit: 1,
        duration: 1000 * 60 * 2,
      })
    )
    .input(
      z.object({
        wallet_address: z.string(),
        prompt_input: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      if (!alphakek_api_key) {
        throw new Error("AlphaKek API key is not set");
      }

      console.log("input.prompt_input:", input.prompt_input);

      const requestBody = {
        prompt: input.prompt_input,
        width: 512,
        height: 512,
        allow_nsfw: true,
      };

      const response = await fetch(base_url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${alphakek_api_key}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Host: "api.alphakek.ai",
          Connection: "keep-alive",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data: { status: string; cdn_url: string } = await response.json();
      console.log("data:", data);
      return data.cdn_url;
    }),
});
