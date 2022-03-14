import React, {useEffect, useState} from "react";
import {useRouteMatch} from "react-router-dom";
import {saveAs} from "file-saver";
import {TablePaginationConfig} from "antd/lib/table";
import {SorterResult} from "antd/lib/table/interface";

import styles from "./Attendees.module.scss";
import {api} from "../../../../../core/api";
import {Logger} from "../../../../../core/logger";
import {defaultPaginationSort, updateDataGridParams,} from "../../../../../core/Utils";

import {UserProfile} from "../../../../../model/domain/classes/UserProfile";
import {Seminar} from "../../../../../model/domain/classes/Seminar";
import {SeminarAttendee} from "../../../../../model/domain/classes/SeminarAttendee";
import {SeminarAttendeeStatusEnum} from "../../../../../model/domain/enums/SeminarAttendeeStatusEnum";
import {SeminarEvaluationStatusEnum} from "../../../../../model/domain/enums/SeminarEvaluationStatusEnum";
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
import AttendeesCustomRowActionsComponent from "./custom/AttendeesCustomRowActions";
import AttendeesStatusCustomCell from "./custom/AttendeesStatusCustomCell";
import AttendeesCustomActionsComponent from "./custom/AttendeesCustomActions";

interface AttendeesTabProps {
  seminar: Seminar;
}

function AttendeesTab({seminar}: AttendeesTabProps) {
  const [records, setRecords] = useState<Array<SeminarAttendee>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<SeminarAttendee>>(
    defaultPaginationSort(undefined, ["profile", "id"], "ascend")
  );
  let {isExact} = useRouteMatch<SeminarParams>();
  const sorter = params.sorter as SorterResult<SeminarAttendee> | null;
  useEffect(() => {
  }, [params]);
  const columns: Array<DataGridColumnType<SeminarAttendee>> = [
    {
      title: "First name",
      dataIndex: ["profile", "firstName"],
      defaultSort: true,
      filterEnabled: true,
      fixed: "left",
      sorter: true,
      width: 200,
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
      fixed: "left",
      sorter: true,
      width: 150,
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
      fixed: "left",
      width: 150,
      cellType: DataGridCellTypeEnum.OPTION,
      component: AttendeesStatusCustomCell,
      // link: {
      //   url: (rec) => {
      //     const surveyId = seminar?.survey?.id;
      //     return surveyId ? `${url}/survey/${surveyId}` : "";
      //   },
      // },
      editable: true,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: [
          {
            id: SeminarAttendeeStatusEnum.INVITED,
            name: "Invited",
          },
          {
            id: SeminarAttendeeStatusEnum.NOT_INVITED,
            name: "Not invited",
          },
          {
            id: SeminarAttendeeStatusEnum.ATTENDED,
            name: "Attended",
          },
          {
            id: SeminarAttendeeStatusEnum.CERTIFIED,
            name: "Certified",
          },
          {
            id: SeminarAttendeeStatusEnum.REGISTERED,
            name: "Registered",
          },
        ],
      },
    },
    {
      title: "Profile",
      dataIndex: ["profile", "username"],
      defaultSort: true,
      filterEnabled: true,
      sorter: true,
      width: 150,
    },
    {
      title: "Institution",
      dataIndex: ["profile", "institution", "name"],
      defaultSort: true,
      filterEnabled: true,
      sorter: true,
      width: 150,
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
      title: "Evaluation status",
      dataIndex: "evaluationStatus",
      defaultSort: true,
      width: 250,
      filterEnabled: true,
      component: AttendeesStatusCustomCell,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: [
          {
            id: SeminarEvaluationStatusEnum.FAILED,
            name: "Failed",
          },
          {
            id: SeminarEvaluationStatusEnum.INPROGRESS,
            name: "In progress",
          },
          {
            id: SeminarEvaluationStatusEnum.PASSED,
            name: "Passed",
          },
          {
            id: SeminarEvaluationStatusEnum.PENDING,
            name: "Pending",
          },
        ],
      },
    },
    {
      title: "Created",
      dataIndex: "createdDate",
      defaultSort: true,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.DATE,
      width: 150,
    },
  ];

  useEffect(() => {
    isExact && loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExact]);
  useEffect(() => {
  }, [
    records
  ]);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      if (seminar?.id) {
        const apiParams: ApiParams = {
          "seminarId.equals": seminar?.id,
        };
        let record = await api.seminarAttendee.getAll(apiParams);
        setRecords(record);
      }
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
        let record = new SeminarAttendee();
        record.seminar = {id: seminar.id};
        record.profile = profile;
        return record;
      });
      let response = await api.seminarAttendee.createMultiple(attendees);
      setRecords([...records, ...response]);
      SuccessNotification("Attendee(s) created.");
    } catch (e) {
      FailNotification("Saving data error sample class.");
      Logger.error(e);
      throw e;
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleUpdate(record: SeminarAttendee): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === record.id);
      const updatedRecord: SeminarAttendee = {
        ...data[recordIndex],
        ...record,
      };
      data[recordIndex] = await api.seminarAttendee.update(updatedRecord);
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
      await api.seminarAttendee.delete(id);
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
        await api.seminarAttendee.delete(id);
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
    invitationHtml: string,
    attendees: Array<SeminarAttendee>
  ) {
    try {
      setLoading(FetchStateEnum.LOADING);
      const profileIds = attendees.map((attendee) => attendee.profile.id);
      await api.seminarAttendee.invite(invitationHtml, seminar.id, profileIds);
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

  async function handleSendCertificates(
    invitationHtml: string,
    attendees: Array<SeminarAttendee>
  ) {
    try {
      setLoading(FetchStateEnum.LOADING);
      const profileIds = attendees.map((attendee) => attendee.profile.id);
      await api.seminarAttendee.sendCertificate(
        invitationHtml,
        seminar.id,
        profileIds
      );
      SuccessNotification("Certificates sent.");
      await loadData();
    } catch (e) {
      FailNotification("Unable to send certificates.");
      Logger.error(e);
      throw e;
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleDownloadCertificates(
    attendees: Array<SeminarAttendee>
  ) {
    try {
      setLoading(FetchStateEnum.LOADING);
      const profileIds = attendees.map((attendee) => attendee.profile.id);
      const data = await api.seminarAttendee.downloadCertificate(
        seminar.id,
        profileIds
      );
      let blob = new Blob([data], {type: "application/zip"});
      saveAs(blob, "cert.zip");
      SuccessNotification("Download started.");
      await loadData();
    } catch (e) {
      FailNotification("Unable to download certificates.");
      Logger.error(e);
      throw e;
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleDownloadCertificatesZip(
    attendees: Array<SeminarAttendee>
  ) {
    try {
      setLoading(FetchStateEnum.LOADING);
      const profileIds = attendees.map((attendee) => attendee.profile.id);
      const data = await api.seminarAttendee.downloadCertificates(
        seminar.id,
        profileIds
      );
      let blob = new Blob([data], {type: "application/zip"});
      saveAs(blob, "certificates.zip");
      SuccessNotification("Download started.");
      await loadData();
    } catch (e) {
      FailNotification("Unable to download certificates.");
      Logger.error(e);
      throw e;
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleDownloadInvitations(attendees: Array<SeminarAttendee>) {
    try {
      setLoading(FetchStateEnum.LOADING);
      const profileIds = attendees.map((attendee) => attendee.profile.id);
      const data = await api.seminarAttendee.downloadInvitations(
        seminar.id,
        profileIds
      );
      let blob = new Blob([data], {type: "application/zip"});
      saveAs(blob, "invitations.zip");
      SuccessNotification("Download started.");
      await loadData();
    } catch (e) {
      FailNotification("Unable to download invitations.");
      Logger.error(e);
      throw e;
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleSendSurveyLink(attendees: Array<SeminarAttendee>) {
    try {
      setLoading(FetchStateEnum.LOADING);
      const profileIds = attendees.map((attendee) => attendee.profile.id);
      await api.seminarAttendee.sendSurveyLink(seminar.id, profileIds);
      SuccessNotification("Survey links sent.");
      await loadData();
    } catch (e) {
      FailNotification("Unable to send survey links.");
      Logger.error(e);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  function handleChange(
    pagination: TablePaginationConfig,
    filters: DataGridFiltersType,
    sorter: SorterResult<SeminarAttendee> | SorterResult<SeminarAttendee>[]
  ) {
    setParams(
      updateDataGridParams<SeminarAttendee>(
        pagination,
        filters,
        sorter,
        columns
      )
    );
  }

  const customSelection = [
    {
      key: "notinvited",
      text: "Not invited",
      onSelect: () =>
        records.filter(
          (rec) => rec.status === SeminarAttendeeStatusEnum.NOT_INVITED
        ),
    },
    {
      key: "attended",
      text: "Attended",
      onSelect: () =>
        records.filter(
          (rec) => rec.status === SeminarAttendeeStatusEnum.ATTENDED
        ),
    },
  ];

  const onGroupChange = async (attendees: Array<SeminarAttendee>, status: SeminarAttendeeStatusEnum) => {
    setLoading(FetchStateEnum.LOADING);
      try {
        await api.seminarAttendee.changeStatus(attendees.map(a => a.id), status);
        SuccessNotification(`Attendees  status changed.`);
      } catch {
        FailNotification(`Attendees  status change failed.`)
      } finally {
        loadData();
      }
    };


  return (
    <React.Fragment>
      <h1>Attendees</h1>
      <DataGridComponent<SeminarAttendee>
        className={styles.AttendeesTable}
        bordered
        columns={columns}
        rowKey={(rec) => rec.id}
        dataSource={records}
        selectable={customSelection}
        loading={loading === FetchStateEnum.LOADING}
        onChange={handleChange}
        filters={params.filters}
        sort={sorter}
        pagination={false}
        tableLayout={"fixed"}
        scroll={{x: 1500}}
        inlineEdit={true}
        Actions={
          <AttendeesCustomActionsComponent
            attendees={records}
            onCreate={handleCreate}
            onDeleteSelected={handleDeleteSelected}
            onSendSurveyLink={handleSendSurveyLink}
            onSendCertificates={handleSendCertificates}
            onSendInvitations={handleSendInvitations}
            onDownloadInvitations={handleDownloadInvitations}
            onDownloadCertificatesZip={handleDownloadCertificatesZip}
            onGroupChange={onGroupChange}
            seminar={seminar}
          />
        }
        RowActions={
          <AttendeesCustomRowActionsComponent
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onSendInvitation={handleSendInvitations}
            onSendCertificates={handleSendCertificates}
            onDownloadCertificates={handleDownloadCertificates}
            seminar={seminar}
          />
        }
      />
    </React.Fragment>
  );
}

export default AttendeesTab;
