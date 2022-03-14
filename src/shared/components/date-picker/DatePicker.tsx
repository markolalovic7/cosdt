import React, { useState } from "react";
import { DatePicker } from "antd";
import moment, { Moment } from "moment";
import { DatePickerProps } from "antd/lib/date-picker";
import { DefaultDateTimeFormat } from "../../../core/Utils";

interface DatePickerCProps {
  value?: string;
  onChange?(value?: string): void;
  inputFormat?: string;
  readOnly?: boolean;
  viewFormat?: string;
}

function DatePickerComponent({
  value,
  onChange,
  format,
  inputFormat,
  placeholder = "Choose",
  readOnly = false,
  viewFormat,
  autoFocus,
  ...restProps
}: DatePickerCProps & DatePickerProps) {
  const iFormat = (inputFormat || format)?.toString();
  const showFormat = (format || viewFormat || DefaultDateTimeFormat).toString();
  const [val, setVal] = useState<Moment | null>(
    value ? moment(value, iFormat) : null
  );

  function handleChange(date: Moment | null) {
    let stringDate;
    if (date) {
      // if no input/show format provided, consider date as UTC value
      // if input format exists, format accordingly as string
      stringDate = !iFormat ? date.utc().format(iFormat) : date.format(iFormat);
    }
    setVal(date);
    onChange && onChange(stringDate);
  }

  return (
    <>
      {!readOnly ? (
        <DatePicker
          onChange={handleChange}
          value={val}
          format={showFormat}
          placeholder={placeholder}
          autoFocus={autoFocus}
          {...restProps}
        />
      ) : (
          <span>{value && moment(value, inputFormat).format(showFormat)}</span>
        )}
    </>
  );
}

export default DatePickerComponent;
