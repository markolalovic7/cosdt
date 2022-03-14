import React, { useContext, useState } from "react";
import { Button, Tooltip } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { DownloadOutlined } from "@ant-design/icons";

import { SeminarAttendee } from "../../../../../../model/domain/classes/SeminarAttendee";
import {
  DataGridRowContext,
  DataGridRowContextType,
} from "../../../../../../model/ui/types/DataGridRowContextType";
import DataGridRowActionsComponent from "../../../../../../shared/components/datagrid/DataGridRowActions";
import AttendeesHTMLEditorComponent from "./AttendeesHTMLEditor";
import { Seminar } from "../../../../../../model/domain/classes/Seminar";
import {FileUnknownOutlined} from "@ant-design/icons/lib";
import {Link} from "react-router-dom";

interface AttendeesCustomRowActionsProps<T> {
  onUpdate?(row: T): Promise<void>;
  onDelete?(id: number): void;
  onSendInvitation(
    invitationHtml: string,
    attendees: Array<SeminarAttendee>
  ): Promise<void>;
  onSendCertificates(
    invitationHtml: string,
    attendees: Array<SeminarAttendee>
  ): Promise<void>;
  onDownloadCertificates(
    attendees: Array<SeminarAttendee>
  ): Promise<void>;
  seminar?: Seminar;
}

function AttendeesCustomRowActionsComponent({
  onUpdate,
  onDelete,
  onSendInvitation,
  onSendCertificates,
  onDownloadCertificates,
  seminar,
}: AttendeesCustomRowActionsProps<SeminarAttendee>) {
  const [showHtmlModal, setShowHtmlModal] = useState<
    "certificate" | "invitation" | "download"
  >();
  let { record } = useContext<DataGridRowContextType<SeminarAttendee>>(
    DataGridRowContext
  );

  async function handleSendInvitation(invitationHtml: string) {
    await onSendInvitation(invitationHtml, [record]);
  }

  async function handleSendCertificates(invitationHtml: string) {
    await onSendCertificates(invitationHtml, [record]);
  }
  async function handleDownloadCertificates() {
    await onDownloadCertificates([record]);
  }
  return (
    <React.Fragment>
      <Tooltip title="Take survey">
        <Link to={`attendees/survey/${record.profile.id}`}>
        <Button
          onClick={()=>console.log(record)}
          type="link"
          icon={<FileUnknownOutlined />}
        />
        </Link>
      </Tooltip>
      <Tooltip title="Send invitation">
        <Button
          onClick={() => setShowHtmlModal("invitation")}
          type="link"
          icon={<UserAddOutlined />}
        />
      </Tooltip>
      <Tooltip title="Download certificate">
        <Button
          onClick={() => handleDownloadCertificates()}
          type="link"
          icon={<DownloadOutlined />}
          disabled={!seminar?.locked}
        />
      </Tooltip>
      <DataGridRowActionsComponent onUpdate={onUpdate} onDelete={onDelete} />
      {showHtmlModal === "invitation" && (
        <AttendeesHTMLEditorComponent
          onCancel={() => setShowHtmlModal(undefined)}
          onOk={handleSendInvitation}
          userName={record.profile.username}
          template="invitation"
        />
      )}
      {showHtmlModal === "certificate" && (
        <AttendeesHTMLEditorComponent
          onCancel={() => setShowHtmlModal(undefined)}
          onOk={handleSendCertificates}
          userName={record.profile.username}
          template="certificate"
        />
      )}
      {showHtmlModal === "download" && (
        <AttendeesHTMLEditorComponent
          onCancel={() => setShowHtmlModal(undefined)}
          onOk={handleDownloadCertificates}
          userName={record.profile.username}
          template="certificate"
          confirmText={"Download"}
        />
      )}
    </React.Fragment>
  );
}

export default AttendeesCustomRowActionsComponent;
