import React from "react";

import {Badge} from "antd";
import {Rule} from "antd/lib/form";
import {NamePath} from "antd/lib/form/interface";

import styles from '../DataGrid.module.scss';

import {getValue, isStringOrNumber} from "../../../../core/Utils";
import {DataGridCellTypeEnum} from "../../../../model/ui/enums/DataGridCellTypeEnum";
import {
  DataGridCellDateType,
  DataGridCellLinkType,
  DataGridCellOptionsType,
  DataIndex,
} from "../../../../model/ui/types/DataGridTypes";
import DatePickerComponent from "../../date-picker/DatePicker";
import DataGridCellEditableComponent from "./DataGridCellEditable";
import DataGridCellLinkComponent from "./DataGridCellLink";
import {Input} from 'antd';

const {TextArea} = Input;

export interface DataGridCellProps<T>
  extends React.HTMLAttributes<HTMLElement> {
  record: T;
  dataIndex: DataIndex;
  editing?: boolean;
  editable?: boolean;
  cellType?: DataGridCellTypeEnum;
  rules?: Array<Rule>;
  options?: DataGridCellOptionsType;
  hasFocus?: boolean;
  link?: DataGridCellLinkType<T>;
  date?: DataGridCellDateType;
  wrap?: boolean;
  dependencies?: NamePath[];
  custom?: any;
}

function DataGridCellComponent<T extends AnyRecord>({
                                                      record,
                                                      editing = false,
                                                      editable = false,
                                                      cellType = DataGridCellTypeEnum.TEXT,
                                                      dataIndex,
                                                      rules,
                                                      options,
                                                      hasFocus,
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
  const formDataIndex =
    Array.isArray(dataIndex)
      ? dataIndex.slice(0, dataIndex.length - 1)
      : dataIndex;
  const useCustomSelect =
    !isStringOrNumber(dataIndex);

  let cellValue = getValue(record, dataIndex);

  if (cellType === DataGridCellTypeEnum.DATE) {
    cellValue = (
      <DatePickerComponent
        inputFormat={date.inputFormat}
        format={date.format}
        picker={date.pickerType}
        readOnly
        value={cellValue}
      />
    );
  } else if (cellType === DataGridCellTypeEnum.CHECKBOX) {
    cellValue = cellValue ? (
      <Badge status="processing" text="Yes"/>
    ) : (
      <Badge status="default" text="No"/>
    );
  } else if (cellType === DataGridCellTypeEnum.TEXTAREA) {
    cellValue = <TextArea
      className={styles.textarea}
      autoSize
      value={cellValue}
    />
  } else if (
    (cellType === DataGridCellTypeEnum.OPTION ||
      cellType === DataGridCellTypeEnum.MULTIOPTION) &&
    options
  ) {
    let opts = options.values;
    if (cellType === DataGridCellTypeEnum.MULTIOPTION) {
      cellValue = getValue(record, formDataIndex);
      let valueIds = cellValue ? cellValue.map((val: any) => val[options.valueIndex]) : [];
      let activeOptions = opts.filter((value) => valueIds.includes(value[options.valueIndex]));
      cellValue = activeOptions.length ?
        <ul className={styles.multioptionCell}>
          {activeOptions.map((option, index) => (
            <li key={index}>
              {option[options.nameIndex]}
            </li>
          ))}
        </ul>
        : ''

    } else {
      cellValue = getValue(record, dataIndex);
      cellValue = cellValue ? opts.find((val: any) => val[options.valueIndex] === cellValue) : cellValue;
      cellValue = cellValue ? cellValue[options.nameIndex] : cellValue;
    }
  }

  const Wrapper = wrap ? 'td' : React.Fragment;

  return (
    <Wrapper {...restProps}>
      {editing && editable ? (
        <DataGridCellEditableComponent
          useCustomSelect={useCustomSelect}
          dataIndex={formDataIndex}
          record={record}
          cellType={cellType}
          rules={rules}
          options={options}
          hasFocus={hasFocus}
          date={date}
          dependencies={dependencies}
        />
      ) : (
        <>
          {url ? (
            <DataGridCellLinkComponent url={url} external={link?.external} target={link?.target}>
              {cellValue}
            </DataGridCellLinkComponent>
          ) : (
            cellValue
          )}
        </>
      )}
    </Wrapper>
  );
}

export default DataGridCellComponent;
