import React, {useContext} from "react";
import {Button, Tooltip} from "antd";

import {
  DataGridRowContext,
  DataGridRowContextType,
} from "../../../../../../model/ui/types/DataGridRowContextType";
import DataGridRowActionsComponent, {DataGridRowActionsProps} from "../../../../../../shared/components/datagrid/DataGridRowActions";
import {DownloadOutlined} from "@ant-design/icons/lib";
import {ExamAttendee} from "../../../../../../model/domain/classes/ExamAttendee";

interface ExamRowActionsProps {

  report?(id: number): void
}

function ExamRowActions({
                          onUpdate,
                          onDelete,
                          report,
                        }: DataGridRowActionsProps<ExamAttendee> & ExamRowActionsProps) {

  let {record} = useContext<DataGridRowContextType<ExamAttendee>>(
    DataGridRowContext
  );

  return (
    <React.Fragment>
      {report && record.noOfTries> 0 &&(
        <Tooltip title={"Download report"}>
          <Button
            icon={<DownloadOutlined/>}
            type="link"
            onClick={() => report(record.profile.id)}
            style={{marginRight: 4}}
          />
        </Tooltip>
      )}
      <DataGridRowActionsComponent onUpdate={onUpdate} onDelete={onDelete}/>
    </React.Fragment>
  );
}

export default ExamRowActions;
