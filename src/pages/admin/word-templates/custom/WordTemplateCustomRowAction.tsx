import React, { useContext, useState } from "react";
import { Button, Tooltip } from "antd";
import { DownloadOutlined, EditOutlined } from "@ant-design/icons";

import { api } from "../../../../core/api";

import {
  DataGridRowContext,
  DataGridRowContextType,
} from "../../../../model/ui/types/DataGridRowContextType";
import { WordTemplate } from "../../../../model/domain/classes/WordTemplate";
import WordTemplatesDetailsPage from "../WordTemplatesDetailsPage";
import { DataGridRowActionsProps } from "../../../../shared/components/datagrid/DataGridRowActions";

function WordTemplateCustomRowActionsComponent({
  onUpdate,
}: DataGridRowActionsProps<WordTemplate>) {
  let { record } = useContext<DataGridRowContextType<WordTemplate>>(
    DataGridRowContext
  );
  const [modal, setModal] = useState<boolean>(false);

  return (
    <React.Fragment>
      <div className="row-actions-width-2">
        <Tooltip title="Edit Template" overlay={false}>
          <Button
            onClick={() => setModal(true)}
            type="link"
            icon={<EditOutlined />}
          />
        </Tooltip>
        {record && (
          <a
            href={api.wordTemplate.getFileUrl(record)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginRight: 4 }}
          >
            <DownloadOutlined />
          </a>
        )}
        {modal && onUpdate && (
          <WordTemplatesDetailsPage
            record={record}
            onOk={onUpdate}
            onCancel={() => setModal(false)}
          />
        )}
      </div>
    </React.Fragment>
  );
}

export default WordTemplateCustomRowActionsComponent;
