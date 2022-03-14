import React, {useContext} from "react";
import {Checkbox, DatePicker, Form, Input, InputNumber, Select,} from "antd";
import {NamePath} from "antd/lib/form/interface";

import {DataGridCellTypeEnum} from "../../../../model/ui/enums/DataGridCellTypeEnum";
import {DataGridContext, DataGridContextType} from "../../../../model/ui/types/DataGridContextType";
import {
  DataGridCellDateType
} from "../../../../model/ui/types/DataGridTypes";
import SelectComponent from "../../multiple-select/Select";
import DatePickerComponent from "../../date-picker/DatePicker";
import {DataGridCellProps} from "./DataGridCell";

const moment = require("moment");
const {Option} = Select;
const {RangePicker} = DatePicker;

export interface DataGridCellEditableProps<T> extends DataGridCellProps<T> {
  useCustomSelect: boolean;
  date: DataGridCellDateType;
}

const {TextArea} = Input;

function DataGridCellEditableComponent<T extends AnyRecord>({
                                                              dataIndex,
                                                              dependencies,
                                                              cellType,
                                                              rules,
                                                              date,
                                                              options,
                                                              useCustomSelect,
                                                              hasFocus
                                                            }: DataGridCellEditableProps<T>) {

  const {
    form
  } = useContext<DataGridContextType<T>>(DataGridContext);
  let namePath = Array.isArray(dataIndex) ? [...dataIndex] : dataIndex as NamePath;

  if (cellType === DataGridCellTypeEnum.DATE)
    return (
      <Form.Item
        style={{margin: 0}}
        rules={rules}
        name={namePath}
      >
        <DatePickerComponent
          inputFormat={date.inputFormat}
          format={date.format}
          picker={date.pickerType}
          autoFocus={hasFocus}
        />
      </Form.Item>
    );
  else if (cellType === DataGridCellTypeEnum.RANGE)
    return (
      <Form.Item
        style={{margin: 0}}
        rules={rules}
        name={namePath}
        valuePropName={'range'}
      >
        <RangePicker
          format='DD.MM.YYYY'
          picker={date.pickerType}
          autoFocus={hasFocus}
          defaultPickerValue={[moment('2017-02-01 00:00:00', 'YYYY-MM-DD HH:mm:ss'), moment('2017-03-01 00:00:0', 'YYYY-MM-DD HH:mm:ss')]}
        />
      </Form.Item>
    );
  else if (cellType === DataGridCellTypeEnum.CHECKBOX)
    return (
      <Form.Item
        style={{margin: 0}}
        rules={rules}
        name={namePath}
        valuePropName="checked"
      >
        <Checkbox autoFocus={hasFocus}/>
      </Form.Item>
    );
  else if (cellType === DataGridCellTypeEnum.TEXTAREA)
    return (
      <Form.Item
        style={{margin: 0}}
        rules={rules}
        name={namePath}
      >
        <TextArea autoFocus={hasFocus} autoSize/>
      </Form.Item>
    );
  else if ((cellType === DataGridCellTypeEnum.OPTION
    || cellType === DataGridCellTypeEnum.MULTIOPTION)
    && options) {
    const filterMethod = options.filter;
    const opts = filterMethod && dependencies
      ? options.values.filter((val) => filterMethod(val, form.getFieldValue(dependencies[0])))
      : options.values;

    return (
      <Form.Item
        style={{margin: 0}}
        rules={rules}
        name={namePath}
        dependencies={dependencies}
      >
        {!useCustomSelect ? (
          <Select autoFocus={hasFocus}>
            {opts.map((option, index) =>
              <Option key={index} value={option[options.valueIndex]}>{option[options.nameIndex]}</Option>
            )}
          </Select>
        ) : (
          <SelectComponent
            valueIndex={options.valueIndex}
            nameIndex={options.nameIndex}
            mode={cellType === DataGridCellTypeEnum.MULTIOPTION ? 'multiple' : undefined}
            dropdownValues={opts}
            autoFocus={hasFocus}
          />
        )}
      </Form.Item>
    )
  } else if (cellType === DataGridCellTypeEnum.NUMBER) {
    return (
      <Form.Item
        style={{margin: 0}}
        rules={rules}
        name={namePath}
      >
        <InputNumber autoFocus={hasFocus}/>
      </Form.Item>
    )
  } else {
    return (
      <Form.Item
        style={{margin: 0}}
        rules={rules}
        name={namePath}
      >
        <Input autoFocus={hasFocus}/>
      </Form.Item>
    )
  }
}

export default DataGridCellEditableComponent;
