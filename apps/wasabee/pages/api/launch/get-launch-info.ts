// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { caller } from "@/server/_app";
import { ftoService } from "@/server/service/fto";

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

  const { launchaddress, chainid } = req.query;

  if (!launchaddress || !chainid) {
    return res.status(400).json({
      status: "error",
      message: "Invalid request params",
    });
  }

  const data = await ftoService.getProjectInfo({
    pair: launchaddress as string,
    chain_id: parseInt(chainid as string),
  });

  if (!data) {
    return res.status(404).json({
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
