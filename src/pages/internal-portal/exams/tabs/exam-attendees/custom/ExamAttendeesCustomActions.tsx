import React, { useContext, useState } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { ExamAttendee } from "../../../../../../model/domain/classes/ExamAttendee";
import { UserProfile } from "../../../../../../model/domain/classes/UserProfile";
import {
  DataGridContext,
  DataGridContextType,
} from "../../../../../../model/ui/types/DataGridContextType";
import styles from "../../../../../../shared/components/datagrid/DataGrid.module.scss";
import UserPickerModal from "../../../../../../shared/components/user-picker/UserPickerModal";

const { confirm } = Modal;

type ExamAttendeesCustomActionProps = {
  attendees: Array<ExamAttendee>;
  onCreate(profiles?: Array<UserProfile>): Promise<void>;
  onDeleteSelected?(id: Array<number>): Promise<void>;
  onSendInvitations(
    attendees: Array<ExamAttendee>
  ): Promise<void>;
};

function ExamAttendeesCustomActionsComponent({
  attendees,
  onCreate,
  onDeleteSelected,
  onSendInvitations
}: ExamAttendeesCustomActionProps) {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const { selection, setSelection, filters, onResetAllFilters } = useContext<
    DataGridContextType<ExamAttendee>
  >(DataGridContext);

  const filterKeys = filters ? Object.keys(filters) : [];
  const hasFilters =
    filters &&
    filterKeys.map((key) => filters[key]).filter((val) => !!val).length > 0;

  async function handleCreateAttendee(profiles: Array<UserProfile>) {
    if (onCreate && profiles.length) {
      try {
        await onCreate(profiles);
        setShowAddModal(false);
      } catch (e) {}
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
      onCancel: () => {},
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

  async function handleSendInvitations() {
    await onSendInvitations(selection);
    setSelection([]);
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
        <Button
          onClick={handleSendInvitations}
          type="primary"
          className={styles.dataGridActionsButton}
          disabled={selection.length === 0}
        >
          Send invitations
        </Button>
        {onCreate && (
          <Button
            onClick={() => setShowAddModal(true)}
            type="primary"
            className={styles.dataGridActionsButton}
          >
            <PlusOutlined /> Add attendee
          </Button>
        )}
        {showAddModal && (
          <UserPickerModal
            multiple={true}
            onSelect={handleCreateAttendee}
            onClose={() => setShowAddModal(false)}
            apiParams={
              attendees.length > 0
                ? {
                    "id.notIn": attendees
                      .map((attendee) => attendee.profile.id)
                      .join(","),
                  }
                : undefined
            }
            title="Pick attendee"
            okText={"Add"}
          />
        )}
      </div>
    </div>
  );
}

export default ExamAttendeesCustomActionsComponent;
