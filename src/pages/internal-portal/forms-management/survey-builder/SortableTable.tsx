import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button, Modal, Popconfirm, Table } from 'antd';
import { DndProvider, useDrag, useDrop, createDndContext } from 'react-dnd';
import { HTML5Backend, } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { SurveyQuestion } from "./SurveyBuilder";
import { DataGridColumnType } from "../../../../model/ui/types/DataGridTypes";
import { DataGridCellTypeEnum } from "../../../../model/ui/enums/DataGridCellTypeEnum";
import DataGridRowActionsComponent from "../../../../shared/components/datagrid/DataGridRowActions";
import QuestionFormComponent from "./QuestionForm";
import SurveyForm from "./SurveyForm";
import {
  EyeOutlined,
  LineOutlined,
  EditOutlined,
  DeleteOutlined,
  OrderedListOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import DataGridActionsComponent from "./SurvayDataGridActions";
import { QuestionTypeEnum } from "../../../../model/domain/enums/QuestionTypeEnum";
import { RiEdit2Line } from "react-icons/ri";
import { BsTable } from "react-icons/bs";

// @ts-ignore
const RNDContext = createDndContext(HTML5Backend);

const type = 'DragableBodyRow';

interface DnD {
  index: number,
  moveRow: any,
  restProps: any,
  className: any,
  style: any
}

interface DragableBodyRow {
  type: string,
  index: number
}

const DragableBodyRow = ({ index, moveRow, className, style, ...restProps }: DnD) => {
  const ref = React.useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      // @ts-ignore
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: DragableBodyRow) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    item: { type, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  return (
    <tr
      // @ts-ignore
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};
export const QuestionTypesList = [
  {
    type: QuestionTypeEnum.SINGLE_CHOICE,
    label: "One answer",
    icon: <LineOutlined />,
  },
  {
    type: QuestionTypeEnum.MULTIPLE_CHOICE,
    label: "More answers",
    icon: <OrderedListOutlined />,
  },
  {
    type: QuestionTypeEnum.OPEN_ENDED,
    label: "Open answer",
    icon: <RiEdit2Line />,
  },
  {
    type: QuestionTypeEnum.CROSSTAB,
    label: "Range Cross tab",
    icon: <BsTable />,
  },
  {
    type: QuestionTypeEnum.CLASSIC_CROSSTAB,
    label: "Classic Cross tab",
    icon: <BsTable />,
  },
  {
    type: QuestionTypeEnum.INFOBOX,
    label: "Info box",
    icon: <InfoCircleOutlined />,
  }
];


interface SurveyBuilderProps {
  value?: Array<SurveyQuestion>;
  paginated?: boolean;
  dragIndex?: number;
  hoverIndex?: number;

  onChange?(sq: Array<SurveyQuestion>): void;
}


const DragSortingTable = ({

  value = [],
  onChange,
  paginated = false,
}: SurveyBuilderProps) => {
  const [dataQuestions, setData] = useState<Array<SurveyQuestion>>(value);
  const [question, setQuestion] = useState<SurveyQuestion>();
  const [showPreview, setShowPreview] = useState<boolean>();
  useEffect(() => {
    handleChange(dataQuestions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataQuestions]);

  const components = {
    body: {
      row: DragableBodyRow,
    },
  };
  const handleSaveQuestion = (question: SurveyQuestion) => {
    if (question) {
      let data = [...dataQuestions];
      const recordIndex = dataQuestions.findIndex((q) => q.id === question.id);
      if (recordIndex >= 0) {
        data[recordIndex] = question;
      } else {
        const maxId =
          dataQuestions.reduce(
            (max, question) => (question.id > max ? question.id : max),
            -1
          ) + 1;
        data.push({
          ...question,
          id: maxId,
        });
      }
      handleChange(data);
    }
    setQuestion(undefined);
  };

  const handleChange = (questions: Array<SurveyQuestion>) => {
    // eslint-disable-next-line array-callback-return
    questions.map((item, index) => {
      item.order = index
    });
    setData(questions);
    onChange && onChange(questions);
  };
  const handleDelete = async (id: number) => {
    let data = [...dataQuestions];
    const recordIndex = data.findIndex((rec) => rec.id === id);
    data.splice(recordIndex, 1);
    handleChange(data);
  };
  const handleCreate = async () => {
    setQuestion(new SurveyQuestion());
  };

  const handleUpdate = async (question: SurveyQuestion) => {
    dataQuestions.map((item: SurveyQuestion, index: number) => {
      return item.order = index
    });
    setData(dataQuestions);
    const q = dataQuestions.find((q) => q.id === question.id);
    q && setQuestion({ ...q });
  };
  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = dataQuestions[dragIndex];
      setData(
        update(dataQuestions, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [dataQuestions],
  );
  const columns: Array<DataGridColumnType<SurveyQuestion>> = [

    {
      title: "Order",
      dataIndex: "order",
      resizable: false,
      width: 50,
      render: (value) => {
        return value + 1 + "."
      }
    },
    {
      title: "Question",
      dataIndex: "name",
      resizable: true,
      width: 600,
    },
    {
      title: "Type",
      dataIndex: "type",
      resizable: true,
      width: 200,
      cellType: DataGridCellTypeEnum.OPTION,
      render: (value) => {
        let x = QuestionTypesList.filter(obj => {
          return obj.type === value
        });
        return x[0].label
      }
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (value, record) =>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleUpdate(record)}
            style={{ marginRight: 4 }}
          />
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => {
              handleDelete(record.id);
            }}
          >
            <Button
              icon={<DeleteOutlined />}
              type="link"
              danger
              style={{ marginRight: 4 }}
            />
          </Popconfirm>
        </div>
    }

  ];

  const manager = useRef(RNDContext);

  return (
    <div className={"questions"}>
      <div style={{ display: "flex", justifyContent: "space-between" }}><h2><QuestionCircleOutlined /> Questions </h2>
        <DataGridActionsComponent onCreate={handleCreate} /></div>
      <DndProvider
        manager={manager.current.dragDropManager as any}>
        <Table
          columns={columns}
          dataSource={dataQuestions}
          components={components}
          // @ts-ignore
          rowKey={(rec) => rec.order!}
          filters={null}
          bordered
          inlineEdit={true}
          pagination={false}
          //@ts-ignore
          onRow={(record: SurveyQuestion, index: number,) => ({
            index,
            moveRow: moveRow,
            handleChange,
          })}
          Actions={<DataGridActionsComponent onCreate={handleCreate} />}
          RowActions={
            <DataGridRowActionsComponent
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          }
        />
      </DndProvider>
      {question && <QuestionFormComponent
        question={question}
        onSave={handleSaveQuestion}
      />}
      {dataQuestions.length > 0 && (
        <>
          <br />
          <Button onClick={() => setShowPreview(true)} icon={<EyeOutlined />}>
            Preview form
          </Button>
        </>
      )}
      {question && (
        <QuestionFormComponent
          question={question}
          onSave={handleSaveQuestion}
        />
      )}
      <Modal
        title="Preview form"
        className="bigModal"
        visible={showPreview}
        destroyOnClose={true}
        cancelText={"Exit preview"}
        onCancel={() => setShowPreview(false)}
        okButtonProps={{ style: { display: 'none' } }}
      //forceRender
      >
        <SurveyForm questions={dataQuestions} paginated={paginated} />
      </Modal>
    </div>
  );
};
export default DragSortingTable;
