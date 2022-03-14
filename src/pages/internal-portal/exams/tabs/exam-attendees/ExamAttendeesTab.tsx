import React, {useEffect, useState} from "react";
import {useRouteMatch} from "react-router-dom";
import {TablePaginationConfig} from "antd/lib/table";
import {SorterResult} from "antd/lib/table/interface";

import {api} from "../../../../../core/api";
import {Logger} from "../../../../../core/logger";
import {defaultPaginationSort, updateDataGridParams,} from "../../../../../core/Utils";

import {UserProfile} from "../../../../../model/domain/classes/UserProfile";
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
import {ExamAttendee} from "../../../../../model/domain/classes/ExamAttendee";
import {ExamAttendeeEnum} from "../../../../../model/domain/enums/ExamAttendeeEnum";
import ExamAttendeesCustomActionsComponent from "./custom/ExamAttendeesCustomActions";
import {saveAs} from "file-saver";
import ExamRowActions from "./custom/ExamCustomRowActions";

function ExamAttendeesTab() {
  const [records, setRecords] = useState<Array<ExamAttendee>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<ExamAttendee>>(
    defaultPaginationSort(undefined, ["profile", "id"], "ascend")
  );
  let { isExact, params: routeParams } = useRouteMatch<ExamParams>();
  const sorter = params.sorter as SorterResult<ExamAttendee> | null;
  let examId = +routeParams.examId;

  const columns: Array<DataGridColumnType<ExamAttendee>> = [
    {
      title: "First name",
      dataIndex: ["profile", "firstName"],
      defaultSort: true,
      filterEnabled: true,
      sorter: true,
      link: {
        url: (rec) =>
          `/admin-panel/user-profiles/${rec.profile.id}/${rec.profile.username}/general`,
      },
    },
    {
      title: "Last name",
      dataIndex: ["profile", "lastName"],
      defaultSort: true,
      filterEnabled: true,
      sorter: true,
      link: {
        url: (rec) =>
          `/admin-panel/user-profiles/${rec.profile.id}/${rec.profile.username}/general`,
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      filterEnabled: true,
      sorter: true,
      cellType: DataGridCellTypeEnum.OPTION,
      editable: true,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: [
          {
            id: ExamAttendeeEnum.ACCEPTED_INVITATION,
            name: "Accepted invitation",
          },
          {
            id: ExamAttendeeEnum.INVITATION_SENT,
            name: "Invitation sent",
          },
          {
            id: ExamAttendeeEnum.EXAM_FAILED,
            name: "Exam failed",
          },
          {
            id: ExamAttendeeEnum.EXAM_PASSED,
            name: "Exam passed",
          },
          {
            id: ExamAttendeeEnum.EXAM_PAUSED,
            name: "Exam paused",
          },
          {
            id: ExamAttendeeEnum.EXAM_STARTED,
            name: "Exam started",
          },
        ],
      },
    },
    {
      title: "No. of tries",
      dataIndex: "noOfTries",
      defaultSort: true,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.NUMBER,
    },
    {
      title: "Created",
      dataIndex: "createdDate",
      defaultSort: true,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.DATE,
    },
  ];

  useEffect(() => {
    isExact && loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExact]);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      const apiParams: ApiParams = {
        "examId.equals": examId
      };
      setRecords(await api.examAttendee.getAll(apiParams));
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleCreate(profiles: Array<UserProfile>): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let attendees = profiles.map((profile) => {
        let record = new ExamAttendee();
        record.examId = examId;
        record.profile = profile;
        return record;
      });
      let response = await api.examAttendee.createMultiple(attendees);
      setRecords([...records, ...response]);
      SuccessNotification("Attendee(s) created.");
    } catch (e) {
      FailNotification("Saving data error exam attendee.");
      Logger.error(e);
      throw e;
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleUpdate(record: ExamAttendee): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === record.id);
      const updatedRecord: ExamAttendee = {
        ...data[recordIndex],
        ...record,
      };
      data[recordIndex] = await api.examAttendee.update(updatedRecord);
      setRecords(data);
      SuccessNotification("Attendee changed.");
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
      await api.examAttendee.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Attendee deleted.");
    } catch (error) {
      FailNotification("Deleting error.");
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
        await api.examAttendee.delete(id);
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

  async function handleSendInvitations(
    attendees: Array<ExamAttendee>
  ) {
    try {
      setLoading(FetchStateEnum.LOADING);
       const profileIds = attendees.map((attendee) => attendee.profile.id);
       await api.examTest.invite(examId, profileIds);
      SuccessNotification("Invitations sent.");
      await loadData();
    } catch (e) {
      FailNotification("Unable to send invitations.");
      Logger.error(e);
      throw e;
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  function handleChange(
    pagination: TablePaginationConfig,
    filters: DataGridFiltersType,
    sorter: SorterResult<ExamAttendee> | SorterResult<ExamAttendee>[]
  ) {
    setParams(
      updateDataGridParams<ExamAttendee>(
        pagination,
        filters,
        sorter,
        columns
      )
    );
  }

  async function handleExportReport(id:number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      const data = await api.examTest.getExamReportByUser(examId, id);
      let blob = new Blob([data], {type: "application/zip"});
      saveAs(blob, "rezultati polaganja.docx");
      SuccessNotification("Download started.");
    } catch (e) {
      FailNotification("Unable to download report.");
      Logger.error(e);
      throw e;
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }
  return (
    <React.Fragment>
      <h1>Attendees</h1>
      <DataGridComponent<ExamAttendee>
        bordered
        columns={columns}
        rowKey={(rec) => rec.id}
        dataSource={records}
        loading={loading === FetchStateEnum.LOADING}
        onChange={handleChange}
        filters={params.filters}
        pagination={params.pagination}
        sort={sorter}
        inlineEdit={true}
        selectable={true}
        Actions={
          <ExamAttendeesCustomActionsComponent
            attendees={records}
            onCreate={handleCreate}
            onDeleteSelected={handleDeleteSelected}
            onSendInvitations={handleSendInvitations}
          />
        }
        RowActions={
          <ExamRowActions
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            report={handleExportReport}
          />
        }
      />
    </React.Fragment>
  );
}

export default ExamAttendeesTab;
