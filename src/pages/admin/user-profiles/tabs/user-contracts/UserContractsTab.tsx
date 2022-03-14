import { TablePaginationConfig } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { api } from "../../../../../core/api";
import { Logger } from "../../../../../core/logger";
import { defaultPaginationSort, updateDataGridParams } from "../../../../../core/Utils";
import { DataGridCellTypeEnum } from "../../../../../model/ui/enums/DataGridCellTypeEnum";
import { FetchStateEnum } from "../../../../../model/ui/enums/FetchStateEnum";
import { SeminarFile } from "../../../../../model/domain/classes/SeminarFile";
import { DataGridColumnType, DataGridFiltersType, DataGridParamsType, SorterResult } from "../../../../../model/ui/types/DataGridTypes";
import DataGridComponent from "../../../../../shared/components/datagrid/DataGrid";
import { FailNotification, SuccessNotification } from "../../../../../shared/components/notifications/Notification";
import DataGridActionsComponent from "../../../../../shared/components/datagrid/DataGridActions";
import UserContractsCustomRowActionsComponent from "./custom/UserContractsCustomRowActions";
import { FileUploadEntityEnum } from "../../../../../model/domain/enums/FileUploadEntityEnum";

function UserContractsTab() {
  const [records, setRecords] = useState<Array<SeminarFile>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<SeminarFile>>(
    defaultPaginationSort(undefined, 'createdDate', "ascend")
  );
  const { url, params: routeParams, isExact } = useRouteMatch<DetailsParams>();
  const history = useHistory();
  const userId = +routeParams.id;
  const sorter = params.sorter as SorterResult<SeminarFile> | null;

  const entityTypes = [
    {
      id: FileUploadEntityEnum.SEMINAR_CONTRACT,
      name: 'Ugovor - seminar'
    },
    {
      id: FileUploadEntityEnum.USER_CONTRACT,
      name: 'Ugovor - korisnik'
    }
  ];

  const columns: Array<DataGridColumnType<SeminarFile>> = [
    {
      title: "Naziv",
      dataIndex: "name",
      defaultSort: true,
      resizable: true,
      filterEnabled: true,
      width: 400
    },
    {
      title: "Opis",
      dataIndex: "description",
      resizable: true,
      width: 400
    },
    {
      title: "Naziv seminara",
      dataIndex: ["seminar", "name"],
      defaultSort: true,
      filterEnabled: true,
      resizable: true,
      width: 400
    },
    {
      title: "Tip",
      dataIndex: "entity",
      defaultSort: true,
      resizable: true,
      width: 400,
      cellType: DataGridCellTypeEnum.OPTION,
      options: {
        valueIndex: 'id',
        nameIndex: 'name',
        values: entityTypes
      }
    },
    {
      title: "Kreirano",
      dataIndex: "createdDate",
      resizable: true,
      width: 400,
      cellType: DataGridCellTypeEnum.DATE
    }
  ];

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExact]);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let records = await api.userProfile.getUserContracts(userId);
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Greška pri učitavanju. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleCreate(): Promise<void> {
    history.replace(`${url}/new`);
  }

  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.seminarContract.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Izbrisano.");
    } catch (error) {
      FailNotification("Greška pri brisanju");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  function handleChange(
    pagination: TablePaginationConfig,
    filters: DataGridFiltersType,
    sorter: SorterResult<SeminarFile> | SorterResult<SeminarFile>[]
  ) {
    setParams(
      updateDataGridParams<SeminarFile>(pagination, filters, sorter, columns)
    );
  }

  return (
    <React.Fragment>
        <h1>Ugovori</h1>
        <DataGridComponent<SeminarFile>
            bordered
            columns={columns}
            rowKey={(rec) => rec.id}
            dataSource={records}
            onChange={handleChange}
            filters={params.filters}
            sort={sorter}
            pagination={false}
            loading={loading === FetchStateEnum.LOADING}
            inlineEdit={false}
            Actions={
              <DataGridActionsComponent
                onCreate={handleCreate}
              />
            }
            RowActions={
              <UserContractsCustomRowActionsComponent
                onDelete={handleDelete}
              />
            }
        />
    </React.Fragment>
  );
}

export default UserContractsTab;
