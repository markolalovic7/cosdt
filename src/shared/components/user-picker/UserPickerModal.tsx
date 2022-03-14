import React, {useEffect, useState} from "react";

import {Modal} from "antd";
import {TablePaginationConfig} from "antd/lib/table";

import {api} from "../../../core/api";
import {Logger} from "../../../core/logger";
import {
  defaultPaginationSort,
  getApiParams,
  updateDataGridParams,
} from "../../../core/Utils";

import {UserProfile} from "../../../model/domain/classes/UserProfile";
import {FetchStateEnum} from "../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../../model/ui/types/DataGridTypes";
import {DataGridCellTypeEnum} from "../../../model/ui/enums/DataGridCellTypeEnum";
import {FailNotification} from "../notifications/Notification";
import {ProfileFunction} from "../../../model/domain/classes/ProfileFunction";
import {Institution} from "../../../model/domain/classes/Institution";
import DataGridComponent from "../datagrid/DataGrid";
import UserPickerModalActionsComponent from "./UserPickerModalActions";
import {ApiParams} from "../../../model/ui/types/ApiParams";

interface UserPickerModalProps {
  onSelect?(users: Array<UserProfile>): void;

  onClose?(): void;

  multiple?: boolean;
  defaultUsers?: Array<UserProfile>;
  apiParams?: ApiParams;
  title?: string;
  okText?: string;
  cancelText?: string;
}

function UserPickerModal({
                           onSelect,
                           onClose,
                           defaultUsers = [],
                           multiple = true,
                           title = "Pick users",
                           apiParams = {},
                           okText = "Select",
                           cancelText = "Cancel",
                         }: UserPickerModalProps) {
  const [records, setRecords] = useState<Array<UserProfile>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  // const [profileClasses, setProfileClasses] = useState<Array<ProfileClass>>([]);
  const [profileFunctions, setProfileFunctions] = useState<Array<ProfileFunction>>([]);
  const [institutions, setInstitutions] = useState<Array<Institution>>([]);
  const [params, setParams] = useState<DataGridParamsType<UserProfile>>(
    defaultPaginationSort()
  );
  const sorter = params.sorter as SorterResult<UserProfile> | null;

  const columns: Array<DataGridColumnType<UserProfile>> = [
    {
      title: "Korisničko ime",
      dataIndex: "username",
      sorter: true,
      filterEnabled: true,
    },
    {
      title: "Ime",
      dataIndex: "firstName",
      sorter: true,
      filterEnabled: true,
    },
    {
      title: "Prezime",
      dataIndex: "lastName",
      sorter: true,
      filterEnabled: true,
    },
    {
      title: "Function",
      dataIndex: ["function", "id"],
      sortIndex: ["function", "name"],
      sorter: true,
      resizable: true,
      width: 400,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.OPTION,
      editable: true,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: profileFunctions,
      },
    },
    {
      title: "Institution",
      dataIndex: ["institution", "id"],
      sortIndex: ["institution", "name"],
      sorter: true,
      resizable: true,
      width: 400,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.OPTION,
      editable: true,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: institutions,
      },
    },
    {
      title: "Datum nastanka",
      dataIndex: "createdDate",
      sorter: true,
      cellType: DataGridCellTypeEnum.DATE,
    },
  ];

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.filters, params.sorter, params.pagination.current]);

  async function loadOptions() {
    try {
      setLoading(FetchStateEnum.LOADING);
      // setProfileClasses(await api.profileClass.getAll());
      setProfileFunctions(await api.profileFunction.getAll());
      setInstitutions(await api.institution.getAll());
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
    }
  }

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      const pagination = {...params.pagination};
      const apiParam = {...getApiParams<UserProfile>(params), ...apiParams};
      let records = await api.userProfile.getAll(apiParam);
      pagination.total = await api.userProfile.count(apiParam);
      if (records.length === 0 && pagination.current && pagination.current > 1)
        pagination.current -= 1;

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
    sorter: SorterResult<UserProfile> | SorterResult<UserProfile>[]
  ) {
    setParams(
      updateDataGridParams<UserProfile>(pagination, filters, sorter, columns)
    );
  }

  return (
    <DataGridComponent<UserProfile>
      bordered
      columns={columns}
      rowKey={(rec) => rec.id}
      dataSource={records}
      loading={loading === FetchStateEnum.LOADING}
      filters={params.filters}
      sort={sorter}
      pagination={params.pagination}
      selectable={true}
      selectionType={multiple ? "checkbox" : "radio"}
      onChange={handleChange}
      Modal={
        <Modal
          onCancel={onClose}
          title={title}
          visible={true}
          destroyOnClose={true}
          className={"bigModal"}
          footer={
            <UserPickerModalActionsComponent
              defaultUsers={defaultUsers}
              onSelect={onSelect}
              onClose={onClose}
              okText={okText}
              cancelText={cancelText}
            />
          }
        />
      }
    />
  );
}

export default UserPickerModal;
