import React, { useContext, useEffect } from 'react';
import { Button } from 'antd';
import styles from '../datagrid/DataGrid.module.scss';
import { DataGridContext, DataGridContextType } from '../../../model/ui/types/DataGridContextType';
import { UserProfile } from '../../../model/domain/classes/UserProfile';

export interface UserPickerModalActionsProps {
    defaultUsers: Array<UserProfile>;
    onSelect?(users: Array<UserProfile>): void;
    onClose?() : void;
    okText?: string;
    cancelText?: string;
}

function UserPickerModalActionsComponent({
    defaultUsers,
    onSelect,
    onClose,
    okText,
    cancelText
  }: UserPickerModalActionsProps) {

    useEffect(() => {
        setSelection(defaultUsers);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const {
        selection,
        setSelection
    } = useContext<DataGridContextType<UserProfile>>(DataGridContext);

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


export default UserPickerModalActionsComponent;