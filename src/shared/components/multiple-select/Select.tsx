import React, { useEffect, useState } from "react";
import { Select } from "antd";

const { Option } = Select;

interface MultipleSelectProps<T> {
  value?: Array<T> | T;
  onChange?(c: Array<T | undefined> | T | undefined): void;
  dropdownValues: Array<T>;
  mode?: "multiple";
  valueIndex?: string;
  nameIndex?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

function SelectComponent<T extends AnyRecord>({
  value,
  onChange,
  dropdownValues = [],
  mode,
  valueIndex = "id",
  nameIndex = "name",
  autoFocus,
  disabled
}: MultipleSelectProps<T>) {
  const [didMount, setDidMount] = useState<boolean>(false);
  const isMultiple = mode === "multiple";
  let val: string | number | (string | number)[] | undefined;
  if (value)
    val = isMultiple
      ? (value as Array<T>).map((v) => v[valueIndex])
      : (value as T)[valueIndex];

  //TODO This effect removes any values that do not exist in options but are selected as value
  useEffect(() => {
    if (didMount) {
      const selection = getSelection(val);
      if (!selection || (Array.isArray(val) && val.length > selection.length))
        onChange && onChange(selection);
    } else setDidMount(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownValues.length]);

  const handleChange = (
    ids: Array<number | string> | string | number | undefined
  ) => {
    onChange && onChange(getSelection(ids));
  };

  const getSelection = (
    ids: Array<number | string> | string | number | undefined
  ) => {
    let selection = undefined;
    if (Array.isArray(ids))
      selection = ids.map((id) =>
        dropdownValues.find((val) => val[valueIndex] === id)
      );
    else if (ids)
      selection = dropdownValues.find((val) => val[valueIndex] === ids);
    return selection;
  };

  return (
    <Select
      mode={mode}
      value={val}
      onChange={handleChange}
      allowClear
      showSearch
      optionFilterProp="children"
      autoFocus={autoFocus}
      disabled={disabled}
    >
      {dropdownValues.map((val, index) => (
        <Option key={`${index}`} value={val[valueIndex]}>
          {val[nameIndex]}
        </Option>
      ))}
    </Select>
  );
}

export default SelectComponent;
