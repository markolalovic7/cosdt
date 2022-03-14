import React, {useContext, useState} from "react";
import {Button, Modal} from "antd";
import {PlusOutlined, ExportOutlined} from "@ant-design/icons";

import styles from "../../../../../../shared/components/datagrid/DataGrid.module.scss";

import {ClassAttendee} from "../../../../../../model/domain/classes/ClassAttendee";
import {SeminarAttendee} from "../../../../../../model/domain/classes/SeminarAttendee";
import {
  DataGridContext,
  DataGridContextType,
} from "../../../../../../model/ui/types/DataGridContextType";
import DataGridModalComponent from "../../../../../../shared/components/datagrid/DataGridModal";
import MentorsDetailsForm from "./MentorForm";
import {useHistory} from "react-router";
import {Mentor} from "../../../../../../model/domain/classes/Mentor";


const {confirm} = Modal;

type StudentsCustomActionProps = {
  students: ClassAttendee;
  onCreate(rec:Mentor): Promise<void>;
  onDeleteSelected?(id: Array<number>): Promise<void>;
};

function MentorsCustomActionsComponent({
                                         students,
                                         onCreate,
                                         onDeleteSelected,
                                       }: StudentsCustomActionProps) {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const {selection, setSelection, filters, onResetAllFilters} = useContext<DataGridContextType<SeminarAttendee>>(DataGridContext);
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);

  const filterKeys = filters ? Object.keys(filters) : [];
  const hasFilters =
    filters &&
    filterKeys.map((key) => filters[key]).filter((val) => !!val).length > 0;
  let history = useHistory();
  const closeModal = () => {
    setShowAddModal(false);
  };

  function handleResetFilters() {
    let clear: CustomMap = {};
    filters &&
    Object.keys(filters).forEach((key) => {
      clear[key] = null;
    });
    onResetAllFilters(clear);
  }
  async function handleCreateMentor(mentor: Mentor) {
    if (onCreate) {
      try {
        await onCreate(mentor);
        setShowAddModal(false);
      } catch (e) { }
    } else setShowAddModal(false);
  }
  async function handleDelete() {
    confirm({
      title: "Warning",
      content:
        "This action deletes all selected records. Are you sure you want to continue?",
      onCancel: () => {
      },
      onOk: async () => {
        if (onDeleteSelected) {
          await onDeleteSelected(selection.map((sel) => sel.id));
        }
        setSelection([]);
      },
      okText: "Yes",
      cancelText: "No",
    });
  }

  return (
    <div className={styles.dataGridActions}>
      <div>
        {onDeleteSelected && (
          <Button
            onClick={handleDelete}
            disabled={!selection.length}
            type="link"
            danger
            className={styles.dataGridActionsButton}
          >
            Delete selected
          </Button>
        )}

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
        {onCreate && (
          <Button
            onClick={() => setShowAddModal(true)}
            type="primary"
            className={styles.dataGridActionsButton}
          >
            <PlusOutlined/> Add mentor
          </Button>
        )}
          <Button
            onClick={history.goBack}
            type="primary"
            className={styles.dataGridActionsButton}
          >
            <ExportOutlined/> Back
          </Button>
        {showAddModal && (
          <DataGridModalComponent
            title="Add new mentor"
            className="bigModal custom-modal"
            isLoading={actionInProgress}
            onClose={closeModal}
            destroyOnClose={true}
            onOk={()=>handleCreateMentor}
          >
            <MentorsDetailsForm
              onCreate={onCreate}
              attendee={students}
              actionInProgress={actionInProgress}
              setActionInProgress={setActionInProgress}
              onFinish={closeModal}
            />
          </DataGridModalComponent>
        )}
      </div>
    </div>
  );
}

export default MentorsCustomActionsComponent;
