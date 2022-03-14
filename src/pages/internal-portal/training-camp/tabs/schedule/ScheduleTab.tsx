import React, {useEffect, useState} from "react";
import {Link, useHistory, useRouteMatch} from "react-router-dom";
import {TablePaginationConfig} from "antd/lib/table";

import styles from "./Schedule.module.scss";

import {api} from "../../../../../core/api";
import {Logger} from "../../../../../core/logger";
import {
  defaultPaginationSort,
  updateDataGridParams,
} from "../../../../../core/Utils";

import {ClassLecture} from "../../../../../model/domain/classes/ClassLecture";
import {FetchStateEnum} from "../../../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../../../../model/ui/types/DataGridTypes";

import DataGridComponent from "../../../../../shared/components/datagrid/DataGrid";
import DataGridActionsComponent from "../../../../../shared/components/datagrid/DataGridActions";
import {
  FailNotification,
  SuccessNotification,
} from "../../../../../shared/components/notifications/Notification";
import ScheduleDatesCustomCell from "./custom/ScheduleDatesCustomCell";
import ScheduleCustomRowActionsComponent from "./custom/ScheduleCustomRowActions";
import {UserProfile} from "../../../../../model/domain/classes/UserProfile";
import {saveAs} from "file-saver";

interface ScheduleTabProp {
  editable: boolean
}

function ScheduleTab({editable}: ScheduleTabProp) {
  const [records, setRecords] = useState<Array<ClassLecture>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<ClassLecture>>(
    defaultPaginationSort()
  );

  let {url, isExact, params: routeParams} = useRouteMatch<ClassParams>();
  let history = useHistory();
  const sorter = params.sorter as SorterResult<ClassLecture> | null;

  const renderLecturers = (item: ClassLecture) => {

    return item.classLecturers.map((lecturer: UserProfile) => {
      return <div><Link
        to={`/admin-panel/user-profiles/${lecturer.id}/${lecturer.username}/lectures/${item.id}`}>{`${lecturer.firstName} ${lecturer.lastName}`}</Link>
      </div>
    })
  };


  const columns: Array<DataGridColumnType<ClassLecture>> = [
    {
      title: "Topic",
      dataIndex: "name",
      filterEnabled: true,
      defaultSort: true,
      resizable: true,
      width: 200,
      link: {
        url: (record) => `${url}/${record.id}`,
      },
      rules: [
        {
          required: true,
          message: `Enter a topic.`,
        },
      ],
    },
    {
      title: "Description",
      dataIndex: "description",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      resizable: true,
      ellipsis: true,
      width: 260,
    },
    {
      title: "Lecturers",
      //dataIndex: "classLecturers",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      resizable: true,
      ellipsis: true,
      width: 260,
      render: rec => <div>{renderLecturers(rec)}</div>
    },
    {
      title: "Module",
      dataIndex: ["module", "name"],
      resizable: true,
      defaultSort: true,
      filterEnabled: true,
      width: 130,
    },
    {
      title: "Start - End",
      dataIndex: ["classLectureInstances"],
      resizable: true,
      width: 330,
      component: ScheduleDatesCustomCell
    },
  ];

  useEffect(() => {
    isExact && loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExact]);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      const apiParams = {
        "klassId.equals": routeParams.classId
      };
      let classLectures = await api.classLecture.getAll(apiParams);
      setRecords(classLectures);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleCreate(): Promise<void> {
    history.replace(`${url}/new`);
  }

  async function handleUpdate(record: ClassLecture): Promise<void> {
    //@ts-ignore
    history.replace(`${url}/${record.id}`);
  }

  async function handleEditMaterial(record: ClassLecture): Promise<void> {
    history.replace(`${url}/${record.id}/materials`);
  }

  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.classLecture.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Schedule deleted.");
    } catch (error) {
      FailNotification("Deleting error");
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
        await api.classLecture.delete(id);
        data.splice(recordIndex, 1);
      } catch (error) {
        FailNotification(`Deleting error ${data[recordIndex]?.name}.`);
        Logger.error(error);
      }
    }
    setRecords(data);
    setLoading(FetchStateEnum.LOADED);
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

  async function handleExportTheory(id:number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      const data = await api.exportDiary.theory(id);
      let blob = new Blob([data], {type: "application/zip"});
      saveAs(blob, "teorijski dio.docx");
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
      <div className={styles.scheduleWrap}>
        <DataGridComponent<ClassLecture>
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
          inlineEdit={editable}
          scroll={{x: 3000}}
          Actions={
            <DataGridActionsComponent
              onCreate={handleCreate}
              onDeleteSelected={handleDeleteSelected}
            />
          }
          RowActions={
            <ScheduleCustomRowActionsComponent
              onUpdate={handleUpdate}
              onDelete={() => editable && handleDelete}
              onEditMaterial={handleEditMaterial}
              report={(rec:number)=>handleExportTheory(rec)}

            />
          }
        />
      </div>
    </React.Fragment>
  );
}

export default ScheduleTab;
