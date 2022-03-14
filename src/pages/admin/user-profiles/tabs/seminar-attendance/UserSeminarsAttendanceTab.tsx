import { TablePaginationConfig } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";

import { api } from "../../../../../core/api";
import { Logger } from "../../../../../core/logger";
import { defaultPaginationSort, updateDataGridParams } from "../../../../../core/Utils";
import { UserSeminar } from "../../../../../model/domain/classes/UserSeminar";
import { DataGridCellTypeEnum } from "../../../../../model/ui/enums/DataGridCellTypeEnum";
import { FetchStateEnum } from "../../../../../model/ui/enums/FetchStateEnum";
import { DataGridColumnType, DataGridFiltersType, DataGridParamsType, SorterResult } from "../../../../../model/ui/types/DataGridTypes";
import DataGridComponent from "../../../../../shared/components/datagrid/DataGrid";
import {FailNotification, SuccessNotification} from "../../../../../shared/components/notifications/Notification";
import { SeminarUserTypeEnum } from "../../../../../model/domain/enums/SeminarUserTypeEnum";
import { SeminarAttendeeStatusEnum } from "../../../../../model/domain/enums/SeminarAttendeeStatusEnum";

import SeminarAttendanceCustomComponent from "./custom/SeminarAttendanceCustomActions";
import {saveAs} from "file-saver";

function UserSeminarsAttendanceTab() {
  const [records, setRecords] = useState<Array<UserSeminar>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<UserSeminar>>(
    defaultPaginationSort(undefined, 'start', "ascend")
  );
  const { params: routeParams } = useRouteMatch<DetailsParams>();
  const userId = +routeParams.id;
  const sorter = params.sorter as SorterResult<UserSeminar> | null;

  const columns: Array<DataGridColumnType<UserSeminar>> = [
    {
      title: "Ime",
      dataIndex: "name",
      defaultSort: true,
      resizable: true,
      filterEnabled: true,
      width: 400
    },
    {
      title: "Početak",
      dataIndex: "start",
      defaultSort: true,
      filterEnabled: true,
      resizable: true,
      width: 400,
      cellType: DataGridCellTypeEnum.DATE
    },
    {
      title: "Status",
      dataIndex: "status",
      defaultSort: true,
      resizable: true,
      width: 400,
      cellType: DataGridCellTypeEnum.OPTION,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: [
          {
            id: SeminarUserTypeEnum.LECTURER,
            name: "Predavač",
          },
          {
            id: SeminarAttendeeStatusEnum.INVITED,
            name: "Pozvan",
          },
          {
            id: SeminarAttendeeStatusEnum.NOT_INVITED,
            name: "Nije pozvan",
          },
          {
            id: SeminarAttendeeStatusEnum.ATTENDED,
            name: "Polaznik",
          },
          {
            id: SeminarAttendeeStatusEnum.CERTIFIED,
            name: "Sertifikovan",
          },
          {
            id: SeminarAttendeeStatusEnum.REGISTERED,
            name: "Registrovan",
          },
        ],
      }
    },
    {
      title: "Uloga",
      dataIndex: "type",
      defaultSort: true,
      filterEnabled: true,
      resizable: true,
      width: 400,
      cellType: DataGridCellTypeEnum.OPTION,
      options: {
        valueIndex: 'id',
        nameIndex: 'name',
        values: [
          {
            id: SeminarUserTypeEnum.LECTURER,
            name: 'Lecturer'
          },
          {
            id: SeminarUserTypeEnum.ATTENDEE,
            name: 'Attendee'
          }
        ]
      }
    }
  ];

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let records = await api.userProfile.getUserSeminars(userId);
      records = records.filter(function( obj ) {
        return obj.type !== SeminarUserTypeEnum.LECTURER;
      });
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Greška prilikom učitavanja. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleDownloadCertificates(
    seminars: Array<UserSeminar>,

  ) {
    try {
      setLoading(FetchStateEnum.LOADING);
      const seminarIds = seminars.map((user:UserSeminar) => parseInt(user.id));
      const data = await api.userProfile.downloadCertificateForAttendees(
        parseInt(routeParams.id),
        seminarIds,
      );
      let blob = new Blob([data], { type: "application/docx" });
      saveAs(blob, "cert.docx");
      SuccessNotification("Preuzimanje je počelo.");
      await loadData();
    } catch (e) {
      FailNotification("Greška pri preuzimanju sertifikata.");
      Logger.error(e);
      throw e;
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  function handleChange(
    pagination: TablePaginationConfig,
    filters: DataGridFiltersType,
    sorter: SorterResult<UserSeminar> | SorterResult<UserSeminar>[]
  ) {
    setParams(
      updateDataGridParams<UserSeminar>(pagination, filters, sorter, columns)
    );
  }

  return (
    <React.Fragment>
      <h1>Prisustvo</h1>
      <DataGridComponent<UserSeminar>
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
          // @ts-ignore
          <SeminarAttendanceCustomComponent
            seminars={records}
            onDownloadCertificates={handleDownloadCertificates}
          />
        }
      />
    </React.Fragment>
  );
}

export default UserSeminarsAttendanceTab;
