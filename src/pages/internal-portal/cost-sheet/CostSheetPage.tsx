import React, {useEffect, useState} from "react";
import {useHistory, useRouteMatch} from "react-router-dom";

import {api} from "../../../core/api";
import {Logger} from "../../../core/logger";
import {defaultPaginationSort, getApiParams, } from "../../../core/Utils";

import {Seminar} from "../../../model/domain/classes/Seminar";
import {SeminarSubcategory} from "../../../model/domain/classes/SeminarSubcategory";
import {SeminarCategory} from "../../../model/domain/classes/SeminarCategory";
import {Organizer} from "../../../model/domain/classes/Organizer";
import {Location} from "../../../model/domain/classes/Location";
import {DataGridCellTypeEnum} from "../../../model/ui/enums/DataGridCellTypeEnum";
import {FetchStateEnum} from "../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridParamsType,
  SorterResult,
} from "../../../model/ui/types/DataGridTypes";
import {FailNotification, SuccessNotification,} from "../../../shared/components/notifications/Notification";
import DataGridComponent from "../../../shared/components/datagrid/DataGrid";
import {Tooltip} from "antd";
import SeminarsParticipantsCustomCell from "../seminars/custom/SeminarsParticipantsCustomCell";
import CostSheetCustomRowComponent from "./custom/CostSheetCustomRowComponent";
import CostSheetCustomActionComponent from "./custom/CostSheetCustomActionComponent";
import {saveAs} from "file-saver";

function CostSheetPage() {
  const [records, setRecords] = useState<Array<Seminar>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<Seminar>>(
    defaultPaginationSort(20000)
  );
  let {path, isExact} = useRouteMatch();
  let history = useHistory();

  const [organisers, setOrganisers] = useState<Array<Organizer>>([]);
  const [locations, setLocations] = useState<Array<Location>>([]);
  const [seminarCategories, setSeminarCategories] = useState<Array<SeminarCategory>>([]);
  const [seminarSubcategories, setSeminarSubcategories] = useState<Array<SeminarSubcategory>>([]);

  const sorter = params.sorter as SorterResult<Seminar> | null;
  const columns: Array<DataGridColumnType<Seminar>> = [
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      fixed: "left",
      width: 150,
      //ellipsis: true,
      link: {
        url: (record) => {
          let name = record.name;
          return `${path}/${record.id}/${name
            .toLowerCase()
            .replace(/\s+/g, "-")}/general`;
        },
        target: "push",
      },
      rules: [
        {
          required: true,
          message: `Enter a name.`,
        },
      ],
    },
    {
      title: "Location",
      dataIndex: ["seminarLocation", "id"],
      sortIndex: ["seminarLocation", "name"],
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      sorter: true,
      fixed: "left",
      width: 150,
      cellType: DataGridCellTypeEnum.OPTION,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: locations,
      },
    },
    {
      title: "Starts",
      fixed: "left",
      dataIndex: "start",
      defaultSort: true,
      filterEnabled: true,
      width: 160,
      cellType: DataGridCellTypeEnum.DATE,
    },
    {
      title: "Ends",
      fixed: "left",
      dataIndex: "end",
      defaultSort: true,
      filterEnabled: true,
      width: 160,
      cellType: DataGridCellTypeEnum.DATE,
    },
    {
      title: "Number of participants",
      width: 150,
      component: SeminarsParticipantsCustomCell,
    },
    {
      title: "Intro",
      dataIndex: "intro",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      width: 200,
      ellipsis: {
        showTitle: true,
      },
      render(text ) {
        return {
          children: <Tooltip title={text}>{text}</Tooltip>
        };
      }
    },
    {
      title: "Locked",
      dataIndex: "locked",
      cellType: DataGridCellTypeEnum.CHECKBOX,
      width: 100,
    },
    {
      title: "Category",
      dataIndex: ["seminarCategory", "id"],
      sortIndex: ["seminarCategory", "name"],
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 200,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.OPTION,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: seminarCategories,
      },
      rules: [
        {
          required: true,
          message: `Seminar category missing.`,
        },
      ],
    },
    {
      title: "Subcategory",
      dataIndex: ["seminarSubCategory", "id"],
      sortIndex: ["seminarSubCategory", "name"],
      dependencies: [["seminarCategory", "id"]],
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 200,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.OPTION,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: seminarSubcategories,
        filter: (val: SeminarSubcategory, depId) =>
          val.parentCategory?.id === depId,
      },
      rules: [
        {
          required: true,
          message: `Seminar subcategory missing.`,
        },
      ],
    },
    {
      title: "Organisers",
      dataIndex: ["organisers", "id"],
      sortIndex: ["organisers", "name"],
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      sorter: true,
      width: 250,
      cellType: DataGridCellTypeEnum.MULTIOPTION,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: organisers,
      },
    },
    {
      title: "Created",
      dataIndex: "createdDate",
      editable: false,
      width: 160,
      defaultSort: true,
      cellType: DataGridCellTypeEnum.DATE,
    },
  ];

  useEffect(() => {
    isExact && loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExact, params.filters, params.sorter, params.pagination.current]);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);

      const pagination = {...params.pagination};
      const apiParams = getApiParams<Seminar>(params);
      let records = await api.seminar.getAll(apiParams);
      pagination.total = await api.seminar.count(apiParams);
      if (records.length === 0 && pagination.current && pagination.current > 1)
        pagination.current -= 1;

      setOrganisers(await api.organizer.getAll());
      setLocations(await api.location.getAll());
      setSeminarCategories(await api.seminarCategory.getAll());
      setSeminarSubcategories(await api.seminarSubcategory.getAll());
      setParams({...params, pagination});
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }
const gotoDetails=(rec:Seminar)=>{
  history.push(`/internal-portal/seminars/${rec.id}/${rec.name
      .toLowerCase()
      .replace(/\s+/g, "-")}/cost-sheet`)
  };


  async function handleReportDownload(ids: Array<number>) {
    try {
      //setLoading(FetchStateEnum.LOADING);
      const data = await api.seminarCost.getReport(ids);
      let blob = new Blob([data], { type: "application/xlsx" });

      saveAs(blob, `tr.xlsx`);
      SuccessNotification("Download started.");
    } catch (error) {
      FailNotification("Download error.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }
  return (
    <React.Fragment>
      <h1>Cost Sheet Management</h1>
      <DataGridComponent<Seminar>
        bordered
        columns={columns}
        rowKey={(rec) => rec.id}
        dataSource={records}
        selectable={true}
        loading={loading === FetchStateEnum.LOADING}
        filters={params.filters}
        sort={sorter}
        pagination={params.pagination}
        scroll={{x: 1500, y: 500}}
         actionsColumn={{
           fixed: "right",
           width: 120,
         }}
          Actions={
            <CostSheetCustomActionComponent
              onDownloadReport={handleReportDownload}
            />
          }
          RowActions={
            <CostSheetCustomRowComponent
              onDetails={(rec)=>gotoDetails(rec)}
            />
          }
      />
    </React.Fragment>
  );
}

export default CostSheetPage;
