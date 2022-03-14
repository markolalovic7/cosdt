import React, { useContext, useEffect } from 'react';
import { Button } from 'antd';
import styles from '../../../../../../shared/components/datagrid/DataGrid.module.scss';
import {SeminarAtendeeRecommendation} from "../../../../../../model/domain/classes/SeminarAtendeeRecommendation";
import {DataGridContext, DataGridContextType} from "../../../../../../model/ui/types/DataGridContextType";

export interface UserPickerModalActionsProps {
  defaultUsers: Array<SeminarAtendeeRecommendation>;
  onSelect?(users: Array<SeminarAtendeeRecommendation>): void;
  onClose?() : void;
  okText?: string;
  cancelText?: string;
}

function AttendeesSuggestionModalActionsComponent({
                                           defaultUsers,
                                           onSelect,
                                           onClose,
                                           okText,
                                           cancelText
                                         }: UserPickerModalActionsProps) {

  useEffect(() => {
    setSelection(defaultUsers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    selection,
    setSelection
  } = useContext<DataGridContextType<SeminarAtendeeRecommendation>>(DataGridContext);


  function handleSelect() {
    onSelect && onSelect(selection);
  }

  return (
    <div className={`${styles.dataGridActions} ${styles.dataGridActionsNo}`}>
      <div>
        {onClose &&
        <Button onClick={onClose} type="default" className={styles.dataGridActionsButton}>
          {cancelText}
        </Button>
        }
      </div>
      <div>
        {onSelect &&
        <Button onClick={handleSelect} type="primary" className={styles.dataGridActionsButton}>
          {okText}
        </Button>
        }
      </div>
    </div>
  );
}


export default AttendeesSuggestionModalActionsComponent;
