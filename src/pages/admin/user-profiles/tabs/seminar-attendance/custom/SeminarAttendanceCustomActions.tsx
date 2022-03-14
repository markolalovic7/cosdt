import React, {useContext} from "react";
import {Button} from "antd";

import {
  DataGridContext,
  DataGridContextType,
} from "../../../../../../model/ui/types/DataGridContextType";
import styles from "../../../../../../shared/components/datagrid/DataGrid.module.scss";
import {UserSeminar} from "../../../../../../model/domain/classes/UserSeminar";



type LecturersCustomActionProps = {
  seminars: Array<UserSeminar>;
  onDownloadCertificates(
    seminars: Array<UserSeminar>
  ): Promise<void>;
};

function SeminarAttendanceCustomComponent({
                                            onDownloadCertificates,
                                          }: LecturersCustomActionProps) {
  const {selection, filters, onResetAllFilters} = useContext<DataGridContextType<UserSeminar>>(DataGridContext);
  const filterKeys = filters ? Object.keys(filters) : [];
  const hasFilters =
    filters &&
    filterKeys.map((key) => filters[key]).filter((val) => !!val).length > 0;

  async function handleDownloadCertificates() {
    await onDownloadCertificates(selection);
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
    <>
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
          <>
            <Button
              onClick={() => handleDownloadCertificates()}
              type="primary"
              className={styles.dataGridActionsButton}
              disabled={selection.length === 0}
            >
              Preuzimanje sertifikata
            </Button>
          </>
        </div>
      </div>
    </>
  );
}

export default SeminarAttendanceCustomComponent;
