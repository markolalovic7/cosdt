import React from "react";
import { Seminar } from "../../../../model/domain/classes/Seminar";
import { DataGridCellProps } from "../../../../shared/components/datagrid/cells/DataGridCell";

function SeminarsParticipantsCustomCell({
  record,
}: DataGridCellProps<Seminar>) {
  return (
    <ul>
      {record.attendedCount > 0 && <li>Attended: {record.attendedCount}</li> }
      {record.certifiedCount > 0 && <li>Certified: {record.certifiedCount}</li> }
      {record.invitedCount > 0 && <li>Invited: {record.invitedCount}</li> }
      {record.notInvitedCount > 0 && <li>Not invited: {record.notInvitedCount}</li>}
      {record.registeredCount > 0 && <li>Registered: {record.registeredCount}</li>}
    </ul>
  );
}

export default SeminarsParticipantsCustomCell;
