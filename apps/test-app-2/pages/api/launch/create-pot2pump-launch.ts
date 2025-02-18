// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { caller } from "@/server/_app";
import { ftoService } from "@/server/service/fto";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";

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
    if (
      !req.body ||
      !req.body.pair ||
      !req.body.provider ||
      !req.body.chain_id ||
      !req.body.projectName
    ) {
      const missingFields = [];
      if (!req.body.pair) missingFields.push("pair");
      if (!req.body.provider) missingFields.push("provider");
      if (!req.body.chain_id) missingFields.push("chain_id");
      if (!req.body.projectName) missingFields.push("projectName");
      return res.status(400).json({
        status: "error",
        message: `Bad Request, missing required fields: ${missingFields.join(", ")}`,
      });
    }

    try {
      //check if pair is valid
      if (!(await isValidPair(req.body.pair))) {
        return res.status(400).json({
          status: "error",
          message: "Invalid launch address",
        });
      }
    } catch (e: any) {
      return res.status(400).json({
        status: "error",
        message: "Invalid launch address",
      });
    }

    const body = await req.body;

    if (!body) {
      return res.status(400).json({
        status: "error",
        message: "Bad Request",
      });
    }

    const data = await ftoService.createFtoProject(body);

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

async function isValidPair(pair: string): Promise<boolean> {
  const memelaunch = new MemePairContract({
    address: pair,
  });

  await memelaunch.getRaisedTokenMinCap();

  return (
    memelaunch.raisedTokenMinCap !== undefined &&
    memelaunch.raisedTokenMinCap.gt(0)
  );
}
