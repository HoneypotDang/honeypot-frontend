import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { popmodal } from "@/services/popmodal";
import store from "store2";
import { useRouter } from "next/router";
import { guideConfigs } from "./config";
import Instruction from "./index";

const GuideModal: React.FC & { openInstructionModal?: () => void } = observer(
  () => {
    const router = useRouter();

    const config = guideConfigs.find((config) =>
      config.path.includes(router.pathname)
    );

    useEffect(() => {
      if (config) {
        const notice_read = Array.isArray(config.path)
          ? config.path.some((path) =>
              store.get("pot2pump_notice_read" + "_" + path)
            )
          : store.get("pot2pump_notice_read" + "_" + config.path);

        if (!notice_read && config) {
          openInstructionModal();
        }
      }
    }, [config]);

    const openInstructionModal = () => {
      popmodal.openModal({
        content: config && <Instruction {...config} />,
      });
    };

    GuideModal.openInstructionModal = openInstructionModal;

    return <div></div>;
  }
);

export default GuideModal;
