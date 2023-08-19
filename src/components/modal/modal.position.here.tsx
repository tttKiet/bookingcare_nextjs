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
}

export function ModalPositionHere({
  title,
  body,
  contentBtnSubmit,
  contentBtnCancel,
  handleSubmit,
  show,
  toggle,
}: ModalPositionHereProps) {
  return (
    <div>
      <Modal title={title} open={show} onOk={handleSubmit} onCancel={toggle}>
        {body}
      </Modal>
    </div>
  );
}
