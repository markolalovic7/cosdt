import React, { useContext } from "react";
import { Button, Tooltip } from "antd";
import { FileOutlined } from "@ant-design/icons";

import { ClassLecture } from "../../../../../../model/domain/classes/ClassLecture";
import {
  DataGridRowContext,
  DataGridRowContextType,
} from "../../../../../../model/ui/types/DataGridRowContextType";
import DataGridRowActionsComponent, { DataGridRowActionsProps } from "../../../../../../shared/components/datagrid/DataGridRowActions";
import {DownloadOutlined} from "@ant-design/icons/lib";

interface ScheduleCustomRowActions {
  onEditMaterial(record: ClassLecture): void;
  report?(id:number):void
}

function ScheduleCustomRowActionsComponent({
  onUpdate,
  onDelete,
  report,
  onEditMaterial,
}: DataGridRowActionsProps<ClassLecture> & ScheduleCustomRowActions) {

  let { record } = useContext<DataGridRowContextType<ClassLecture>>(
    DataGridRowContext
  );

  return (
    <React.Fragment>
      <Tooltip title="Edit materials" overlay={false}>
        <Button
          onClick={() => onEditMaterial && onEditMaterial(record)}
          type="link"
          icon={<FileOutlined />}
        />
      </Tooltip>
      {report && (
        <Tooltip title={"Download report"}>
          <Button
            icon={<DownloadOutlined/>}
            type="link"
            onClick={() => report(record.id)}
            style={{marginRight: 4}}
          />
        </Tooltip>
      )}
      <DataGridRowActionsComponent onUpdate={onUpdate} onDelete={onDelete}/>
    </React.Fragment>
  );
}

export default ScheduleCustomRowActionsComponent;
