import React, { useContext } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import { api } from "../../../../core/api";
import { FileUpload } from "../../../../model/domain/classes/FileUpload";
import {
  DataGridRowContext,
  DataGridRowContextType,
} from "../../../../model/ui/types/DataGridRowContextType";

function ReportsCustomRowActions() {
  let { record } = useContext<DataGridRowContextType<FileUpload>>(
    DataGridRowContext
  );

  return (
    <a
      href={api.report.getReportsUrl(record.id)}
      target="_blank"
      rel="noopener noreferrer"
      style={{ marginRight: 4 }}
      title="Run report"
    >
      <PlayCircleOutlined />
    </a>
  );
}

export default ReportsCustomRowActions;
