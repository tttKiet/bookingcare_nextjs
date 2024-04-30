import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";

export interface ModalPositionHereProps {
  title: string;
  body: React.ReactNode;
  contentBtnSubmit?: string;
  contentBtnCancel?: string;
  handleSubmit?: (data: any) => void;
  show: boolean;
  toggle: () => void;
  footer?: boolean;
  width?: number;
  backdrop?: "blur" | "transparent" | "opaque" | undefined;
  config?: ModalProps;
  disable?: boolean;
  isLoading?: boolean;
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "full"
    | "xs"
    | "3xl"
    | "4xl"
    | "5xl"
    | undefined;
  scrollBehavior?: "normal" | "inside" | "outside";
}

export function ModalPositionHere({
  title,
  body,
  size = "2xl",
  contentBtnSubmit,
  contentBtnCancel,
  handleSubmit,
  show,
  toggle,
  footer,
  width,
  config,
  backdrop,
  isLoading,
  scrollBehavior,
  disable,
}: ModalPositionHereProps) {
  return (
    <div>
      <Modal
        scrollBehavior={scrollBehavior}
        {...config}
        backdrop={backdrop || "opaque"}
        isOpen={show}
        size={size}
        className="z-40"
        // scrollBehavior="outside"
        onSubmit={handleSubmit}
        onClose={toggle}
        style={{ width: width }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>{body}</ModalBody>
              {footer !== false && (
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Hủy
                  </Button>
                  <Button
                    isDisabled={disable}
                    color={disable ? "default" : "primary"}
                    onPress={handleSubmit}
                    isLoading={isLoading}
                  >
                    {contentBtnSubmit || "Lưu"}
                  </Button>
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
