import * as React from "react";
import { Button, Modal } from "antd";

export interface ModalPositionHereProps {
  title: string;
  body: React.ReactNode;
  contentBtnSubmit: string;
  contentBtnCancel: string;
  handleSubmit: (e: React.MouseEvent) => void;
  show: boolean;
  toggle: (e: React.MouseEvent) => void;
  footer?: boolean;
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
}: ModalPositionHereProps) {
  return (
    <div>
      <Modal
        title={title}
        open={show}
        width={440}
        onOk={handleSubmit}
        onCancel={toggle}
        okText={contentBtnSubmit}
        style={{ top: 20 }}
        cancelText={contentBtnCancel}
        footer={footer}
      >
        {body}
      </Modal>
    </div>
  );
}
