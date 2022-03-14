import React, {useEffect, useState} from "react";
import {useHistory, useRouteMatch} from "react-router-dom";

import {TablePaginationConfig} from "antd/lib/table";
import {api} from "../../../core/api";
import {Logger} from "../../../core/logger";
import {defaultPaginationSort, getApiParams, updateDataGridParams,} from "../../../core/Utils";

import {Seminar} from "../../../model/domain/classes/Seminar";
import {SeminarSubcategory} from "../../../model/domain/classes/SeminarSubcategory";
import {SeminarCategory} from "../../../model/domain/classes/SeminarCategory";
import {Organizer} from "../../../model/domain/classes/Organizer";
import {Location} from "../../../model/domain/classes/Location";
import {DataGridCellTypeEnum} from "../../../model/ui/enums/DataGridCellTypeEnum";
import {FetchStateEnum} from "../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../../model/ui/types/DataGridTypes";
import {FailNotification, SuccessNotification,} from "../../../shared/components/notifications/Notification";
import DataGridComponent from "../../../shared/components/datagrid/DataGrid";
import SeminarsParticipantsCustomCell from "./custom/SeminarsParticipantsCustomCell";
import SeminarsCustomRowActionsComponent from "./custom/SeminarsCustomRowActions";
import {Tooltip} from "antd";
import {saveAs} from "file-saver";
import SeminarCustomActionsComponent from "./custom/SeminarCustomActions";

function SeminarsPage() {
  const [records, setRecords] = useState<Array<Seminar>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<Seminar>>(
    defaultPaginationSort(50)
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
            .replaceAll("/", "-")}/general`;
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

  async function handleCreate(): Promise<void> {
    history.replace(`${path}/new`);
  }

  async function handleUpdate(record: Seminar): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === record.id);
      const updatedRecord: Seminar = {
        ...data[recordIndex],
        ...record,
      };
      data[recordIndex] = await api.seminar.update(updatedRecord);
      setRecords(data);
      SuccessNotification("Seminar changed.");
    } catch (error) {
      FailNotification("Saving data error");
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
        await api.seminar.delete(id);
        data.splice(recordIndex, 1);
      } catch (error) {
        FailNotification(`Deleting error ${data[recordIndex]?.name}.`);
        Logger.error(error);
      }
    }
    setRecords(data);
    setLoading(FetchStateEnum.LOADED);
  }

  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.seminar.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Organizator deleted.");
    } catch (error) {
      FailNotification("Deleting error organizatora.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }
  async function handleDownload(id: number) {
    try {
      //setLoading(FetchStateEnum.LOADING);
      const data = await api.seminarAttendee.downloadInvitationsSeminar(id);
      let blob = new Blob([data], { type: "application/zip" });
      saveAs(blob, `invitation.zip`);
      SuccessNotification("Download started.");
    } catch (error) {
      FailNotification("Download error.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }
  async function handleCopy(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      let data = await api.seminar.duplicate(id);
      SuccessNotification(`Seminar kopiran. Kreiran seminar id: ${data.id} .`);
      await loadData();
    } catch (error) {
      FailNotification("Greška pri kopiranju.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }
 /* async function handleDownloadDescription(ids:Array<number>) {
    try {
      setLoading(FetchStateEnum.LOADING);
      const data = await api.seminar.downloadList(ids);
      let blob = new Blob([data], { type: "application/octet-stream" });
      saveAs(blob, 'description.docx');
      setLoading(FetchStateEnum.LOADED);
      SuccessNotification("Download started.");
    } catch (error) {
      FailNotification("Download error.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }
*/
  async function handleDownloadDescription(ids:Array<number>) {
    try {
      //setLoading(FetchStateEnum.LOADING);
      const data = await api.seminar.downloadList(ids);
      let blob = new Blob([data], {type: data.type});
      saveAs(blob, `description.docx`);
      SuccessNotification("Download started.");
    } catch (error) {
      FailNotification("Download error.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
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
      <h1>Seminars</h1>
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
          <SeminarCustomActionsComponent
            onCreate={handleCreate}
            onDeleteSelected={handleDeleteSelected}
            onDownloadDescription = {handleDownloadDescription}
          />
        }
        RowActions={
          <SeminarsCustomRowActionsComponent
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onDownload={handleDownload}
            onDuplicate={handleCopy}
            //onLock={handleLock}
          />
        }
      />
    </React.Fragment>
  );
}

export default SeminarsPage;
