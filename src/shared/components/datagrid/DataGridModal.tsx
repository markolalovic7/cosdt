import React from "react";

import { Button } from "antd";
import Modal, { ModalProps } from "antd/lib/modal";

interface DataGridModalProps extends ModalProps {
  onClose(): void;
  isLoading: boolean;
}

function DataGridModalComponent({
  onClose,
  isLoading,
  children,
  ...restProps
}: DataGridModalProps & React.HTMLAttributes<HTMLElement>) {
  return (
    <Modal
      {...restProps}
      title={restProps.title}
      visible={restProps.visible !== undefined ? restProps.visible : true}
      closable={false}
      maskClosable={restProps.maskClosable || false}
      footer={
        restProps.footer === undefined
          ? [
              <Button key="backButton" disabled={isLoading} onClick={onClose}>
                Close
              </Button>,
              <Button
                form="detailsForm"
                key="submit"
                type="primary"
                htmlType="submit"
                loading={isLoading}
              >
                Save
              </Button>,
            ]
          : restProps.footer
      }
    >
      {children}
    </Modal>
  );
}

export default DataGridModalComponent;
