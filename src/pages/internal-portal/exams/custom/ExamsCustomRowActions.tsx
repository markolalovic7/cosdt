import React, { useContext } from "react";
import {Button, Switch} from "antd";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";

import DataGridRowActionsComponent, {
  DataGridRowActionsProps,
} from "../../../../shared/components/datagrid/DataGridRowActions";
import {
  DataGridRowContext,
  DataGridRowContextType,
} from "../../../../model/ui/types/DataGridRowContextType";
import {
  DataGridContext,
  DataGridContextType,
} from "../../../../model/ui/types/DataGridContextType";
import { Exam } from "../../../../model/domain/classes/Exam";
import {DownloadOutlined} from "@ant-design/icons/lib";

interface ExamsCustomRowActionsProps {
  onPublish?(exam: Exam, publish: boolean): Promise<void>;
  getReport?(examId: number, name: string) : Promise<void>
}

function ExamsCustomRowActionsComponent({
  onUpdate,
  onDelete,
  onPublish,
  getReport,
}: DataGridRowActionsProps<Exam> & ExamsCustomRowActionsProps) {
  const { record } = useContext<DataGridRowContextType<Exam>>(
    DataGridRowContext
  );
  const { editingId } = useContext<DataGridContextType<Exam>>(
    DataGridContext
  );

  return (
    <React.Fragment>
      {editingId !== record.id && !!onPublish && (
        <React.Fragment>
          <Switch
            onChange={(checked) => {!!onPublish && onPublish(record, checked)}}
            title={"Publish"}
            checked={record.active}
            // disabled={record.active}
            checkedChildren={<LockOutlined />}
            unCheckedChildren={<UnlockOutlined />}
          />
        </React.Fragment>
      )}
      <DataGridRowActionsComponent onUpdate={onUpdate} onDelete={onDelete} />
      { getReport &&
        <Button type={"link"} icon={<DownloadOutlined/>} onClick={
          //@ts-ignore
          () => getReport(record.id, "report")}
        >report</Button>
      }
    </React.Fragment>
  );
}

export default ExamsCustomRowActionsComponent;
