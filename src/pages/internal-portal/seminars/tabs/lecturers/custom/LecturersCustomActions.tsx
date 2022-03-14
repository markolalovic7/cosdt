import React, {useContext} from "react";
import {Button} from "antd";

import {
  DataGridContext,
  DataGridContextType,
} from "../../../../../../model/ui/types/DataGridContextType";
import styles from "../../../../../../shared/components/datagrid/DataGrid.module.scss";
import {Seminar} from "../../../../../../model/domain/classes/Seminar";
import {SeminarLecturer} from "../../../../../../model/domain/classes/SeminarLecturer";


type LecturersCustomActionProps = {
  lecturers: Array<SeminarLecturer>;
  onDownloadCertificates(
    attendees: Array<SeminarLecturer>
  ): Promise<void>;
  seminar?: Seminar;
};

function LecturersCustomActionsComponent({
                                           onDownloadCertificates,
                                           seminar,
                                         }: LecturersCustomActionProps) {
  const {selection, setSelection, filters, onResetAllFilters} = useContext<DataGridContextType<SeminarLecturer>>(DataGridContext);

  const filterKeys = filters ? Object.keys(filters) : [];
  const hasFilters =
    filters &&
    filterKeys.map((key) => filters[key]).filter((val) => !!val).length > 0;

  async function handleDownloadCertificates() {
    try {
      await onDownloadCertificates(selection);
    } catch (e) {
    }
  }

  function handleResetFilters() {
    let clear: CustomMap = {};
    filters &&
    Object.keys(filters).forEach((key) => {
      clear[key] = null;
    });
    onResetAllFilters(clear);
  }


  return (
    <div className={styles.dataGridActions}>
      <div>
        {onResetAllFilters && filters && (
          <Button
            onClick={handleResetFilters}
            type="link"
            disabled={!hasFilters}
            className={styles.dataGridActionsButton}
          >
            Reset filters
          </Button>
        )}
      </div>
      <div>
        {!seminar?.locked &&
        (<>
          <Button
            onClick={handleDownloadCertificates}
            type="primary"
            className={styles.dataGridActionsButton}
            disabled={selection.length === 0}
          >
            Download certificates
          </Button>
        </>)
        }
      </div>
    </div>
  );
}

export default LecturersCustomActionsComponent;
