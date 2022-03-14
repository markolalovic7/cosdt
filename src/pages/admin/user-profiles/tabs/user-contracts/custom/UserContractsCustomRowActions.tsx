import React, { useContext } from "react";
import { DownloadOutlined } from "@ant-design/icons";

import { api } from "../../../../../../core/api";
import DataGridRowActionsComponent, {
  DataGridRowActionsProps,
} from "../../../../../../shared/components/datagrid/DataGridRowActions";
import {
  DataGridRowContext,
  DataGridRowContextType,
} from "../../../../../../model/ui/types/DataGridRowContextType";
import {
  DataGridContext,
  DataGridContextType,
} from "../../../../../../model/ui/types/DataGridContextType";
import { SeminarFile } from "../../../../../../model/domain/classes/SeminarFile";

function UserContractsCustomRowActionsComponent({
  onUpdate,
  onDelete,
}: DataGridRowActionsProps<SeminarFile>) {
  let { record } = useContext<DataGridRowContextType<SeminarFile>>(
    DataGridRowContext
  );
  const { editingId } = useContext<DataGridContextType<SeminarFile>>(
    DataGridContext
  );
  return (
    <React.Fragment>
      {record && editingId !== record.id && (
        <a
          href={api.seminarContract.getFileUrl(record)}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginRight: 4 }}
        >
          <DownloadOutlined />
        </a>
      )}
      <DataGridRowActionsComponent onUpdate={onUpdate} onDelete={onDelete} />
    </React.Fragment>
  );
}

export default UserContractsCustomRowActionsComponent;
