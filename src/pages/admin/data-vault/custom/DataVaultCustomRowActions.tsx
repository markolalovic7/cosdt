import React, { useContext } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import DataGridRowActionsComponent, { DataGridRowActionsProps } from "../../../../shared/components/datagrid/DataGridRowActions";
import { FileUpload } from "../../../../model/domain/classes/FileUpload";
import { DataGridRowContext, DataGridRowContextType } from "../../../../model/ui/types/DataGridRowContextType";
import { DataGridContext, DataGridContextType } from "../../../../model/ui/types/DataGridContextType";
import { api } from "../../../../core/api";

function DataVaultCustomRowActionsComponent({
  onUpdate,
  onDelete,
}: DataGridRowActionsProps<FileUpload>) {
  let { record } = useContext<DataGridRowContextType<FileUpload>>(
    DataGridRowContext
  );
  const { editingId } = useContext<DataGridContextType<FileUpload>>(
    DataGridContext
  );
  return (
    <React.Fragment>
      {record && editingId !== record.id && (
        <a
          href={api.dataVault.getFileUrl(record)}
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

export default DataVaultCustomRowActionsComponent;
