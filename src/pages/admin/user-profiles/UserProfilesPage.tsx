import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { TablePaginationConfig } from "antd/lib/table";
import { api } from "../../../core/api";
import { Logger } from "../../../core/logger";
import {
  defaultPaginationSort,
  getApiParams,
  updateDataGridParams,
} from "../../../core/Utils";

import { UserProfile } from "../../../model/domain/classes/UserProfile";
import { FetchStateEnum } from "../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../../model/ui/types/DataGridTypes";
import { DataGridCellTypeEnum } from "../../../model/ui/enums/DataGridCellTypeEnum";
import { ProfileFunction } from "../../../model/domain/classes/ProfileFunction";
import { ProfileClass } from "../../../model/domain/classes/ProfileClass";
import { Institution } from "../../../model/domain/classes/Institution";
import { FailNotification } from "../../../shared/components/notifications/Notification";
import DataGridComponent from "../../../shared/components/datagrid/DataGrid";
import DataGridRowActionsComponent from "../../../shared/components/datagrid/DataGridRowActions";
import DataGridActionsComponent from "../../../shared/components/datagrid/DataGridActions";

function UserProfilesPage() {
  const [records, setRecords] = useState<Array<UserProfile>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [profileFunctions, setProfileFunctions] = useState<
    Array<ProfileFunction>
  >([]);
  const [institutions, setInstitutions] = useState<Array<Institution>>([]);
  const [profileClasses, setProfileClasses] = useState<Array<ProfileClass>>([]);
  const [params, setParams] = useState<DataGridParamsType<UserProfile>>(
    defaultPaginationSort()
  );
  let { path, isExact } = useRouteMatch();
  let history = useHistory();
  const sorter = params.sorter as SorterResult<UserProfile> | null;

  const columns: Array<DataGridColumnType<UserProfile>> = [
    {
      title: "First name",
      dataIndex: "firstName",
      sorter: true,
      resizable: true,
      width: 150,
      filterEnabled: true,
      fixed: "left",
      link: {
        url: (rec) => `${path}/${rec.id}/${rec.username}/general`,
      },
      editable: false,
    },
    {
      title: "Last name",
      dataIndex: "lastName",
      sorter: true,
      resizable: true,
      width: 150,
      filterEnabled: true,
      fixed: "left",
      link: {
        url: (rec) => `${path}/${rec.id}/${rec.username}/general`,
      },
      editable: false,
    },
    {
      title: "Username",
      dataIndex: "username",
      sorter: true,
      resizable: true,
      width: 250,
      filterEnabled: true,
      //   link: {
      //     url: (rec) => `${path}/${rec.id}/${rec.username}/general`,
      //   },
      editable: false,
    },
    {
      title: "Phone",
      dataIndex: "telephoneNumber",
      sorter: true,
      resizable: true,
      width: 200,
      filterEnabled: true,
      editable: true,
      cellType: DataGridCellTypeEnum.NUMBER,
    },
    {
      title: "Active",
      dataIndex: "enabled",
      sorter: true,
      resizable: true,
      width: 150,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.CHECKBOX,
      editable: false,
    },
    {
      title: "Function",
      dataIndex: ["function", "id"],
      sortIndex: ["function", "name"],
      sorter: true,
      resizable: true,
      width: 200,
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
      width: 200,
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
      title: "User classes",
      dataIndex: ["profileClasses", "id"],
      filterIndex: ["profileClass", "id"],
      resizable: true,
      sorter: true,
      width: 300,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.MULTIOPTION,
      editable: true,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: profileClasses,
      },
    },
    {
      title: "Created",
      dataIndex: "createdDate",
      sorter: true,
      resizable: true,
      width: 200,
      cellType: DataGridCellTypeEnum.DATE,
      editable: false,
    },
  ];

  useEffect(() => {
    loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    isExact && loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExact, params.filters, params.sorter, params.pagination.current]);

  async function loadOptions() {
    try {
      setLoading(FetchStateEnum.LOADING);
      setProfileFunctions(await api.profileFunction.getAll());
      setInstitutions(await api.institution.getAll());
      setProfileClasses(await api.profileClass.getAll());
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
    }
  }

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      const pagination = { ...params.pagination };
      const apiParams = getApiParams<UserProfile>(params);
      let records = await api.userProfile.getAll(apiParams);
      pagination.total = await api.userProfile.count(apiParams);
      if (records.length === 0 && pagination.current && pagination.current > 1)
        pagination.current -= 1;

      setParams({ ...params, pagination });
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleUpdate(record: UserProfile): Promise<void> {
    history.push(`${path}/${record.id}/${record.username}`);
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
    <React.Fragment>
      <h1>User profiles</h1>
      <DataGridComponent<UserProfile>
        bordered
        columns={columns}
        rowKey={(rec) => rec.id}
        dataSource={records}
        loading={loading === FetchStateEnum.LOADING}
        onChange={handleChange}
        filters={params.filters}
        sort={sorter}
        pagination={params.pagination}
        inlineEdit={false}
        scroll={{ x: true }}
        actionsColumn={{ fixed: "right" }}
        Actions={<DataGridActionsComponent />}
        RowActions={<DataGridRowActionsComponent onUpdate={handleUpdate} />}
      />
    </React.Fragment>
  );
}

export default UserProfilesPage;
