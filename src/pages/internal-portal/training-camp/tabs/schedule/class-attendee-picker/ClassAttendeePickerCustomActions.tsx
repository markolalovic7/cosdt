import { useContext, useEffect } from "react";
import { ClassAttendee } from "../../../../../../model/domain/classes/ClassAttendee";
import { DataGridContext, DataGridContextType } from "../../../../../../model/ui/types/DataGridContextType";

type ClassAttendeePickerCustomActionsProps = {
  attendees: Array<ClassAttendee>;
  onSelectionChange(attendees: Array<ClassAttendee>): void;
};

function ClassAttendeePickerCustomActionsComponent({
  attendees,
  onSelectionChange,
}: ClassAttendeePickerCustomActionsProps) {
  const { selection, setSelection } = useContext<
    DataGridContextType<ClassAttendee>
  >(DataGridContext);

  useEffect(() => {
    setSelection(attendees);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onSelectionChange(selection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection]);

  return null;
}

export default ClassAttendeePickerCustomActionsComponent;
