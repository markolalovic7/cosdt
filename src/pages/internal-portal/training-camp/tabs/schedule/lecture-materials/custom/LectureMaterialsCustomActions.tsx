import React, { useState } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import styles from "../../../../../../../shared/components/datagrid/DataGrid.module.scss";

import { ClassLectureFile } from "../../../../../../../model/domain/classes/ClassLectureFile";
import { DataGridActionsProps } from "../../../../../../../shared/components/datagrid/DataGridActions";
import LectureMaterialsTabDetails from "../LectureMaterialsTabDetails";

function LectureMaterialsCustomActionsComponent<RecordType extends AnyRecord>({
  onCreate
}: DataGridActionsProps<RecordType>) {
  const [modal, setModal] = useState<boolean>(false);

  return (
    <div className={styles.dataGridActions}>
      <div>
      </div>
      <div>
        <Button
          onClick={() => setModal(true)}
          type="primary"
          className={styles.dataGridActionsButton}
        >
          <PlusOutlined /> Add
        </Button>
        {modal && onCreate && (
          <LectureMaterialsTabDetails
            record={new ClassLectureFile()}
            onOk={onCreate}
            onCancel={() => setModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default LectureMaterialsCustomActionsComponent;
