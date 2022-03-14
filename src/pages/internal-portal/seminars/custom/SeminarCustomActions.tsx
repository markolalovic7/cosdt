import React, { useContext } from "react";
import styles from "../../../../shared/components/datagrid/DataGrid.module.scss";
import { Button, Modal } from "antd";
import { DataGridContext, DataGridContextType } from "../../../../model/ui/types/DataGridContextType";
import { SeminarAttendee } from "../../../../model/domain/classes/SeminarAttendee";
import { PlusOutlined } from "@ant-design/icons/lib";

const { confirm } = Modal;

interface SeminarCustomActionsComponentProps {
  onDeleteSelected?(id: Array<number>): Promise<void>;
  onCreate?(): Promise<void>
  onDownloadDescription?(id: Array<number>): Promise<void>
}

const SeminarCustomActionsComponent = ({
  onDeleteSelected,
  onCreate,
  onDownloadDescription
}: SeminarCustomActionsComponentProps) => {

  const { selection, setSelection } = useContext<DataGridContextType<SeminarAttendee>>(DataGridContext);

  async function handleDelete() {
    confirm({
      title: "Warning",
      content:
        "This action deletes all selected records. Are you sure you want to continue?",
      onCancel: () => {
      },
      onOk: async () => {
        if (onDeleteSelected) {
          await onDeleteSelected(selection.map((sel) => sel.id));
        }
        setSelection([]);
      },
      okText: "Yes",
      cancelText: "No",
    });
  }


  async function handleListDownload() {
    onDownloadDescription && await onDownloadDescription(selection.map((sel) => sel.id))
  }

  return (
    <div className={styles.dataGridActions}>
      <div>
        {onDeleteSelected && (
          <Button
            onClick={handleDelete}
            disabled={!selection.length}
            type="link"
            danger
            className={styles.dataGridActionsButton}
          >
            Delete selected
          </Button>
        )}
      </div>
      <div>
        <div>
          <Button
            onClick={handleListDownload}
            disabled={!selection.length}
            type="primary"
            className={styles.dataGridActionsButton}
          >
            Download description info list
          </Button>
          <Button
            onClick={onCreate}
            type="primary"
            className={styles.dataGridActionsButton}
          >
            <PlusOutlined /> Add
          </Button>
        </div>
      </div>
    </div>
  )
};

export default SeminarCustomActionsComponent;
