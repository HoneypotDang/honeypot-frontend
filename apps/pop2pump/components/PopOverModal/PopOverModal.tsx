import { observer } from "mobx-react-lite";
import {
  WrappedNextModal,
  WrappedNextModalContent,
  WrappedNextModalBody,
} from "../wrappedNextUI/Modal/Modal";

import { popmodal } from "@/services/popmodal";
import { ModalFooter } from "@nextui-org/react";
import { Button } from "../button";

export const PopOverModal = observer(() => {
  console.log(popmodal.shouldCloseOnInteractOutside);
  return (
    <WrappedNextModal
      data-dismissable={popmodal.shouldCloseOnInteractOutside}
      isOpen={popmodal.open}
      onClose={() => {
        popmodal.closeModal();
      }}
      boarderLess={popmodal.boarderLess}
      isDismissable={popmodal.shouldCloseOnInteractOutside}
      isKeyboardDismissDisabled={popmodal.shouldCloseOnInteractOutside}
      shouldCloseOnInteractOutside={() => popmodal.shouldCloseOnInteractOutside}
    >
      <WrappedNextModalContent
        className="md:max-w-[min(1024px,80vw)] max-h-[80vh] overflow-y-auto"
        boarderLess={popmodal.boarderLess}
      >
        <WrappedNextModalBody
          className="max-h-[80vh]"
          boarderLess={popmodal.boarderLess}
        >
          {popmodal.modalContent}
        </WrappedNextModalBody>
        {!!popmodal.actions?.length && (
          <ModalFooter>
            {popmodal.actions.map((action) => (
              <Button key={action.label} onPress={action.onPress}>
                {action.label}
              </Button>
            ))}
          </ModalFooter>
        )}
      </WrappedNextModalContent>
    </WrappedNextModal>
  );
});

export default PopOverModal;
