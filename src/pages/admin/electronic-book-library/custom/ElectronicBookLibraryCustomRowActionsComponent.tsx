import React, { useContext } from "react";
import { DownloadOutlined } from "@ant-design/icons";

import { api } from "../../../../core/api";
import DataGridRowActionsComponent, {
  DataGridRowActionsProps,
} from "../../../../shared/components/datagrid/DataGridRowActions";
import {
  DataGridRowContext,
  DataGridRowContextType,
} from "../../../../model/ui/types/DataGridRowContextType";
import {
  DataGridContext,
  DataGridContextType,
} from "../../../../model/ui/types/DataGridContextType";
import { ElectronicBookLibrary } from "../../../../model/domain/classes/ElectronicBookLibrary";

function ElectronicBookLibraryCustomRowActionsComponent({
  onUpdate,
  onDelete,
}: DataGridRowActionsProps<ElectronicBookLibrary>) {
  let { record } = useContext<DataGridRowContextType<ElectronicBookLibrary>>(
    DataGridRowContext
  );
  const { editingId } = useContext<DataGridContextType<ElectronicBookLibrary>>(
    DataGridContext
  );
  return (
    <React.Fragment>
      <div className="row-actions-width-3">
        {record?.file && editingId !== record.id && (
          <a
            href={api.eBook.getFileUrl(record.file)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginRight: 4 }}
          >
            <DownloadOutlined />
          </a>
        )}
        <DataGridRowActionsComponent onUpdate={onUpdate} onDelete={onDelete} />
      </div>
    </React.Fragment>
  );
}

export default ElectronicBookLibraryCustomRowActionsComponent;
