import React, {useContext, useState} from "react";
import {Button, Modal} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import {ExamAttendee} from "../../../../../../model/domain/classes/ExamAttendee";
import {
  DataGridContext,
  DataGridContextType,
} from "../../../../../../model/ui/types/DataGridContextType";
import styles from "../../../../../../shared/components/datagrid/DataGrid.module.scss";
import {ClassAttendee} from "../../../../../../model/domain/classes/ClassAttendee";
import AddGradeModal from "./AddGradeModal";
import {DiaryGrades} from "../../../../../../model/domain/classes/DiaryGrades";
import {useRouteMatch} from "react-router";

const {confirm} = Modal;

type ExamAttendeesCustomActionProps = {
  attendees: Array<ClassAttendee>;
  onCreate?(rec: ClassAttendee): Promise<void>;
  onDeleteSelected?(id: Array<number>): Promise<void>;
  addNewGrade(lectureId: number, lecturerId: number, resource: DiaryGrades): Promise<void>
};

function GradesAddCustomComponent({
                                    attendees,
                                    onCreate,
                                    onDeleteSelected,
                                    addNewGrade,
                                  }: ExamAttendeesCustomActionProps) {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const {selection, setSelection, filters, onResetAllFilters} = useContext<DataGridContextType<ExamAttendee>>(DataGridContext);

  const filterKeys = filters ? Object.keys(filters) : [];
  const hasFilters =
    filters &&
    filterKeys.map((key) => filters[key]).filter((val) => !!val).length > 0;

  let {params: routeParams} = useRouteMatch<UserProfileParams>();


  function handleResetFilters() {
    let clear: CustomMap = {};
    filters &&
    Object.keys(filters).forEach((key) => {
      clear[key] = null;
    });
    onResetAllFilters(clear);
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

  async function addGrades(lectureId: number, lecturerId: number, resource: DiaryGrades) {
    addNewGrade(lectureId, lecturerId, resource);
  }

  const handleOk = (value: DiaryGrades) => {
    addGrades(+routeParams.id, +routeParams.lectureId, value);
    setShowAddModal(false);

  };

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
            <PlusOutlined/> Add attendee
          </Button>
        )}
        {showAddModal && (
          <AddGradeModal
            attendees={attendees}
            closeModal={() => setShowAddModal(false)}
            handleOk={handleOk}
          />
        )}
      </div>
    </div>
  );
}

export default GradesAddCustomComponent;
