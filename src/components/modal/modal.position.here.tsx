import * as React from "react";
import { Button, Divider, Modal } from "antd";

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
}: ModalPositionHereProps) {
  return (
    <div>
      <Modal
        title={title}
        open={show}
        width={width || 440}
        onOk={handleSubmit}
        onCancel={toggle}
        okText={contentBtnSubmit}
        style={{ top: 20 }}
        cancelText={contentBtnCancel}
        footer={footer}
      >
        <hr />

        {body}
      </Modal>
    </div>
  );
}
