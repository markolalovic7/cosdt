import React, {useEffect, useState} from "react";
import {TablePaginationConfig} from "antd/lib/table";
import {SorterResult} from "antd/lib/table/interface";

import styles from './Students.module.scss';

import {api} from "../../../../../core/api";
import {Logger} from "../../../../../core/logger";
import {defaultPaginationSort, updateDataGridParams,} from "../../../../../core/Utils";

import {Class} from "../../../../../model/domain/classes/Class";
import {ClassAttendee} from "../../../../../model/domain/classes/ClassAttendee";
import {UserProfile} from "../../../../../model/domain/classes/UserProfile";
import {ClassAttendeeStatusEnum} from "../../../../../model/domain/enums/ClassAttendeeStatusEnum";
import {DataGridCellTypeEnum} from "../../../../../model/ui/enums/DataGridCellTypeEnum";
import {FetchStateEnum} from "../../../../../model/ui/enums/FetchStateEnum";
import {ApiParams} from "../../../../../model/ui/types/ApiParams";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
} from "../../../../../model/ui/types/DataGridTypes";
import DataGridComponent from "../../../../../shared/components/datagrid/DataGrid";
import {FailNotification, SuccessNotification,} from "../../../../../shared/components/notifications/Notification";
import StudentsCustomActionsComponent from "./custom/StudentsCustomActions";
import StudentMentorsCustomCell from "./custom/StudentMentorsCustomCell";
import DataGridRowActions from "../../../../../shared/components/datagrid/DataGridRowActions";

interface StudentsTabProps {
  classRec: Class;
  editable: boolean
}

function StudentsTab({classRec, editable}: StudentsTabProps) {
  const [records, setRecords] = useState<Array<ClassAttendee>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<ClassAttendee>>(
    defaultPaginationSort(undefined, ["profile", "id"], "ascend")
  );
  const sorter = params.sorter as SorterResult<ClassAttendee> | null;
  const columns: Array<DataGridColumnType<ClassAttendee>> = [
    {
      title: "First name",
      dataIndex: ["profile", "firstName"],
      defaultSort: true,
      filterEnabled: true,
      fixed: "left",
      sorter: true,
      width: 150,
      link: {
        url: (rec) =>
          `/admin-panel/user-profiles/${rec.profile.id}/${rec.profile.username}/lectures`,
        target: "push"
      },
    },
    {
      title: "Last name",
      dataIndex: ["profile", "lastName"],
      defaultSort: true,
      filterEnabled: true,
      fixed: "left",
      sorter: true,
      width: 150,
      link: {
        url: (rec) =>
          `/admin-panel/user-profiles/${rec.profile.id}/${rec.profile.username}`,
        target: "push"
      },
    },

    {
      title: "Profile",
      dataIndex: ["profile", "username"],
      defaultSort: true,
      filterEnabled: true,
      sorter: true,
      width: 350,
    },
    {
      title: "Institution",
      dataIndex: ["profile", "institution", "name"],
      defaultSort: true,
      filterEnabled: true,
      sorter: true,
      width: 300,
    },
    {
      title: "Function",
      dataIndex: ["profile", "function", "name"],
      defaultSort: true,
      filterEnabled: true,
      sorter: true,
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      defaultSort: true,
      filterEnabled: true,
      sorter: true,
      width: 200,
      cellType: DataGridCellTypeEnum.OPTION,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: [{id: ClassAttendeeStatusEnum.INITIAL_CANDIDATE, name: "Initial candidate"}],
      },
    },
    {
      title: "Mentors",
      width: 300,
      editable: false,
      cellType: DataGridCellTypeEnum.MULTIOPTION,
      render: (rec) => <StudentMentorsCustomCell record={rec} editable={editable} dataIndex={"mentors"}
                                                 handleClose={() => {
                                                   // noinspection JSIgnoredPromiseFromCall
                                                   loadData()
                                                 }}/>,
    },
    {
      title: "Broj i datum odluke o izboru",
      dataIndex: "brojIdatumOdlukeOizboru",
      defaultSort: true,
      filterEnabled: true,
      sorter: true,
      width: 400,
      editable: true,
      resizable: true
    },
    {
      title: "Broj i datum odluke savjeta",
      dataIndex: "brojIdatumOdlukeSavjeta",
      defaultSort: true,
      filterEnabled: true,
      sorter: true,
      width: 400,
      editable: true
    },
  ];

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      const apiParams: ApiParams = {
        "klassId.equals": classRec.id
      };
      setRecords(await api.classAttendee.getAll(apiParams));
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleCreate(profiles: Array<UserProfile>): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let attendees = profiles.map((profile) => {
        let record = new ClassAttendee();
        record.klass = classRec;
        record.profile = profile;
        return record;
      });
      let response = await api.classAttendee.createMultiple(attendees);
      setRecords([...records, ...response]);
      SuccessNotification("Student(s) created.");
    } catch (e) {
      FailNotification(e);
      Logger.error(e);
      throw e;
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleUpdate(record: any): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === record.id);
      const updatedRecord: ClassAttendee = {
        ...data[recordIndex],
        ...record,
      };
      data[recordIndex] = await api.classAttendee.update(updatedRecord);
      setRecords(data);
      SuccessNotification("Student changed.");
    } catch (error) {
      FailNotification("Saving data error.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.classAttendee.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Student deleted.");
    } catch (error) {
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      if (records[recordIndex].mentors.length > 0) {
        FailNotification("Deleting error. Possible reason: Mentor assigned!");
      } else {
        FailNotification("Deleting error.");
      }
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleDeleteSelected(ids: Array<number>) {
    setLoading(FetchStateEnum.LOADING);
    let data = [...records];
    for (const id of ids) {
      const recordIndex = data.findIndex((rec) => rec.id === id);
      try {
        await api.classAttendee.delete(id);
        data.splice(recordIndex, 1);
      } catch (error) {
        FailNotification(
          `Deleting error ${data[recordIndex]?.profile?.username}.`
        );
        Logger.error(error);
      }
    }
    setRecords(data);
    setLoading(FetchStateEnum.LOADED);
  }

  function handleChange(
    pagination: TablePaginationConfig,
    filters: DataGridFiltersType,
    sorter: SorterResult<ClassAttendee> | SorterResult<ClassAttendee>[]
  ) {
    setParams(
      updateDataGridParams<ClassAttendee>(pagination, filters, sorter, columns)
    );
  }


  return (
    <React.Fragment>
      <DataGridComponent<ClassAttendee>
        className={styles.AttendeesTable}
        bordered
        columns={columns}
        rowKey={(rec) => rec.id}
        dataSource={records}
        loading={loading === FetchStateEnum.LOADING}
        onChange={handleChange}
        selectable={true}
        filters={params.filters}
        sort={sorter}
        pagination={false}
        scroll={{x: 3000}}
        inlineEdit={editable}
        Actions={
          <StudentsCustomActionsComponent
            students={records}
            onCreate={handleCreate}
            onDeleteSelected={handleDeleteSelected}
            classRec={classRec}
          />
        }
        RowActions={
          <DataGridRowActions
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        }
      />
    </React.Fragment>
  );
}

export default StudentsTab;
