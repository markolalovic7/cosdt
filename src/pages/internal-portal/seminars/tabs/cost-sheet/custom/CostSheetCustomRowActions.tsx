import React, { useContext } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { api } from "../../../../../../core/api";

import { DataGridRowActionsProps } from "../../../../../../shared/components/datagrid/DataGridRowActions";
import DataGridRowActionsComponent from "../../../../../../shared/components/datagrid/DataGridRowActions";
import { SeminarCost } from "../../../../../../model/domain/classes/SeminarCost";
import {
  DataGridRowContext,
  DataGridRowContextType,
} from "../../../../../../model/ui/types/DataGridRowContextType";
import {
  DataGridContext,
  DataGridContextType,
} from "../../../../../../model/ui/types/DataGridContextType";

function CostSheetCustomRowActionsComponent({
  onUpdate,
  onDelete,
}: DataGridRowActionsProps<SeminarCost>) {
  let { record } = useContext<DataGridRowContextType<SeminarCost>>(
    DataGridRowContext
  );
  const { editingId } = useContext<DataGridContextType<SeminarCost>>(
    DataGridContext
  );
  return (
    <React.Fragment>
      {record?.attachedFile && editingId !== record.id && (
        <a
          href={api.seminarCost.getFileUrl(record.attachedFile)}
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

export default CostSheetCustomRowActionsComponent;
