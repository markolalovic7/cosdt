import React, { useEffect, useState } from "react";

import { api } from "../../../../../../core/api";
import { Logger } from "../../../../../../core/logger";
import { ClassAttendee } from "../../../../../../model/domain/classes/ClassAttendee";
import { FetchStateEnum } from "../../../../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType
} from "../../../../../../model/ui/types/DataGridTypes";
import { ApiParams } from "../../../../../../model/ui/types/ApiParams";
import DataGridComponent from "../../../../../../shared/components/datagrid/DataGrid";
import {
  FailNotification,
} from "../../../../../../shared/components/notifications/Notification";
import ClassAttendeePickerCustomActionsComponent from "./ClassAttendeePickerCustomActions";

interface ClassAttendeePickerProps {
  classId: string;
  onChange?(attendees: Array<ClassAttendee>): void;
  value?: Array<ClassAttendee>;
  locked: boolean
}

function ClassAttendeePicker({
  classId,
  onChange,
  value = [],
  locked
}: ClassAttendeePickerProps) {
  const [records, setRecords] = useState<Array<ClassAttendee>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);

  const columns: Array<DataGridColumnType<ClassAttendee>> = [
    {
      title: "Description",
      dataIndex: ["profile", "firstName"],
      defaultSort: true,
      resizable: true,
      width: 150,
      filterEnabled: true,
    },
    {
      title: "Description",
      dataIndex: ["profile", "lastName"],
      defaultSort: true,
      resizable: true,
      width: 150,
      filterEnabled: true,
    },
    {
      title: "Function",
      dataIndex: ["profile", "function", "name"],
      resizable: true,
      width: 120,
    },
    {
      title: "Institution",
      dataIndex: ["profile", "institution", "name"],
      resizable: true,
      width: 120,
    },
  ];

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      const apiParams: ApiParams = {
        "klassId.equals": classId
      };
      let records = await api.classAttendee.getAll(apiParams);
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  const handleSelectionChange = (attendees: Array<ClassAttendee>) => {
    onChange && onChange(attendees);
  };

  return (
    <React.Fragment>
      <DataGridComponent<ClassAttendee>
        bordered
        columns={columns}
        rowKey={(rec) => rec.id}
        dataSource={records}
        loading={loading === FetchStateEnum.LOADING}
        filters={null}
        sort={null}
        pagination={false}
        selectable={locked}
        Actions={
          <ClassAttendeePickerCustomActionsComponent
            attendees={value}
            onSelectionChange={handleSelectionChange}
          />
        }
      />
    </React.Fragment>
  );
}

export default ClassAttendeePicker;
