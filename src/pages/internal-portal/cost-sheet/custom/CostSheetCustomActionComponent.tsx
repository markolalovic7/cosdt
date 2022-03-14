import React, {useContext} from "react";
import {DataGridContext, DataGridContextType} from "../../../../model/ui/types/DataGridContextType";
import {SeminarAttendee} from "../../../../model/domain/classes/SeminarAttendee";
import styles from "../../../../shared/components/datagrid/DataGrid.module.scss";
import {Button} from "antd";

interface CostSheetCustomActionComponentProps {
  onDownloadReport(selection:Array<number>):void
}

const CostSheetCustomActionComponent = ({onDownloadReport}:CostSheetCustomActionComponentProps) => {


  const {selection, setSelection} = useContext<DataGridContextType<SeminarAttendee>>(DataGridContext);


  async function handleListDownload() {
    onDownloadReport && await onDownloadReport(selection.map((sel) => sel.id))
  }

  return (
    <div className={styles.dataGridActions}>
      <div>

      </div>
      <div>
        <div>
          <Button
            onClick={handleListDownload}
            disabled={!selection.length}
            type="primary"
            className={styles.dataGridActionsButton}
          >
            Export Report
          </Button>
        </div>
      </div>
    </div>
  )
};
export default CostSheetCustomActionComponent
