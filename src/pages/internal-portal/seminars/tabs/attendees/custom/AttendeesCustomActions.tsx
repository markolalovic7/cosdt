import React, {useContext, useState} from "react";
import {useRouteMatch} from "react-router-dom";
import {Button, Modal} from "antd";
import {CloudDownloadOutlined, PlusOutlined} from "@ant-design/icons";

import {api} from "../../../../../../core/api";
import {SeminarAttendee} from "../../../../../../model/domain/classes/SeminarAttendee";
import {UserProfile} from "../../../../../../model/domain/classes/UserProfile";
import {DataGridContext, DataGridContextType,} from "../../../../../../model/ui/types/DataGridContextType";
import styles from "../../../../../../shared/components/datagrid/DataGrid.module.scss";
import UserPickerModal from "../../../../../../shared/components/user-picker/UserPickerModal";
import AttendeesHTMLEditorComponent from "./AttendeesHTMLEditor";
import {Seminar} from "../../../../../../model/domain/classes/Seminar";
import SuggestionModal from "./AttendeesSuggestionModal";
import AttendeesGroupStatusChangeModal from "./AttendeesGroupStatusChangeModal";
import {SeminarAttendeeStatusEnum} from "../../../../../../model/domain/enums/SeminarAttendeeStatusEnum";

const {confirm} = Modal;

type AttendeesCustomActionProps = {
  attendees: Array<SeminarAttendee>;
  onCreate(profiles?: Array<UserProfile>): Promise<void>;
  onDeleteSelected?(id: Array<number>): Promise<void>;
  onSendInvitations(
    invitationHtml: string,
    attendees: Array<SeminarAttendee>
  ): Promise<void>;
  onDownloadInvitations(attendees: Array<SeminarAttendee>): Promise<void>;
  onDownloadCertificatesZip(attendees: Array<SeminarAttendee>): Promise<void>;
  onSendCertificates(
    invitationHtml: string,
    attendees: Array<SeminarAttendee>
  ): Promise<void>;
  onSendSurveyLink(attendees: Array<SeminarAttendee>): Promise<void>;
  onGroupChange(attendees:Array<SeminarAttendee>, status:SeminarAttendeeStatusEnum):void
  seminar?: Seminar;
};

function AttendeesCustomActionsComponent({
                                           attendees,
                                           onCreate,
                                           onDeleteSelected,
                                           onSendInvitations,
                                           onSendCertificates,
                                           onSendSurveyLink,
                                           onDownloadInvitations,
                                           onDownloadCertificatesZip,
                                           seminar,
                                           onGroupChange
                                         }: AttendeesCustomActionProps) {
  const [showHtmlModal, setShowHtmlModal] = useState<"certificate" | "invitation">();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showSuggestModal, setShowSuggestModal] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);

  let {params} = useRouteMatch<SeminarParams>();
  const seminarId = +params.seminarId;

  const {selection, setSelection, filters, onResetAllFilters} = useContext<DataGridContextType<SeminarAttendee>>(DataGridContext);

  const filterKeys = filters ? Object.keys(filters) : [];
  const hasFilters =
    filters &&
    filterKeys.map((key) => filters[key]).filter((val) => !!val).length > 0;

  async function handleCreateAttendee(profiles: Array<UserProfile>) {
    if (onCreate && profiles.length) {
      try {
        await onCreate(profiles);
        setShowAddModal(false);
        setShowSuggestModal(false);
      } catch (e) {
      }
    } else {
      setShowAddModal(false);
      setShowSuggestModal(false);
    }
  }

  async function handleDownloadCertificateZip() {
    try {
      await onDownloadCertificatesZip(selection);
      setShowAddModal(false);
    } catch (e) {
    }
  }

  async function handleDownloadInvitation() {
    try {
      await onDownloadInvitations(selection);
      setShowAddModal(false);
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

  async function handleSendInvitations(invitationHtml: string) {
    await onSendInvitations(invitationHtml, selection);
  }

  async function handleSendCertificates(invitationHtml: string) {
    await onSendCertificates(invitationHtml, selection);
  }

  async function handleSendSurveyLink() {
    await onSendSurveyLink(selection);
  }


  const handleGroupChange = (attendees:Array<SeminarAttendee>, status:SeminarAttendeeStatusEnum)=>{
    setShowStatusModal(false);
    onGroupChange(attendees, status)
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
        <Button
          onClick={handleDownloadCertificateZip}
          type="primary"
          className={styles.dataGridActionsButton}
          disabled={selection.length === 0 || !seminar?.locked}
        >
          Download certificates
        </Button>
        <Button
          onClick={handleDownloadInvitation}
          type="primary"
          className={styles.dataGridActionsButton}
          disabled={selection.length === 0}
        >
          Download invitations
        </Button>
        <Button
          onClick={() => setShowStatusModal(true)}
          type="primary"
          className={styles.dataGridActionsButton}
          disabled={selection.length === 0}
        >
          Change Status
        </Button>
        <Button
          onClick={() => setShowHtmlModal("invitation")}
          type="primary"
          className={styles.dataGridActionsButton}
          disabled={selection.length === 0}
        >
          Send invitations
        </Button>

        {seminar?.locked && (
          <>
            <Button
              onClick={handleSendSurveyLink}
              type="primary"
              className={styles.dataGridActionsButton}
              disabled={selection.length === 0}
            >
              Send survey link
            </Button>
          </>
        )}
        {onCreate && (
          <Button
            onClick={() => setShowAddModal(true)}
            type="primary"
            className={styles.dataGridActionsButton}
            disabled={seminar?.locked}
          >
            <PlusOutlined/> Add attendee
          </Button>
        )}
        {onCreate && (
          <Button
            onClick={() => setShowSuggestModal(true)}
            type="primary"
            className={styles.dataGridActionsButton}
            disabled={seminar?.locked}
          >
            <PlusOutlined/> Suggested Attendees
          </Button>
        )}
        <Button
          style={{marginRight: 0}}
          title="Download"
          type="default"
          className={styles.dataGridActionsButton}
          href={api.seminarAttendee.download(seminarId)}
          icon={<CloudDownloadOutlined/>}
        />
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
        {showSuggestModal && (
          <SuggestionModal
            multiple={true}
            onSelect={handleCreateAttendee}
            onClose={() => setShowSuggestModal(false)}
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
        {showHtmlModal === "invitation" && (
          <AttendeesHTMLEditorComponent
            onCancel={() => setShowHtmlModal(undefined)}
            onOk={handleSendInvitations}
            template="invitation"
          />
        )}
        {showHtmlModal === "certificate" && (
          <AttendeesHTMLEditorComponent
            onCancel={() => setShowHtmlModal(undefined)}
            onOk={handleSendCertificates}
            template="certificate"
          />
        )}
        <AttendeesGroupStatusChangeModal
          onClose={() => setShowStatusModal(false)}
          visible={showStatusModal}
          attendees={attendees}
          groupChangeStatus={(attendees, status) => handleGroupChange(attendees, status)}
        />
      </div>
    </div>
  );
}

export default AttendeesCustomActionsComponent;
