import { Modal, TablePaginationConfig } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { api } from "../../../../../../core/api";
import { Logger } from "../../../../../../core/logger";
import { defaultPaginationSort, goBack, updateDataGridParams } from "../../../../../../core/Utils";

import { ClassLectureFile } from "../../../../../../model/domain/classes/ClassLectureFile";
import { DataGridCellTypeEnum } from "../../../../../../model/ui/enums/DataGridCellTypeEnum";
import { FetchStateEnum } from "../../../../../../model/ui/enums/FetchStateEnum";
import { DataGridColumnType, DataGridFiltersType, DataGridParamsType, SorterResult } from "../../../../../../model/ui/types/DataGridTypes";
import DataGridComponent from "../../../../../../shared/components/datagrid/DataGrid";
import { FailNotification, SuccessNotification } from "../../../../../../shared/components/notifications/Notification";
import LectureMaterialsCustomActionsComponent from "./custom/LectureMaterialsCustomActions";
import LectureMaterialsCustomRowActionComponent from "./custom/LectureMaterialsCustomRowAction";


function LectureMaterialsTab() {
  const [records, setRecords] = useState<Array<ClassLectureFile>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<ClassLectureFile>>(
    defaultPaginationSort()
  );
  const sorter = params.sorter as SorterResult<ClassLectureFile> | null;
  const { url, params: routeParams } = useRouteMatch<ClassParams>();
  const history = useHistory();
  const lectureId = routeParams.id;

  const columns: Array<DataGridColumnType<ClassLectureFile>> = [
    {
      title: "Name",
      dataIndex: "name",
      defaultSort: true,
      resizable: true,
      width: 150
    },
    {
      title: "Description",
      dataIndex: "description",
      defaultSort: true,
      resizable: true,
      width: 200
    },
    {
      title: "Created",
      dataIndex: "createdDate",
      defaultSort: true,
      resizable: true,
      width: 150,
      cellType: DataGridCellTypeEnum.DATE
    },
    {
      title: "Modified",
      dataIndex: "lastModifiedDate",
      defaultSort: true,
      resizable: true,
      width: 150,
      cellType: DataGridCellTypeEnum.DATE
    }
  ];

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let records = await api.classLectureMaterial.getAll(lectureId);
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleUpdate(record?: ClassLectureFile) {
    await loadData();
  }

  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.classLectureMaterial.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Lecture material deleted.");
    } catch (error) {
      FailNotification("Deleting error");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  function handleChange(
    pagination: TablePaginationConfig,
    filters: DataGridFiltersType,
    sorter: SorterResult<ClassLectureFile> | SorterResult<ClassLectureFile>[]
  ) {
    setParams(
      updateDataGridParams<ClassLectureFile>(pagination, filters, sorter, columns)
    );
  }

  const closeModal = () => {
    goBack(history, url, 2);
  };

  return (
    <Modal
      closable
      destroyOnClose
      okButtonProps={{ style: { display: 'none' } }}
      onCancel={closeModal}
      visible={true}
      className="bigModal"
      title="Lecture materials"
    >
      <DataGridComponent<ClassLectureFile>
        bordered
        columns={columns}
        rowKey={(rec) => rec.id}
        dataSource={records}
        loading={loading === FetchStateEnum.LOADING}
        selectable={false}
        filters={params.filters}
        sort={sorter}
        pagination={params.pagination}
        onChange={handleChange}
        inlineEdit={false}
        Actions={<LectureMaterialsCustomActionsComponent onCreate={handleUpdate} />}
        RowActions={<LectureMaterialsCustomRowActionComponent onUpdate={handleUpdate} onDelete={handleDelete} />}
      />
    </Modal>
  );
}

export default LectureMaterialsTab;
