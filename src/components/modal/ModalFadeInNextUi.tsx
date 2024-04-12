import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";

export interface ModalFadeInNextUiProps {
  id: string;
  title: string;
  body?: React.ReactNode;
  contentBtnSubmit?: string;
  contentBtnCancel?: string;
  handleSubmit?: (data: any) => void;
  show: boolean;
  toggle: () => void;
  footer?: boolean;
  width?: number;
  config?: ModalProps;
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
  backdrop?: "blur" | "transparent" | "opaque" | undefined;
}

export function ModalFadeInNextUi({
  title,
  body,
  contentBtnSubmit,
  contentBtnCancel,
  handleSubmit,
  show,
  toggle,
  footer,
  width,
  config,
  isLoading,
  id,
  size,
  backdrop,
}: ModalFadeInNextUiProps) {
  return (
    <>
      <Modal
        backdrop={backdrop || "blur"}
        id={id}
        size={size}
        isOpen={show}
        onClose={toggle}
        className="z-50"
        scrollBehavior="inside"
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
                    color="primary"
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
    </>
  );
}
