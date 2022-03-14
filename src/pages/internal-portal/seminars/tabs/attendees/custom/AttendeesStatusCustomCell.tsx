import React from "react";
import { getValue } from "../../../../../../core/Utils";
import { DataGridCellTypeEnum } from "../../../../../../model/ui/enums/DataGridCellTypeEnum";
import DataGridCellEditableComponent from "../../../../../../shared/components/datagrid/cells/DataGridCellEditable";
import DataGridCellLinkComponent from "../../../../../../shared/components/datagrid/cells/DataGridCellLink";
import { DataGridCellProps } from "../../../../../../shared/components/datagrid/cells/DataGridCell";

function AttendeesStatusCustomCell<T extends AnyRecord>({
  record,
  editing = false,
  editable = false,
  cellType = DataGridCellTypeEnum.MULTIOPTION,
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
  if (!dataIndex || !record) return <td {...restProps}>{children}</td>;
  const url =
  link && typeof link?.url === "function"
    ? link?.url(record)
    : (link?.url as string);

  let rawValue = getValue(record, dataIndex);
  let cellValue = rawValue;
  const Wrapper = wrap ? "td" : React.Fragment;

  if(options) {
    let opts = options.values;
    cellValue = cellValue ? opts.find((val: any) => val[options.valueIndex] === cellValue) : cellValue;
    cellValue = cellValue ? cellValue[options.nameIndex] : cellValue;
  }

  return (
    <Wrapper {...restProps}>
      {editing && editable ? (
        <DataGridCellEditableComponent
          useCustomSelect={false}
          dataIndex={dataIndex}
          record={record}
          cellType={cellType}
          rules={rules}
          options={options}
          date={date}
          dependencies={dependencies}
        />
      ) : (
        <>
          {url ? (
            <DataGridCellLinkComponent url={url} external={link?.external}>
              {cellValue}
            </DataGridCellLinkComponent>
          ) : (
            <span className={rawValue}>{cellValue}</span>
          )}
        </>
      )}
    </Wrapper>
  );
}

export default AttendeesStatusCustomCell;
