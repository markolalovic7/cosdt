import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Tabs } from "antd";
import { TablePaginationConfig } from "antd/lib/table";

import { api } from "../../../../../core/api";
import { Logger } from "../../../../../core/logger";
import {
  defaultPaginationSort,
  updateDataGridParams,
} from "../../../../../core/Utils";

import { ClassLecture } from "../../../../../model/domain/classes/ClassLecture";
import { FetchStateEnum } from "../../../../../model/ui/enums/FetchStateEnum";
import { ApiParams } from "../../../../../model/ui/types/ApiParams";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../../../../model/ui/types/DataGridTypes";
import DataGridComponent from "../../../../../shared/components/datagrid/DataGrid";
import {FailNotification, SuccessNotification} from "../../../../../shared/components/notifications/Notification";
import ScheduleDatesCustomCell
  from "../../../../internal-portal/training-camp/tabs/schedule/custom/ScheduleDatesCustomCell";
import LecturersCustomRowActions from "./custom/LecturersCustomRowActions";
import CertificateDownloadActionsComponent from "../seminar-lectures/custom/CertificateDownolad";
import {saveAs} from "file-saver";

const { TabPane } = Tabs;

function LecturesTab() {
  const [records, setRecords] = useState<Array<ClassLecture>>([]);
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<ClassLecture>>(
    defaultPaginationSort()
  );
  let { url, params: routeParams } = useRouteMatch<UserProfileParams>();
  let mentorId = routeParams.id;
  let history = useHistory();
  const sorter = params.sorter as SorterResult<ClassLecture> | null;

  const columns: Array<DataGridColumnType<ClassLecture>> = [
    {
      title: "Ime",
      dataIndex: "name",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
    },
    {
      title: "Opis",
      dataIndex: "id",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
    },
    {
      title: "Početak - Kraj",
      dataIndex: ["classLectureInstances"],
      resizable: true,
      width: 250,
      component: ScheduleDatesCustomCell
    },
    {
      title: "Klasa",
      dataIndex: ["klass", "name"],
      editable: true,
      defaultSort: true,
      filterEnabled: true,
    },
    {
      title: "Modul",
      dataIndex: ["module", "name"],
      editable: false,
      defaultSort: true,
      filterEnabled: true,
    },
    {
      title: "Broj ucesnika",
      dataIndex: 'brojUcesnika',
      editable: false,
      defaultSort: true,
      filterEnabled: true,
    },
    {
      title: "Ocijenjeno",
      dataIndex: 'brojOcijenjenih',
      editable: false,
      defaultSort: true,
      filterEnabled: true,
    },
  ];

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly]);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      const apiParams: ApiParams = {
        "klassLocked.equals": readOnly,
        "classLecturersId.equals": mentorId,
      };
      let records = await api.classLecture.getAll(apiParams);
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Greška pri učitavanju. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleDiary(record: ClassLecture) {
    history.replace(`${url}/diary/${record.id}`);
  }
  async function handleGrades(record: ClassLecture) {
    history.replace(`${url}/grades/${record.id}`);
  }

  function onTabsChange(activeKey: string) {
    setReadOnly(activeKey === "finished");
  }

  function handleChange(
    pagination: TablePaginationConfig,
    filters: DataGridFiltersType,
    sorter: SorterResult<ClassLecture> | SorterResult<ClassLecture>[]
  ) {
    setParams(
      updateDataGridParams<ClassLecture>(pagination, filters, sorter, columns)
    );
  }
  async function handleDownloadCertificates(selection:Array<number>) {
    try {
      setLoading(FetchStateEnum.LOADING);
      const classLectureIds = selection;
      const profileIds = +routeParams.id
      const data = await api.classLecture.downloadLecturersCertificates(
          classLectureIds,
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
      <h1>Predavanja</h1>
      <Tabs onChange={onTabsChange} defaultActiveKey="active">
        <TabPane tab={<span>Aktivna</span>} key="active">
          <DataGridComponent<ClassLecture>
            bordered
            columns={columns}
            rowKey={(rec) => rec.id}
            dataSource={records}
            selectable={true}
            inlineEdit={false}
            loading={loading === FetchStateEnum.LOADING}
            onChange={handleChange}
            filters={params.filters}
            sort={sorter}
            pagination={params.pagination}
            scroll={{ x: 120, y: 500 }}
            RowActions={<LecturersCustomRowActions diary={handleDiary} grades={handleGrades} />}
            Actions={
              <CertificateDownloadActionsComponent
                  onDownloadCertificates={handleDownloadCertificates}
              />
            }
          />
        </TabPane>
        <TabPane tab={<span>Završena</span>} key="finished">
          <DataGridComponent<ClassLecture>
            bordered
            columns={columns}
            rowKey={(rec) => rec.id}
            dataSource={records}
            selectable={false}
            inlineEdit={false}
            loading={loading === FetchStateEnum.LOADING}
            onChange={handleChange}
            filters={params.filters}
            sort={sorter}
            pagination={params.pagination}
            RowActions={<LecturersCustomRowActions diary={handleDiary} grades={handleGrades} />}
          />
        </TabPane>
      </Tabs>
    </React.Fragment>
  );
}

export default LecturesTab;
