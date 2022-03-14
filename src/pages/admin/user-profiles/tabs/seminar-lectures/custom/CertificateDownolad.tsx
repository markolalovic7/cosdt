import React, {useContext} from "react";
import {Button} from "antd";

import {
    DataGridContext,
    DataGridContextType,
} from "../../../../../../model/ui/types/DataGridContextType";
import styles from "../../../../../../shared/components/datagrid/DataGrid.module.scss";
import {SeminarLecturer} from "../../../../../../model/domain/classes/SeminarLecturer";


type LecturersCustomActionProps = {
    onDownloadCertificates(seminarId:Array<number>): Promise<void>;
};

function CertificateDownloadActionsComponent({
                                             onDownloadCertificates,
                                         }: LecturersCustomActionProps) {
    const {selection, setSelection, filters, onResetAllFilters} = useContext<DataGridContextType<SeminarLecturer>>(DataGridContext);

    const filterKeys = filters ? Object.keys(filters) : [];
    const hasFilters =
        filters &&
        filterKeys.map((key) => filters[key]).filter((val) => !!val).length > 0;

    async function handleDownloadCertificates() {
        try {
            await onDownloadCertificates(selection.map(item=>+item.id));
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
                <>
                    <Button
                        onClick={handleDownloadCertificates}
                        type="primary"
                        className={styles.dataGridActionsButton}
                        disabled={selection.length === 0}
                    >
                        Download certificates
                    </Button>
                </>
            </div>
        </div>
    );
}

export default CertificateDownloadActionsComponent;
