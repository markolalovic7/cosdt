import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";

import { api } from "../../../../core/api";
import { Logger } from "../../../../core/logger";
import { ProfileInstitutionHistory } from "../../../../model/domain/classes/ProfileInstitutionHistory";
import { DataGridCellTypeEnum } from "../../../../model/ui/enums/DataGridCellTypeEnum";
import { FetchStateEnum } from "../../../../model/ui/enums/FetchStateEnum";
import { DataGridColumnType } from "../../../../model/ui/types/DataGridTypes";
import DataGridComponent from "../../../../shared/components/datagrid/DataGrid";
import { FailNotification } from "../../../../shared/components/notifications/Notification";

function UserInstitutionsTab() {
  const [records, setRecords] = useState<Array<ProfileInstitutionHistory>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const { params } = useRouteMatch<DetailsParams>();
  const userId = +params.id;

  const columns: Array<DataGridColumnType<ProfileInstitutionHistory>> = [
    {
      title: "Naziv",
      dataIndex: "name",
      defaultSort: true,
      resizable: true,
      width: 400,
    },
    {
      title: "Ažurirano",
      dataIndex: "createdDate",
      defaultSort: true,
      resizable: true,
      width: 400,
      cellType: DataGridCellTypeEnum.DATE,
    },
  ];

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let records = await api.userProfile.getInstitutionsHistory(userId);
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Greška pri učitavanju. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  return (
    <React.Fragment>
      <h1>Istorija institucija</h1>
      <DataGridComponent<ProfileInstitutionHistory>
        bordered
        columns={columns}
        rowKey={(rec) => rec.id}
        dataSource={records}
        filters={null}
        sort={null}
        loading={loading === FetchStateEnum.LOADING}
      />
    </React.Fragment>
  );
}

export default UserInstitutionsTab;
