import React, { useContext, useState } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import styles from "../../../../../../shared/components/datagrid/DataGrid.module.scss";

import { UserProfile } from "../../../../../../model/domain/classes/UserProfile";
import { ClassAttendee } from "../../../../../../model/domain/classes/ClassAttendee";
import { SeminarAttendee } from "../../../../../../model/domain/classes/SeminarAttendee";
import { Class } from "../../../../../../model/domain/classes/Class";
import {
  DataGridContext,
  DataGridContextType,
} from "../../../../../../model/ui/types/DataGridContextType";
import UserPickerModal from "../../../../../../shared/components/user-picker/UserPickerModal";

const { confirm } = Modal;

type StudentsCustomActionProps = {
  students: Array<ClassAttendee>;
  onCreate(profiles: Array<UserProfile>): Promise<void>;
  onDeleteSelected?(id: Array<number>): Promise<void>;
  classRec?: Class;
};

function StudentsCustomActionsComponent({
  students,
  onCreate,
  onDeleteSelected,
}: StudentsCustomActionProps) {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const { selection, setSelection, filters, onResetAllFilters } = useContext<
    DataGridContextType<SeminarAttendee>
  >(DataGridContext);

  const filterKeys = filters ? Object.keys(filters) : [];
  const hasFilters =
    filters &&
    filterKeys.map((key) => filters[key]).filter((val) => !!val).length > 0;

  async function handleCreateStudent(profiles: Array<UserProfile>) {
    if (onCreate && profiles.length) {
      try {
        await onCreate(profiles);
        setShowAddModal(false);
      } catch (e) { }
    } else setShowAddModal(false);
  }

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
      onCancel: () => { },
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
            <PlusOutlined /> Add student
          </Button>
        )}
        {showAddModal && (
          <UserPickerModal
            multiple={true}
            onSelect={handleCreateStudent}
            onClose={() => setShowAddModal(false)}
            apiParams={
              students.length > 0
                ? {
                  "id.notIn": students
                    .map((student) => student.profile.id)
                    .join(","),
                }
                : undefined
            }
            title="Pick student"
            okText={"Add"}
          />
        )}
      </div>
    </div>
  );
}
export default StudentsCustomActionsComponent;
