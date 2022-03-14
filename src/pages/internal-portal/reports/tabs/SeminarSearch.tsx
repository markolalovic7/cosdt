import React, {useEffect, useState} from "react";
import {useRouteMatch} from "react-router-dom";

import {TablePaginationConfig} from "antd/lib/table";
import {api} from "../../../../core/api";
import {Logger} from "../../../../core/logger";
import {defaultPaginationSort, getApiParams, updateDataGridParams,} from "../../../../core/Utils";

import {Seminar} from "../../../../model/domain/classes/Seminar";
import {SeminarSubcategory} from "../../../../model/domain/classes/SeminarSubcategory";
import {SeminarCategory} from "../../../../model/domain/classes/SeminarCategory";
import {Organizer} from "../../../../model/domain/classes/Organizer";
import {Location} from "../../../../model/domain/classes/Location";
import {DataGridCellTypeEnum} from "../../../../model/ui/enums/DataGridCellTypeEnum";
import {FetchStateEnum} from "../../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../../../model/ui/types/DataGridTypes";
import {FailNotification} from "../../../../shared/components/notifications/Notification";
import DataGridComponent from "../../../../shared/components/datagrid/DataGrid";
import SeminarsParticipantsCustomCell from "../../seminars/custom/SeminarsParticipantsCustomCell";
import {Tooltip} from "antd";
import SeminarsSearchModal from "../custom/SeminarSearchModal";

function SeminarsSearchPage() {
  const [records, setRecords] = useState<Array<Seminar>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<Seminar>>(
    defaultPaginationSort(200)
  );
  let {isExact} = useRouteMatch();

  const [organisers, setOrganisers] = useState<Array<Organizer>>([]);
  const [locations, setLocations] = useState<Array<Location>>([]);
  const [seminarCategories, setSeminarCategories] = useState<Array<SeminarCategory>>([]);
  const [seminarSubcategories, setSeminarSubcategories] = useState<Array<SeminarSubcategory>>([]);
  const [searchParameters, setSearchParams] = useState<any>({functionId: undefined, institutionId: undefined});

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
          return `/internal-portal/seminars/${record.id}/${name
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
      render(text) {
        return {
          children: <Tooltip title={text} overlay={'#ffffff'}>{text}</Tooltip>
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
    isExact && loadData(searchParameters.institutionId, searchParameters.functionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExact, params.filters, params.sorter, params.pagination.current, searchParameters]);

  async function loadData(institutionId?: string, functionId?: string) {
    const intitutionParam = institutionId!==undefined ? 'institutionId.in=' + institutionId : '';
    console.log(institutionId);
    const functionParam = functionId!==undefined ? 'functionId.in=' + functionId : '';
    console.log(functionId);
    const concatenator = institutionId && functionId ? '&' : '';
    const serachParam = `${intitutionParam}${concatenator}${functionParam}`;
    console.log(serachParam);
    try {
      setLoading(FetchStateEnum.LOADING);

      const pagination = {...params.pagination};
      const apiParams = getApiParams<Seminar>(params);
      let records = await api.seminar.search(serachParam);
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

  function handleChange(
    pagination: TablePaginationConfig,
    filters: DataGridFiltersType,
    sorter: SorterResult<Seminar> | SorterResult<Seminar>[]
  ) {
    setParams(
      updateDataGridParams<Seminar>(pagination, filters, sorter, columns)
    );
  }

  return (
    <React.Fragment>
      <DataGridComponent<Seminar>
        bordered
        columns={columns}
        rowKey={(rec) => rec.id}
        dataSource={records}
        selectable={true}
        loading={loading === FetchStateEnum.LOADING}
        onChange={handleChange}
        filters={params.filters}
        sort={sorter}
        pagination={params.pagination}
        scroll={{x: 1500, y: 500}}
        // actionsColumn={{
        //   fixed: "right",
        //   width: 120,
        // }}
        Actions={
          <SeminarsSearchModal
            handleSubmit={(values) => loadData(values.institution, values.function)}
            // onDeleteSelected={handleDeleteSelected}
            // onDownloadDescription = {handleDownloadDescription}
          />
        }
      />
    </React.Fragment>
  );
}

export default SeminarsSearchPage;
