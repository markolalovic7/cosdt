import { TablePaginationConfig } from "antd/lib/table";
import React, {useContext, useEffect, useState} from "react";
import { useRouteMatch } from "react-router-dom";

import { api } from "../../../../../core/api";
import { Logger } from "../../../../../core/logger";
import {
  defaultPaginationSort,
  updateDataGridParams,
} from "../../../../../core/Utils";
import { UserSeminar } from "../../../../../model/domain/classes/UserSeminar";
import { DataGridCellTypeEnum } from "../../../../../model/ui/enums/DataGridCellTypeEnum";
import { FetchStateEnum } from "../../../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../../../../model/ui/types/DataGridTypes";
import DataGridComponent from "../../../../../shared/components/datagrid/DataGrid";
import {FailNotification, SuccessNotification} from "../../../../../shared/components/notifications/Notification";
import { SeminarUserTypeEnum } from "../../../../../model/domain/enums/SeminarUserTypeEnum";
import { SeminarAttendeeStatusEnum } from "../../../../../model/domain/enums/SeminarAttendeeStatusEnum";
import {SeminarLecturer} from "../../../../../model/domain/classes/SeminarLecturer";
import {saveAs} from "file-saver";
import CertificateDownloadActionsComponent from "./custom/CertificateDownolad";
import {DataGridContext, DataGridContextType} from "../../../../../model/ui/types/DataGridContextType";

function UserSeminarsLecturesTab() {
  const [records, setRecords] = useState<Array<UserSeminar>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<UserSeminar>>(
    defaultPaginationSort(undefined, "start", "ascend")
  );
  const { params: routeParams } = useRouteMatch<DetailsParams>();
  const userId = +routeParams.id;
  const sorter = params.sorter as SorterResult<UserSeminar> | null;
  const {selection, setSelection, filters, onResetAllFilters} = useContext<DataGridContextType<SeminarLecturer>>(DataGridContext);
  const filterKeys = filters ? Object.keys(filters) : [];
  const hasFilters =
      filters &&
      filterKeys.map((key) => filters[key]).filter((val) => !!val).length > 0;
  function handleResetFilters() {
    let clear: CustomMap = {};
    filters &&
    Object.keys(filters).forEach((key) => {
      clear[key] = null;
    });
    onResetAllFilters(clear);
  }

  const columns: Array<DataGridColumnType<UserSeminar>> = [
    {
      title: "Ime",
      dataIndex: "name",
      defaultSort: true,
      resizable: true,
      filterEnabled: true,
      width: 200,
      fixed: "left",
      link: {
        url: (record) => {
          let name = record.name;
          return `/internal-portal/seminars/${record.id}/${name
            .toLowerCase()
            .replaceAll("/", "-")}/general`;
        },
        target: "push",
      },
    },
    {
      title: "Početak",
      dataIndex: "start",
      defaultSort: true,
      filterEnabled: true,
      resizable: true,
      width: 160,
      cellType: DataGridCellTypeEnum.DATE,
    },
    {
      title: "Kategorija",
      dataIndex: "category",
      defaultSort: true,
      filterEnabled: true,
      resizable: true,
      width: 160,
      cellType: DataGridCellTypeEnum.TEXT,
    },
    {
      title: "Status",
      dataIndex: "status",
      defaultSort: true,
      resizable: true,
      width: 100,
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
            name: "Prisustvovao",
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
      },
    },
    {
      title: "Uloga",
      dataIndex: "type",
      defaultSort: true,
      filterEnabled: true,
      resizable: true,
      width: 100,
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
            id: SeminarUserTypeEnum.ATTENDEE,
            name: "Polaznik",
          },
        ],
      },
    },
  ];

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let records = await api.userProfile.getUserSeminars(userId);
      console.log(records);
      records = records.filter(function (obj) {
        return obj.type !== SeminarUserTypeEnum.ATTENDEE;
      });
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Greška pri učitavanju. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
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
    console.log(params)
  }
  async function handleDownloadCertificates(selection:Array<number>) {
    try {
      setLoading(FetchStateEnum.LOADING);
      const seminarIds = selection;
      const profileIds = +routeParams.id
      const data = await api.seminarAgenda.downloadLecturersCertificates(
          seminarIds,
          [profileIds],

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

  return (
    <React.Fragment>
      <h1>Predavač</h1>
      <DataGridComponent<UserSeminar>
        bordered
        columns={columns}
        //rowKey={(rec) => `${rec.id}_${rec.type}`}
        rowKey={(rec) => rec.id}
        dataSource={records}
        selectable={true}
        onChange={handleChange}
        filters={params.filters}
        sort={sorter}
        scroll={{ x: true }}
        pagination={false}
        loading={loading === FetchStateEnum.LOADING}
        Actions={
          <CertificateDownloadActionsComponent
              onDownloadCertificates={handleDownloadCertificates}
          />
        }      />
    </React.Fragment>
  );
}

export default UserSeminarsLecturesTab;
