// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { cache } from "@/lib/cache";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<any>>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      message: "Method Not Allowed",
    });
  }

  const { key, data } = req.body;

  if (!key || !data) {
    return res.status(400).json({
      status: "error",
      message: "Invalid request params",
    });
  }

  try {
    cache(key as string, data as string);
    res.status(200).json({
      status: "success",
      data: true,
      message: "Success",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}
