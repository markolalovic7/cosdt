import React, { useContext, useState } from "react";
import { Button, Tooltip } from "antd";
import { DownloadOutlined, EditOutlined } from "@ant-design/icons";

import { api } from "../../../../../../../core/api";
import { ClassLectureFile } from "../../../../../../../model/domain/classes/ClassLectureFile";
import {
  DataGridRowContext,
  DataGridRowContextType,
} from "../../../../../../../model/ui/types/DataGridRowContextType";
import DataGridRowActionsComponent, { DataGridRowActionsProps } from "../../../../../../../shared/components/datagrid/DataGridRowActions";
import LectureMaterialsTabDetails from "../LectureMaterialsTabDetails";

function LectureMaterialsCustomRowAction({ onUpdate, onDelete }: DataGridRowActionsProps<ClassLectureFile>) {

  let { record } = useContext<DataGridRowContextType<ClassLectureFile>>(
    DataGridRowContext
  );
  const [modal, setModal] = useState<boolean>(false);

  return (
    <React.Fragment>
      {record && (
        <a
          href={api.classLectureMaterial.getFileUrl(record)}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginRight: 4 }}
        >
          <DownloadOutlined />
        </a>
      )}
      <Tooltip title="Edit material" overlay={false}>
        <Button
          onClick={() => setModal(true)}
          type="link"
          icon={<EditOutlined />}
        />
      </Tooltip>
      <DataGridRowActionsComponent onDelete={onDelete} />
      {modal && onUpdate && (
        <LectureMaterialsTabDetails
          record={record}
          onOk={onUpdate}
          onCancel={() => setModal(false)}
        />
      )}
    </React.Fragment>
  );
}

export default LectureMaterialsCustomRowAction;
