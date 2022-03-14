import React, { useContext } from "react";
import { useRouteMatch } from "react-router-dom";
import { Button, Modal } from "antd";
import { PlusOutlined, CloudDownloadOutlined } from "@ant-design/icons";

import {
  DataGridContext,
  DataGridContextType,
} from "../../../../../../model/ui/types/DataGridContextType";
import { DataGridActionsProps } from "../../../../../../shared/components/datagrid/DataGridActions";
import styles from "../../../../../../shared/components/datagrid/DataGrid.module.scss";
import { api } from "../../../../../../core/api";

function CostSheetCustomActionsComponent<RecordType extends AnyRecord>({
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
  let { params } = useRouteMatch<SeminarParams>();
  const seminarId = +params.seminarId;

  // function handleSearch(value: string): void {
  //     onSearch(value);
  // }
  // function resetSearch(e: React.ChangeEvent<HTMLInputElement>): void {
  //     if(!e.currentTarget.value) onSearch(e.currentTarget.value);
  // }

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
          await onDeleteSelected(selection.map((sel) => sel.id));
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
        {/* <Search
                placeholder="Search..."
                onSearch={handleSearch}
                onChange={resetSearch}
                className={styles.searchBox}
                allowClear
                /> */}

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
            <PlusOutlined /> Add
          </Button>
        )}
        <Button
          title="Download"
          style={{ marginRight: 0 }}
          type="default"
          className={styles.dataGridActionsButton}
          href={api.seminarCost.download(seminarId)}
          icon={<CloudDownloadOutlined />}
        />
      </div>
    </div>
  );
}

export default CostSheetCustomActionsComponent;
