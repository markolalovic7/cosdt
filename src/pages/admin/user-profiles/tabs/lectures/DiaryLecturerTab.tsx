import React, {useEffect, useState} from "react";

import {defaultPaginationSort} from "../../../../../core/Utils";
import {FetchStateEnum} from "../../../../../model/ui/enums/FetchStateEnum";
import {DataGridColumnType, DataGridParamsType, SorterResult} from "../../../../../model/ui/types/DataGridTypes";
import DataGridComponent from "../../../../../shared/components/datagrid/DataGrid";
import DataGridRowActionsComponent from "../../../../../shared/components/datagrid/DataGridRowActions";
import {TheoryDiary} from "../../../../../model/domain/classes/TheoryDiary";
import styles from "../../../../internal-portal/seminars/tabs/attendees/Attendees.module.scss";
import {useRouteMatch} from "react-router";
import {api} from "../../../../../core/api";
import {FailNotification} from "../../../../../shared/components/notifications/Notification";
import {Logger} from "../../../../../core/logger";
import {DataGridCellTypeEnum} from "../../../../../model/ui/enums/DataGridCellTypeEnum";

interface DiaryLecturerTabProps {
  updateRecords?(records:Array<TheoryDiary>): void
}

function DiaryLecturerTab({updateRecords}:DiaryLecturerTabProps) {
  const [params, setParams] = useState<DataGridParamsType<TheoryDiary>>(
    defaultPaginationSort()
  );
  const [records, setRecords] = useState<Array<TheoryDiary>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const sorter = params.sorter as SorterResult<TheoryDiary> | null;
  let { url, isExact, params: routeParams } = useRouteMatch<UserProfileParams>();


  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExact]);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let records = (await api.classLectureDiary.getAll(+routeParams.lectureId));
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }




  const columns: Array<DataGridColumnType<TheoryDiary>> = [
    {
      title: "Metodologija",
      dataIndex: "metodologija",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      width: 500,
      ellipsis: true,
      cellType: DataGridCellTypeEnum.TEXTAREA
    },{
      title: "Motivisanost",
      dataIndex: "motivisanost",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      width: 500,
      ellipsis: true,
      cellType: DataGridCellTypeEnum.TEXTAREA

    },{
      title: "Napomena",
      dataIndex: "napomena",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      width: 500,
      ellipsis: true,
      cellType: DataGridCellTypeEnum.TEXTAREA

    },{
      title: "Napomena 2",
      dataIndex: "napomena2",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      width: 500,
      ellipsis: true,
      cellType: DataGridCellTypeEnum.TEXTAREA

    },{
      title: "Nastavni Materijal",
      dataIndex: "nastavniMaterijal",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      width: 500,
      ellipsis: true,
      cellType: DataGridCellTypeEnum.TEXTAREA

    },{
      title: "Pokazano Znanje Iz Oblasti",
      dataIndex: "pokazanoZnanjeIzOblasti",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      width: 500,
      ellipsis: true,
      cellType: DataGridCellTypeEnum.TEXTAREA

    },{
      title: "Prisutnost",
      dataIndex: "prisutnost",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      width: 200,
      ellipsis: true,
      cellType: DataGridCellTypeEnum.TEXTAREA

    },{
      title: "Razumijevanje Uloge",
      dataIndex: "razumijevanjeUloge",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      width: 200,
      ellipsis: true,
      cellType: DataGridCellTypeEnum.TEXTAREA

    },{
      title: "sposobnost Logičkog Zakljucivanja",
      dataIndex: "sposobnostLogZakljucivanja",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      width: 200,
      ellipsis: true,
      cellType: DataGridCellTypeEnum.TEXTAREA

    },{
      title: "Uključivanje U Diskusiju",
      dataIndex: "ukljucivanjeUdiskusiju",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      width: 200,
      ellipsis: true,
      cellType: DataGridCellTypeEnum.TEXTAREA

    },
  ];


  async function handleUpdate(record: TheoryDiary): Promise<void> {
    let data = [...records];
    const recordIndex = data.findIndex((rec) => rec.id === record.id);
    data[recordIndex] = {
      ...data[recordIndex],
      ...record,
    };
    setRecords(data);
    updateRecords && updateRecords(data);
  }



  return (
    <DataGridComponent<TheoryDiary>
      className={styles.AttendeesTable}
      bordered
      columns={columns}
      rowKey={(rec) => rec.id}
      dataSource={records}
      selectable={false}
      loading={loading === FetchStateEnum.LOADING}
      //onChange={handleChange}
      filters={params.filters}
      sort={sorter}
      pagination={false}
      tableLayout={"fixed"}
      scroll={{x: "1500"}}
      inlineEdit
     // Actions={}
      RowActions={
        <DataGridRowActionsComponent
          onUpdate={handleUpdate}
        />
      }
    />
  );
}

export default DiaryLecturerTab;
