import React, { Key, useState } from "react";
import moment, { Moment } from "moment";

import { Button, Checkbox, Input, Radio, Space, DatePicker } from "antd";
import { FilterDropdownProps } from "antd/lib/table/interface";
import { RangeValue } from "rc-picker/lib/interface";
import { SearchOutlined } from "@ant-design/icons";

import styles from "../DataGrid.module.scss";

import { DataGridColumnType } from "../../../../model/ui/types/DataGridTypes";
import { DataGridCellTypeEnum } from "../../../../model/ui/enums/DataGridCellTypeEnum";
import { DataGridFilterTypeEnum } from "../../../../model/ui/enums/DataGridFilterTypeEnum";
import { DefaultDateFormat, RangePickerFormat } from "../../../../core/Utils";

const { RangePicker } = DatePicker;

interface DataGridFilterProps<T> {
  searchInputRef: React.RefObject<Input>;
  column: DataGridColumnType<T>;
}

function DataGridFilterComponent<T>({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  searchInputRef,
  column,
}: FilterDropdownProps & DataGridFilterProps<T>) {
  const [optionsSearchText, setOptionsSearchText] = useState<string>("");
  let pickerType;
  const cellType = column.cellType || DataGridCellTypeEnum.TEXT;
  let filterType = DataGridFilterTypeEnum.CONTAINS;
  let options: Array<any> = [];
  const columnOptions = column.options;
  if (columnOptions) {
    options = columnOptions.values
      .map((option: any) => ({
        value: `${option[columnOptions.valueIndex]}`,
        name: option[columnOptions.nameIndex],
      }))
      .filter((option) =>
        option.name?.toLowerCase().includes(optionsSearchText.toLowerCase())
      );
  }
  const handleDateRangeChange = (values: RangeValue<Moment>) => {
    const leftValue =
      values && values[0] ? values[0].format(RangePickerFormat) : "";
    const rightValue =
      values && values[1] ? values[1].format(RangePickerFormat) : "";
    let granulation = column.date?.pickerType || "day";
    setSelectedKeys([`${leftValue}|${rightValue}|${granulation}`]);
  };

  const getRangeValues = (value: Key): [Moment | null, Moment | null] => {
    let leftValue = null;
    let rightValue = null;
    if (value) {
      const range = value.toString().split("|");
      leftValue = range[0] ? moment(range[0], RangePickerFormat) : null;
      rightValue = range[0] ? moment(range[1], RangePickerFormat) : null;
    }
    return [leftValue, rightValue];
  };

  switch (cellType) {
    case DataGridCellTypeEnum.TEXT:
    case DataGridCellTypeEnum.NUMBER:
      filterType = DataGridFilterTypeEnum.CONTAINS;
      break;
    case DataGridCellTypeEnum.OPTION:
    case DataGridCellTypeEnum.MULTIOPTION:
      filterType = DataGridFilterTypeEnum.IN;
      break;
    case DataGridCellTypeEnum.CHECKBOX:
      filterType = DataGridFilterTypeEnum.EQUALS;
      break;
    case DataGridCellTypeEnum.DATE:
      filterType = DataGridFilterTypeEnum.RANGE;
      pickerType = column.date?.pickerType || "date";
      break;
  }

  return (
    <div style={{ padding: 8 }}>
      {filterType === DataGridFilterTypeEnum.CONTAINS && (
        <Input
          className={styles.filterInput}
          ref={searchInputRef}
          placeholder={`Pretraži`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm({ closeDropdown: true })}
        />
      )}
      {filterType === DataGridFilterTypeEnum.EQUALS && (
        <div className={styles.filterCheckbox}>
          <Radio.Group
            onChange={(e) => setSelectedKeys([e.target.value])}
            value={selectedKeys[0]}
          >
            <Radio value={true}>Da</Radio>
            <Radio value={false}>Ne</Radio>
          </Radio.Group>
        </div>
      )}
      {filterType === DataGridFilterTypeEnum.IN && (
        <div className={styles.filterOptions}>
          <Input
            className={styles.optionsSearch}
            value={optionsSearchText}
            placeholder={"Search..."}
            onChange={(e) => setOptionsSearchText(e.target.value)}
          />
          <Checkbox.Group
            className={styles.optionsGroup}
            value={selectedKeys}
            onChange={(values) =>
              setSelectedKeys(values.map((val) => val.toString()))
            }
          >
            {options.map((option, index) => (
              <Checkbox
                className={styles.option}
                key={index}
                value={option.value}
              >
                {option.name}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>
      )}
      {filterType === DataGridFilterTypeEnum.RANGE && (
        <div className={styles.filterCheckbox}>
          <RangePicker
            onChange={handleDateRangeChange}
            value={getRangeValues(selectedKeys[0])}
            picker={pickerType}
            format={pickerType === "date" ? DefaultDateFormat : undefined}
          />
        </div>
      )}
      <Space className={styles.filterActions}>
        <Button
          type="primary"
          onClick={() => confirm({ closeDropdown: true })}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Filter
        </Button>
        <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </Space>
    </div>
  );
}

export default DataGridFilterComponent;
