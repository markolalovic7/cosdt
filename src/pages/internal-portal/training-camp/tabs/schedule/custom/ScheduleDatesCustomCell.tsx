import React from "react";
import moment from "moment";

import { DefaultDateFormat, DefaultTimeFormat, getValue } from "../../../../../../core/Utils";
import { DataGridCellTypeEnum } from "../../../../../../model/ui/enums/DataGridCellTypeEnum";
import { DataGridCellProps } from "../../../../../../shared/components/datagrid/cells/DataGridCell";
import { ClassLectureInstance } from "../../../../../../model/domain/classes/ClassLectureInstance";

function ScheduleDatesCustomCell<T extends AnyRecord>({
  record,
  editing = false,
  editable = false,
  cellType = DataGridCellTypeEnum.TEXT,
  dataIndex,
  rules,
  options,
  link,
  date = {
    pickerType: "date",
  },
  children,
  wrap = true,
  dependencies,
  ...restProps
}: DataGridCellProps<T>) {
  let lectureInstances: Array<ClassLectureInstance> = getValue(record, dataIndex) || [];
  let sortedDates = lectureInstances.map(lectureInstance => ({
    start: moment(lectureInstance.start),
    end: moment(lectureInstance.end)
  }))

  sortedDates.sort((a, b) => b.start.isBefore(a.start) ? 1 : 0);

  return (
    <React.Fragment {...restProps}>
      <ul style={{ listStyle: 'none', padding: "0 5px" }}>
        {sortedDates.map((date, index) => (
          <li key={index}>
            {date.start.format(DefaultDateFormat)} {date.start.format(DefaultTimeFormat)} - {date.end.format(DefaultTimeFormat)}
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
}

export default ScheduleDatesCustomCell;
