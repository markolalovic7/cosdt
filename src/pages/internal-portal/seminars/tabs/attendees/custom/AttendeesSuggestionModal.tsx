import * as React from "react";
import {useEffect, useState} from "react";

import {Modal} from "antd";
import {TablePaginationConfig} from "antd/lib/table";


import {useParams} from "react-router";
import {api} from "../../../../../../core/api";
import {Logger} from "../../../../../../core/logger";
import {ApiParams} from "../../../../../../model/ui/types/ApiParams";
import {FetchStateEnum} from "../../../../../../model/ui/enums/FetchStateEnum";
import {ProfileFunction} from "../../../../../../model/domain/classes/ProfileFunction";
import {Institution} from "../../../../../../model/domain/classes/Institution";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult
} from "../../../../../../model/ui/types/DataGridTypes";
import {defaultPaginationSort, getApiParams, updateDataGridParams} from "../../../../../../core/Utils";
import {DataGridCellTypeEnum} from "../../../../../../model/ui/enums/DataGridCellTypeEnum";
import {FailNotification} from "../../../../../../shared/components/notifications/Notification";
import DataGridComponent from "../../../../../../shared/components/datagrid/DataGrid";
import {UserProfile} from "../../../../../../model/domain/classes/UserProfile";
import UserPickerModalActionsComponent from "../../../../../../shared/components/user-picker/UserPickerModalActions";
import {SeminarAtendeeRecommendation} from "../../../../../../model/domain/classes/SeminarAtendeeRecommendation";

interface UserPickerModalProps {
  onSelect?(users: Array<UserProfile>): void;

  onClose?(): void;

  multiple?: boolean;
  defaultUsers?: Array<UserProfile>;
  apiParams?: ApiParams;
  title?: string;
  okText?: string;
  cancelText?: string;
  suggestion?: boolean;
}

function SuggestionModal({
                           onSelect,
                           onClose,
                           title = "Pick users",
                           apiParams = {},
                           okText = "Select",
                           cancelText = "Cancel",
                         }: UserPickerModalProps) {
  const [records, setRecords] = useState<Array<UserProfile>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [profileFunctions, setProfileFunctions] = useState<Array<ProfileFunction>>([]);
  const [institutions, setInstitutions] = useState<Array<Institution>>([]);
  const [params, setParams] = useState<DataGridParamsType<UserProfile>>(
    defaultPaginationSort()
  );
  const sorter = params.sorter as SorterResult<UserProfile> | null;
  const routeParams: { seminarId: string } = useParams();
  const columns: Array<DataGridColumnType<UserProfile>> = [
    {
      title: "Korisničko ime",
      dataIndex: "username",
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
      title: "Pohađao seminara",
      dataIndex: "attendedSeminars",
      sorter: true,
      filterEnabled: true,
    },
    {
      title: "Pohađao seminara u kategoriji",
      dataIndex: "attendedSeminarsInCategory",
      sorter: true,
      filterEnabled: true,
    },
    {
      title: "Pohađao seminara u podkategoriji",
      dataIndex: "attendedSeminarsInsSubCategory",
      sorter: true,
      filterEnabled: true,
    }, {
      title: "Dana na seminarima",
      dataIndex: "seminarDays",
      sorter: true,
      filterEnabled: true,
    },{
      title: "Rezultat",
      dataIndex: "score",
      sorter: true,
      filterEnabled: true,
    },
    {
      title: "Datum nastanka",
      dataIndex: "createdDate",
      sorter: true,
      cellType: DataGridCellTypeEnum.DATE,
    },
  ];

  useEffect(() => {
    loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
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
      let records = await api.suggestions.get(parseInt(routeParams.seminarId), apiParam);
      setParams({...params, pagination});
      let users = records.map((suggestion:SeminarAtendeeRecommendation)=> {
        return   {
          ...suggestion.profile,
          attendedSeminarsInsSubCategory: suggestion.attendedSeminarsInsSubCategory,
          score: suggestion.score,
          attendedSeminars: suggestion.attendedSeminars,
          attendedSeminarsInCategory: suggestion.attendedSeminarsInCategory,
          seminarDays: suggestion.seminarDays,
        }
      });
      setRecords(users);
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
    <DataGridComponent<any>
      bordered
      columns={columns}
      rowKey={(rec) => rec.id}
      dataSource={records}
      loading={loading === FetchStateEnum.LOADING}
      filters={params.filters}
      sort={sorter}
      pagination={params.pagination}
      selectable={true}
      //selectionType={multiple ? "checkbox" : "radio"}
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
              defaultUsers={[]}
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

export default SuggestionModal;
