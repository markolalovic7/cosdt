import React, { useContext } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./DataGrid.module.scss";
import {
  DataGridContext,
  DataGridContextType,
} from "../../../../model/ui/types/DataGridContextType";

export interface DataGridActionsProps<T> {
  onCreate?(): Promise<T | null | void>;
  onDeleteSelected?(id: Array<number>): Promise<void>;
}

function DataGridActionsComponent<RecordType extends AnyRecord>({
  onCreate,
  onDeleteSelected,
}: DataGridActionsProps<RecordType>) {
  const {
    selection,
    setSelection,
    filters,
    onResetAllFilters,
    inlineEdit,
    setEditingId,
  } = useContext<DataGridContextType<RecordType>>(DataGridContext);



  const filterKeys = filters ? Object.keys(filters) : [];
  const hasFilters =
    filters &&
    filterKeys.map((key) => filters[key]).filter((val) => !!val).length > 0;

  async function handleCreate() {
    if (onCreate) {
      let resp = await onCreate();
      if (inlineEdit && resp) {
        setEditingId(resp.id);
      }
    }
  }

  function handleResetFilters() {
    let clear: CustomMap = {};
    filters &&
      Object.keys(filters).forEach((key) => {
        clear[key] = null;
      });
    onResetAllFilters(clear);
  }

  async function handleDelete() {
    Modal.confirm({
      title: "Warning",
      content:
        "This action deletes all selected records. Are you sure you want to continue?",
      onCancel: () => {},
      onOk: async () => {
        if (onDeleteSelected) {
          await onDeleteSelected(selection.map((sel: any) => sel.id));
        }
        setSelection([]);
      },
      okText: "Yes",
      cancelText: "No",
    });
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

        {onResetAllFilters && filters && (
          <Button
            onClick={handleResetFilters}
            type="link"
            disabled={!hasFilters}
            className={styles.dataGridActionsButton}
          >
            Reset filters
          </Button>
        )}
      </div>
      <div>
        {onCreate && (
          <Button
            onClick={handleCreate}
            type="primary"
            className={styles.dataGridActionsButton}
          >
            <PlusOutlined /> Add new question
          </Button>
        )}
      </div>
    </div>
  );
}

export default React.memo(
  DataGridActionsComponent
) as typeof DataGridActionsComponent;
