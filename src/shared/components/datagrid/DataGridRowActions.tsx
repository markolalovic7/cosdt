import React, {useContext} from "react";
import {Button, Popconfirm, Tooltip} from "antd";

import {
  SaveOutlined,
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {Logger} from "../../../core/logger";
import {
  DataGridContext,
  DataGridContextType,
} from "../../../model/ui/types/DataGridContextType";
import {
  DataGridRowContext,
  DataGridRowContextType,
} from "../../../model/ui/types/DataGridRowContextType";
import {DownloadOutlined} from "@ant-design/icons/lib";

export interface DataGridRowActionsProps<T> {
  onUpdate?(row: T): Promise<void>;

  onDelete?(id: number): void;

  report?(id: number): Promise<void>;
}

function DataGridRowActionsComponent<RecordType extends AnyRecord>({
                                                                     onUpdate,
                                                                     onDelete,
                                                                     report

                                                                   }: DataGridRowActionsProps<RecordType>) {
  const {
    form,
    editingId,
    setEditingId,
    isDirty,
    setIsDirty,
    editable,
    inlineEdit,
  } = useContext<DataGridContextType<RecordType>>(DataGridContext);
  const {record} = useContext<DataGridRowContextType<RecordType>>(
    DataGridRowContext
  );
  const showEditButton = onUpdate && (editable || !inlineEdit);

  const handleUpdate = async (id: string) => {
    try {
      let row = {...((await form.validateFields()) as RecordType), id: id};
      onUpdate && (await onUpdate(row));
      setEditingId(undefined);
      setIsDirty(false);
    } catch (errInfo) {
      Logger.error("Validate Failed:", errInfo);
    }
  };

  const handleEdit = (record: RecordType) => {
    if (inlineEdit) {
      form.setFieldsValue({...record});
      setEditingId(record.id);
    } else {
      onUpdate && onUpdate(record);
    }
  };

  const handleDelete = (id: number) => {
    onDelete && onDelete(id);
  };
  const getReport = (id: number) => {
    report && report(id);
  };

  const handleCancelEdit = async () => {
    try {
      await form.validateFields();
      setEditingId();
      setIsDirty(false);
    } catch (errInfo) {
      Logger.error("Validate Failed:", errInfo);
    }
  };

  return editingId === record.id ? (
    <React.Fragment>
      <Button
        icon={<SaveOutlined/>}
        type="link"
        onClick={() => handleUpdate(record.id)}
        style={{marginRight: 4}}
      />
      {isDirty ? (
        <Popconfirm title="Sure to cancel?" onConfirm={handleCancelEdit}>
          <Button
            icon={<StopOutlined/>}
            type="link"
            style={{marginRight: 4}}
          />
        </Popconfirm>
      ) : (
        <Button
          icon={<StopOutlined/>}
          onClick={handleCancelEdit}
          type="link"
          style={{marginRight: 4}}
        />
      )}
    </React.Fragment>
  ) : (
    <React.Fragment>
      {showEditButton && (
        <Button
          icon={<EditOutlined/>}
          type="link"
          disabled={!!editingId}
          onClick={() => handleEdit(record)}
          style={{marginRight: 4}}
        />
      )}
      {onDelete && (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button
            icon={<DeleteOutlined/>}
            type="link"
            danger
            style={{marginRight: 4}}
          />
        </Popconfirm>
      )}
      {report && (
        <Tooltip title={"Download report"}>
        <Button
          icon={<DownloadOutlined/>}
          type="link"
          disabled={!!editingId}
          onClick={() => getReport(record.id)}
          style={{marginRight: 4}}
        />
        </Tooltip>
      )}
    </React.Fragment>
  );
}

export default React.memo(
  DataGridRowActionsComponent
) as typeof DataGridRowActionsComponent;
