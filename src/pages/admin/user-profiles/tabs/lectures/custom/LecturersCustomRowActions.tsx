import React, {useContext, } from "react";
import {Button, Tooltip} from "antd";

import {
  DataGridRowContext,
  DataGridRowContextType,
} from "../../../../../../model/ui/types/DataGridRowContextType";
import DataGridRowActionsComponent from "../../../../../../shared/components/datagrid/DataGridRowActions";
import {Seminar} from "../../../../../../model/domain/classes/Seminar";
import { IssuesCloseOutlined, SnippetsOutlined} from "@ant-design/icons/lib";
import {ClassLecture} from "../../../../../../model/domain/classes/ClassLecture";

interface AttendeesCustomRowActionsProps<T> {
  onUpdate?(row: T): Promise<void>;

  onDelete?(id: number): void;

  diary?(row: T): void;

  grades?(row: T): void;

  seminar?: Seminar;
}

function LecturersCustomRowActions({
                                     onUpdate,
                                     onDelete,
                                     diary,
                                     grades
                                   }: AttendeesCustomRowActionsProps<ClassLecture>) {
  let {record} = useContext<DataGridRowContextType<ClassLecture>>(
    DataGridRowContext
  );

  return (
    <React.Fragment>
      <Tooltip title="Unos dnevnika">
        <Button
          onClick={() => diary && diary(record)}
          type="link"
          icon={<SnippetsOutlined/>}
        />
      </Tooltip>
      <Tooltip title="Unos ocjena">
        <Button
          onClick={() => grades && grades(record)}
          type="link"
          icon={<IssuesCloseOutlined/>}
        />
      </Tooltip>
      <DataGridRowActionsComponent onUpdate={onUpdate} onDelete={onDelete}/>
    </React.Fragment>
  );
}

export default LecturersCustomRowActions;
