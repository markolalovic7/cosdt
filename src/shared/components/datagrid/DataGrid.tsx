import React, {
  ReactElement,
  ReactText,
  useEffect,
  useRef,
  useState,
} from "react";
import { ResizeCallbackData } from "react-resizable";
import moment from "moment";

import { Form, Input, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { TableProps } from "antd/lib/table";
import {
  FilterDropdownProps,
  RowSelectionType,
  SelectionItem,
} from "antd/lib/table/interface";

import {
  getDotIndex,
  getValue,
  isDataIndexEqual,
  RangePickerFormat,
} from "../../../core/Utils";
import {
  DataGridContext,
  DataGridContextType,
} from "../../../model/ui/types/DataGridContextType";
import { DataGridRowContext } from "../../../model/ui/types/DataGridRowContextType";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridSelectionItem,
  SorterResult,
} from "../../../model/ui/types/DataGridTypes";
import { DataGridCellTypeEnum } from "../../../model/ui/enums/DataGridCellTypeEnum";
import DataGridResizableHeader, {
  DataGridResizableHeaderProps,
} from "./DataGridResizableHeader";
import { DataGridActionsProps } from "./DataGridActions";
import { DataGridRowActionsProps } from "./DataGridRowActions";
import DataGridCellComponent, { DataGridCellProps } from "./cells/DataGridCell";
import DataGridFilterComponent from "./cells/DataGridFilter";

type DataGridComponentProps<T> = {
  columns: Array<DataGridColumnType<T>>;
  dataSource: Array<T>;
  filters: DataGridFiltersType;
  sort: SorterResult<T> | null;
  selectable?: boolean | Array<DataGridSelectionItem<T>>;
  selectionType?: RowSelectionType;
  inlineEdit?: boolean;
  Actions?: ReactElement<DataGridActionsProps<T>>;
  RowActions?: ReactElement<DataGridRowActionsProps<T>>;
  Modal?: ReactElement;
  actionsColumn?: DataGridColumnType<T>
};

function DataGridComponent<RecordType extends AnyRecord>({
  columns,
  dataSource,
  filters,
  sort,
  selectable = false,
  inlineEdit = true,
  selectionType = "checkbox",
  Actions,
  RowActions,
  Modal,
  actionsColumn = { width: 200 },
  ...restProps
}: DataGridComponentProps<RecordType> & TableProps<RecordType>) {
  const [editingId, setEditingId] = useState<number>();
  const [colSizes, setColSizes] = useState<Array<number | string | undefined>>(
    []
  );
  const [selection, setSelection] = useState<Array<RecordType>>([]);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [changeId, setChangeId] = useState<number>(0); //used for render trigger
  const searchInputRef = useRef<Input>(null);

  const [form] = Form.useForm();
  let hasEditableCells = false;
  const isEditing = (record: RecordType) => record.id === editingId;

  //set initial column sizes
  useEffect(() => {
    setColSizes(columns.map((col) => col.width));
  }, [columns]);

  //Resize
  const handleResize = (index: number) => (
    e: React.SyntheticEvent<Element, Event>,
    data: ResizeCallbackData
  ) => {
    const resizedCols = [...colSizes];
    resizedCols[index] = data.size.width;
    setColSizes(resizedCols);
  };

  //Search/Filter
  const getColumnSearchProps = (column: DataGridColumnType<RecordType>) => {
    return {
      filterDropdown: (props: FilterDropdownProps) => (
        <DataGridFilterComponent<RecordType>
          searchInputRef={searchInputRef}
          column={column}
          {...props}
        />
      ),
      onFilterDropdownVisibleChange: (visible: boolean) => {
        if (visible) setTimeout(() => searchInputRef.current?.select(), 100);
      },
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value: string | number | boolean, record: RecordType) => {
        let dataIndex = column.dataIndex;
        let recordValue = getValue(record, dataIndex);
        let recordValues = !recordValue ? [false] : [recordValue];
        if (column.cellType === DataGridCellTypeEnum.DATE) {
          const range = value.toString().split("|");
          const granulation: any = range[2];
          return (
            moment(recordValue).isSameOrAfter(
              moment(range[0], RangePickerFormat),
              granulation
            ) &&
            moment(recordValue).isSameOrBefore(
              moment(range[1], RangePickerFormat),
              granulation
            )
          );
        } else {
          if (column.cellType === DataGridCellTypeEnum.MULTIOPTION && Array.isArray(dataIndex)) {
            const valIndex = [...dataIndex].splice(dataIndex.length - 1, 1)[0];
            recordValue = getValue(record, dataIndex);
            recordValues = recordValue
              ? recordValue.map((val: any) => val[valIndex])
              : recordValues;
          }
          return (
            recordValues.filter(
              (val) =>
                val
                  .toString()
                  .toLowerCase()
                  .includes(value.toString().toLowerCase())
            ).length > 0
          );
        }
      },
    };
  };

  //Selection
  const getSelectionProps = () => {
    const selectionItems: Array<SelectionItem> = [];
    if (Array.isArray(selectable)) {
      for (let selectionItem of selectable) {
        selectionItems.push({
          key: selectionItem.key,
          text: selectionItem.text,
          onSelect: () => {
            setSelection(selectionItem.onSelect());
          },
        });
      }
    }

    return {
      type: selectionType,
      selectedRowKeys: selection.map((sel) => sel.id),
      onChange: (
        selectedRowKeys: Array<ReactText>,
        selectedRows: Array<RecordType>
      ) => {
        setSelection(selectedRows);
      },
      getCheckboxProps: (record: RecordType) => ({
        name: record.id,
        status: record.status,
      }),
      selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        ...selectionItems,
      ],
    };
  };

  const onResetAllFilters = (newFilters: DataGridFiltersType) => {
    const onChange: Function | undefined = restProps.onChange;
    onChange && onChange(restProps.pagination, newFilters, sort);
  };

  let foundFocus = false;

  let cols: Array<DataGridColumnType<RecordType>> = columns.map(
    (col, index) => {
      hasEditableCells = col.editable || hasEditableCells;
      const dataIndex = col.dataIndex!;
      const sortIndex = col.sortIndex || col.dataIndex;
      let sortMethod = (a: RecordType, b: RecordType) =>
        getValue(a, sortIndex)?.localeCompare(getValue(b, sortIndex));
      if (col.cellType === DataGridCellTypeEnum.NUMBER)
        sortMethod = (a: RecordType, b: RecordType) =>
          getValue(a, sortIndex) - getValue(b, sortIndex);
      const colWidth = colSizes[index] || col.width;
      let newCol: DataGridColumnType<RecordType> = {
        ...col,
        width: colWidth,
        sorter: col.defaultSort ? sortMethod : col.sorter,
        defaultSortOrder:
          sort?.field &&
            sort?.order &&
            isDataIndexEqual(col.dataIndex, sort.field)
            ? sort.order
            : col.defaultSortOrder,
        filteredValue:
          col.filterEnabled && filters
            ? (filters[getDotIndex(dataIndex)] as Array<string | number>)
            : null,
      };

      const autoFocus = !!col.editable && !foundFocus;

      if (col.component) {
        const CellComponent = col.component;
        newCol.render = (_: Element, record: RecordType) => (
          <CellComponent
            record={record}
            dataIndex={dataIndex}
            rules={col.rules}
            options={col.options}
            editing={isEditing(record)}
            // hasFocus={autoFocus}
            editable={col.editable}
            cellType={col.cellType}
            link={col.link}
            date={col.date}
            dependencies={col.dependencies}
            wrap={false}
          />
        );
      } else {
        newCol.onCell = (
          record: RecordType
        ): DataGridCellProps<RecordType> => ({
          record,
          dataIndex: dataIndex,
          rules: col.rules,
          options: col.options,
          hasFocus: autoFocus,
          editing: isEditing(record),
          editable: col.editable,
          cellType: col.cellType,
          link: col.link,
          dependencies: col.dependencies,
          date: col.date,
        });
      }
      newCol.onHeaderCell = (
        column: DataGridColumnType<RecordType>
      ): DataGridResizableHeaderProps => ({
        width: column.width,
        resizable: column.resizable,
        onResize: handleResize(index),
      });
      if (autoFocus) foundFocus = true;
      if (newCol.filterEnabled)
        return {
          ...newCol,
          ...getColumnSearchProps(newCol),
        };
      else return newCol;
    }
  );

  if (RowActions) {
    cols.push({
      ...actionsColumn,
      title: "Actions",
      dataIndex: "Actions",
      render: (_: Element, record: RecordType) => (
        <DataGridRowContext.Provider value={{ record }}>
          {RowActions}
        </DataGridRowContext.Provider>
      ),
    });
  }

  const dgForm = (
    <Form
      form={form}
      component={false}
      onValuesChange={() => {
        setIsDirty(true);
        setChangeId(changeId + 1);
      }}
    >
      <Table<RecordType>
        rowSelection={selectable ? getSelectionProps() : undefined}
        columns={cols}
        dataSource={dataSource}
        pagination={
          restProps.pagination ? restProps.pagination : { pageSize: 20 }
        }
        rowClassName="editable-row"
        components={{
          header: {
            cell: DataGridResizableHeader,
          },
          body: {
            cell: DataGridCellComponent,
          },
        }}
        {...restProps}
      />
    </Form>
  );

  return (
    <div>
      <DataGridContext.Provider
        value={
          {
            form,
            editingId,
            setEditingId,
            isDirty,
            setIsDirty,
            editable: hasEditableCells,
            setSelection: setSelection,
            selection: selection,
            filters,
            onResetAllFilters,
            inlineEdit,
          } as DataGridContextType<RecordType>
        }
      >
        {Actions}
        {Modal ? React.cloneElement(Modal, { children: dgForm }) : dgForm}
      </DataGridContext.Provider>
    </div>
  );
}

export default React.memo(DataGridComponent) as typeof DataGridComponent;
