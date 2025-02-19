// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getCache } from "@/lib/cache";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<any>>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: "error",
      message: "Method Not Allowed",
    });
  }

  const { key } = req.query;
  if (!key) {
    return res.status(400).json({
      status: "error",
      message: "Invalid request params",
    });
  }

  const data = getCache(key as string);

  if (!data) {
    return res.status(200).json({
      status: "error",
      message: "No data found",
    });
  }

  res.status(200).json({
    status: "success",
    data: data,
    message: "Success",
  });
}
