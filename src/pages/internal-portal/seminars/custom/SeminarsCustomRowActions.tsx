import React, {useContext} from "react";
import {Button, Popconfirm} from "antd";
import {DownloadOutlined} from "@ant-design/icons";

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
import {Seminar} from "../../../../model/domain/classes/Seminar";
import {RetweetOutlined} from "@ant-design/icons/lib";

interface SeminarsCustomRowActionsProps extends DataGridRowActionsProps<Seminar> {
  onDownload(seminarId: number): Promise<void>;

  onDuplicate(seminarId: number): Promise<void>;

}

function SeminarsCustomRowActionsComponent({
                                             onUpdate,
                                             onDelete,
                                             onDownload,
                                             onDuplicate,
                                           }: SeminarsCustomRowActionsProps) {
  const {record} = useContext<DataGridRowContextType<Seminar>>(
    DataGridRowContext
  );
  const {editingId} = useContext<DataGridContextType<Seminar>>(
    DataGridContext
  );

  return (
    <React.Fragment>
      <div className="row-actions-width-3">
        {editingId !== record.id && (
          <React.Fragment>
            {/* <Switch
            onChange={() => onLock(record)}
            title={"Lock / Unlock"}
            checked={record.locked}
            checkedChildren={<LockOutlined />}
            unCheckedChildren={<UnlockOutlined />}
          /> */}
            <Button
              onClick={() => onDownload(record.id)}
              icon={<DownloadOutlined/>}
              type="link"
              style={{marginRight: 4}}
              title={"Download PDF"}
            >Poziv</Button>
            <Popconfirm placement="topLeft"
                        title={`Da li ste sigurni da želite da kopirate seminar ${record.name}?`}
                        onConfirm={() => onDuplicate(record.id)}
                        okText="Da"
                        cancelText="Ne">
              <Button
                //onClick={() => onDownload(record.id)}
                icon={<RetweetOutlined/>}
                type="link"
                style={{marginRight: 4}}
                title={"onDuplicate"}
              >Kopiraj</Button>
            </Popconfirm>
          </React.Fragment>
        )}
        <DataGridRowActionsComponent onUpdate={onUpdate} onDelete={onDelete}/>
      </div>
    </React.Fragment>
  );
}

export default SeminarsCustomRowActionsComponent;
