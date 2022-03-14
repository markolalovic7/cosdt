import React, {useEffect, useState} from "react";
import {useRouteMatch} from "react-router-dom";
import {saveAs} from "file-saver";
import {SorterResult, TablePaginationConfig} from "antd/lib/table/interface";

import styles from "../attendees/Attendees.module.scss";
import {api} from "../../../../../core/api";
import {Logger} from "../../../../../core/logger";
import {defaultPaginationSort, updateDataGridParams,} from "../../../../../core/Utils";

import {Seminar} from "../../../../../model/domain/classes/Seminar";
import {FetchStateEnum} from "../../../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
} from "../../../../../model/ui/types/DataGridTypes";
import DataGridComponent from "../../../../../shared/components/datagrid/DataGrid";
import {FailNotification, SuccessNotification,} from "../../../../../shared/components/notifications/Notification";
import {SeminarLecturer} from "../../../../../model/domain/classes/SeminarLecturer";
import LecturersCustomActionsComponent from "./custom/LecturersCustomActions";
import {DataGridCellTypeEnum} from "../../../../../model/ui/enums/DataGridCellTypeEnum";
import {UserProfile} from "../../../../../model/domain/classes/UserProfile";

interface AttendeesTabProps {
  seminar: Seminar;
}

function LecturersTab({ seminar }: AttendeesTabProps) {
  const [records, setRecords] = useState<Array<SeminarLecturer>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<SeminarLecturer>>(
    defaultPaginationSort(undefined, ["profile", "id"], "ascend")
  );
  let { isExact } = useRouteMatch<SeminarParams>();
  const sorter = params.sorter as SorterResult<SeminarLecturer> | null;

  const columns: Array<DataGridColumnType<SeminarLecturer>> = [
    {
      title: "First name",
      dataIndex: "firstName",
      defaultSort: true,
      filterEnabled: true,
      fixed: "left",
      sorter: true,
      link: {
        url: (rec) =>
          `/admin-panel/user-profiles/${rec.id}/${rec.username}/general`,
      },
    },
    {
      title: "Last name",
      dataIndex:  "lastName",
      defaultSort: true,
      filterEnabled: true,
      fixed: "left",
      sorter: true,
      link: {
        url: (rec) =>
          `/admin-panel/user-profiles/${rec.id}/${rec.username}/general`,
      },
    },
    {
      title: "Profile",
      dataIndex:  "username",
      defaultSort: true,
      filterEnabled: true,
      sorter: true,
    },
    {
      title: "Email",
      dataIndex:  "email",
      defaultSort: true,
      filterEnabled: true,
      sorter: true,
    },
    {
      title: "Gender",
      dataIndex:  "gender",
      defaultSort: true,
      filterEnabled: true,
      sorter: true,
      cellType: DataGridCellTypeEnum.OPTION,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: [
          {
            id: "MALE",
            name: "Male",
          },
          {
            id: "FEMALE",
            name: "Female",
          }]
      },
    },
  ];

  useEffect(() => {
    isExact && loadData();
    console.log(records)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExact]);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      if (seminar?.id) {
        setRecords(await api.seminarAgenda.getLecturers(seminar?.id.toString()));
        console.log(await api.seminarAgenda.getLecturers(seminar?.id.toString()))
      }
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleDownloadCertificates(
    lecturers: Array<SeminarLecturer|UserProfile>
  ) {
    try {
      setLoading(FetchStateEnum.LOADING);
      const profileIds = lecturers.map((lecturer:SeminarLecturer|UserProfile) => lecturer.id);
      let array=[];
      array.push(profileIds.map(item=>parseInt(item.toString())));
      const data = await  api.seminarAttendee.downloadCertificateForLecturers(
        profileIds,
          [seminar.id],

      );
      let blob = new Blob([data], { type: "application/zip" });
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
  function handleChange(
    pagination: TablePaginationConfig,
    filters: DataGridFiltersType,
    sorter: SorterResult<SeminarLecturer> | SorterResult<SeminarLecturer>[]
  ) {
    setParams(
      updateDataGridParams<SeminarLecturer>(
        pagination,
        filters,
        sorter,
        columns
      )
    );
  }
  return (
    <React.Fragment>
      <h1>Lecturers</h1>
      <DataGridComponent<SeminarLecturer>
        className={styles.AttendeesTable}
        bordered
        columns={columns}
        rowKey={(rec) => rec.id}
        dataSource={records}
        selectable={true}
        loading={loading === FetchStateEnum.LOADING}
        filters={params.filters}
        onChange={handleChange}
        sort={sorter}
        pagination={false}
        scroll={{ x: 1300 }}
        inlineEdit={true}
        Actions={
          <LecturersCustomActionsComponent
            lecturers={records}
            onDownloadCertificates={handleDownloadCertificates}
          />
        }
        /*RowActions={
          <AttendeesCustomRowActionsComponent
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onSendInvitation={handleSendInvitations}
            onSendCertificates={handleSendCertificates}
            onDownloadCertificates={handleDownloadCertificates}
          />
        }*/
      />
    </React.Fragment>
  );
}

export default LecturersTab;
