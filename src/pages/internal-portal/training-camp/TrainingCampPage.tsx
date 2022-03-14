import React, {useEffect, useState} from "react";
import {useHistory, useRouteMatch} from "react-router-dom";

import {TablePaginationConfig} from "antd/lib/table";

import {api} from "../../../core/api";
import {Logger} from "../../../core/logger";
import {
  defaultPaginationSort,
  updateDataGridParams,
} from "../../../core/Utils";
import {FetchStateEnum} from "../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../../model/ui/types/DataGridTypes";
import {DataGridCellTypeEnum} from "../../../model/ui/enums/DataGridCellTypeEnum";
import DataGridComponent from "../../../shared/components/datagrid/DataGrid";
import DataGridActionsComponent from "../../../shared/components/datagrid/DataGridActions";
import DataGridRowActionsComponent from "../../../shared/components/datagrid/DataGridRowActions";
import {
  FailNotification,
  SuccessNotification,
} from "../../../shared/components/notifications/Notification";
import {Class} from "../../../model/domain/classes/Class";
import {ClassTypeEnum} from "../../../model/domain/enums/ClassTypeEnum";
import {Button, Form, Select} from "antd";
import styles from "../../../shared/components/datagrid/DataGrid.module.scss";
import internalStyles from "../InternalPortalPage.module.scss";
import {saveAs} from "file-saver";

function TrainingCampPage() {
  const [records, setRecords] = useState<Array<Class>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<Class>>(
    defaultPaginationSort()
  );
  let {path, isExact} = useRouteMatch();

  let history = useHistory();
  const sorter = params.sorter as SorterResult<Class> | null;
  const columns: Array<DataGridColumnType<Class>> = [
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      fixed: "left",
      width: 150,
      link: {
        url: (record) => {
          let name = record.name;
          return `${path}/${record.id}/${name
            .toLowerCase()
            .replace(/\s+/g, "-")}`;
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
      title: "Description",
      dataIndex: "description",
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 300,
      filterEnabled: true,
      fixed: "left",
    },

    {
      title: "Type",
      dataIndex: "type",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      fixed: "left",
      width: 100,
      cellType: DataGridCellTypeEnum.OPTION,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: [
          {id: ClassTypeEnum.SUDIJE, name: "Sudije"},
          {id: ClassTypeEnum.TUZIOCI, name: "Tužioci"},
          {id: ClassTypeEnum.SUDIJE_I_TUZIOCI, name: "Sudije i Tužioci"},
        ],
      },
    },
    {
      title: "Locked",
      dataIndex: "locked",
      cellType: DataGridCellTypeEnum.CHECKBOX,
      width: 80,
    },
    {
      title: "Created",
      dataIndex: "createdDate",
      defaultSort: true,
      resizable: true,
      width: 150,
      cellType: DataGridCellTypeEnum.DATE,
      filterEnabled: true,
    },
  ];

  useEffect(() => {
    isExact && loadData();
  }, [isExact]);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let records = await api.class.getAll();
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

  async function handleUpdate(record: Class): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === record.id);
      const updatedRecord: Class = {
        ...data[recordIndex],
        ...record,
      };
      data[recordIndex] = await api.class.update(updatedRecord);
      setRecords(data);
      SuccessNotification("Class changed.");
    } catch (error) {
      FailNotification("Saving data error");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.class.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Class deleted.");
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
        await api.class.delete(id);
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
    sorter: SorterResult<Class> | SorterResult<Class>[]
  ) {
    setParams(
      updateDataGridParams<Class>(pagination, filters, sorter, columns)
    );
  }

  const options = [];
  for (let i = 2020; i < 2100; i++) {
    const value = `${i}`;
    options.push({
      value,
    });
  }
  const [formYear] = Form.useForm();
  const reportByYear = async (year: string) => {
    try {
      setLoading(FetchStateEnum.LOADING);
      const data = await api.report.getJournalReportByYear(year);
      let blob = new Blob([data], {type: "application/zip"});
      saveAs(blob, `${year}.xlsx`);
      SuccessNotification("Download started.");
    } catch (e) {
      FailNotification("Unable to download report.");
      Logger.error(e);
      throw e;
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  };
  const handleFinishYear = (values: any) => {
    reportByYear(values.year);
    console.log(values)
  };
  const selectLayout = {
    labelCol: {span:9},
    wrapperCol: {span: 15},
  };
  return (
    <React.Fragment>
      <div className={internalStyles.headerWithForm}>
        <h1>Journal of Initial candidates</h1>
        <Form form={formYear}
              onFinish={handleFinishYear}
              {...selectLayout}
              className={internalStyles.formSelect}
        >
          <Form.Item name={'year'} label={'Report by year'} style={{flex:1}}>
            <Select
              style={{width: '100%'}}
              placeholder="Select year"
              options={options}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              className={styles.dataGridActionsButton}
              htmlType="submit"
            >
              Export
            </Button>
          </Form.Item>
        </Form>
      </div>
      <DataGridComponent<Class>
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
        inlineEdit={true}
        Actions={
          <DataGridActionsComponent
            onCreate={handleCreate}
            onDeleteSelected={handleDeleteSelected}
          />
        }
        RowActions={
          <DataGridRowActionsComponent
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        }
      />
    </React.Fragment>
  );
}

export default TrainingCampPage;
