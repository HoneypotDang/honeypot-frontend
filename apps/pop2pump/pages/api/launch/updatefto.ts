// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { caller } from "@/server/_app";
import { ftoService } from "@/server/service/fto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<any>>
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        status: "error",
        message: "Method Not Allowed",
      });
    }

    const body = await req.body;
    if (!body) {
      return res.status(400).json({
        status: "error",
        message: "Bad Request",
      });
    }

    const data = await ftoService.createOrUpdateProjectInfo(JSON.parse(body));

    if (!data) {
      return res.status(400).json({
        status: "error",
        message: "No Data Found",
      });
    }

    res.status(200).json({
      status: "success",
      data: data,
      message: "Success",
    });
  } catch (e: any) {
    res.status(500).json({
      status: "error",
      message: e?.message ?? "Error",
    });
  }
}
