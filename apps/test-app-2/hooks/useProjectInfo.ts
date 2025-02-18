import { trpcClient } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { wallet } from "@/services/wallet";

interface ProjectInfo {
  id?: number;
  telegram?: string;
  twitter?: string;
  website?: string;
  description?: string;
  name?: string;
  provider?: string;
  logo_url?: string;
  banner_url?: string;
  beravote_space_id?: string;
  launch_token?: string;
  raising_token?: string;
}

export const useProjectInfo = (pairId: string) => {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectInfo = async () => {
      try {
        const res = await trpcClient.projects.getProjectInfo.query({
          chain_id: wallet.currentChainId,
          pair: pairId,
        });

        if (res) {
          setProjectInfo(res);
        }
      } catch (error) {
        console.error("Failed to fetch project info:", error);
      } finally {
        setLoading(false);
      }
    };

    if (pairId) {
      fetchProjectInfo();
    }
  }, [pairId]);

  return {
    projectInfo,
    loading,
  };
};
