import { Button, Divider, Modal } from "antd";
import { ModalProps } from "antd/lib";

export interface ModalPositionHereProps {
  title: string;
  body: React.ReactNode;
  contentBtnSubmit?: string;
  contentBtnCancel?: string;
  handleSubmit?: (data: any) => void;
  show: boolean;
  toggle: (e: React.MouseEvent) => void;
  footer?: boolean;
  width?: number;
  config?: ModalProps;
}

export function ModalPositionHere({
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
}: ModalPositionHereProps) {
  return (
    <div>
      <Modal
        title={title}
        open={show}
        width={width || 440}
        className="z-40"
        onOk={handleSubmit}
        onCancel={toggle}
        okText={contentBtnSubmit}
        style={{ top: 20 }}
        cancelText={contentBtnCancel}
        footer={footer}
        {...config}
      >
        <hr />

        {body}
      </Modal>
    </div>
  );
}
