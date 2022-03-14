import React, {useState} from "react";
import "./SurveyBuilder.scss";
import {
  EyeOutlined,
  LineOutlined,
  OrderedListOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";

import {QuestionTypeEnum} from "../../../../model/domain/enums/QuestionTypeEnum";

import DataGridComponent from "../../../../shared/components/datagrid/DataGrid";
import DataGridRowActionsComponent from "../../../../shared/components/datagrid/DataGridRowActions";
import {DataGridColumnType} from "../../../../model/ui/types/DataGridTypes";
import {DataGridCellTypeEnum} from "../../../../model/ui/enums/DataGridCellTypeEnum";
import QuestionFormComponent from "./QuestionForm";
import SurveyForm from "./SurveyForm";
import {Button, Modal} from "antd";
import DataGridActionsComponent from "./SurvayDataGridActions";

export class SurveyAnswer {
  id: number = 0;
  body: string = "";
  correct: boolean = false;
  score?: number;
}

export class SurveyQuestion {
  id: number = -1;
  name: string = "";
  type: QuestionTypeEnum = QuestionTypeEnum.SINGLE_CHOICE;
  range: any = 0;
  editor: boolean = false;
  headOptions: [] = [];
  answers: Array<SurveyAnswer> = [new SurveyAnswer()];
  score?: number;
  note?: string;
  order?: number;
  timer?: number;
}

export const QuestionTypesList = [
  {
    type: QuestionTypeEnum.SINGLE_CHOICE,
    label: "One answer",
    icon: <LineOutlined/>,
  },
  {
    type: QuestionTypeEnum.MULTIPLE_CHOICE,
    label: "More answers",
    icon: <OrderedListOutlined/>,
  },
  {
    type: QuestionTypeEnum.INFOBOX,
    label: "Info box",
    icon: <InfoCircleOutlined/>,
  }
];

interface SurveyBuilderProps {
  value?: Array<SurveyQuestion>;
  paginated?: boolean;

  onChange?(sq: Array<SurveyQuestion>): void;
}

const SurveyBuilderComponent = ({
                                  value = [],
                                  onChange,
                                  paginated = false,
                                }: SurveyBuilderProps) => {
  let questions = value;

  const [question, setQuestion] = useState<SurveyQuestion>();
  const [showPreview, setShowPreview] = useState<boolean>();

  const columns: Array<DataGridColumnType<SurveyQuestion>> = [
    {
      title: "Question",
      dataIndex: "name",
      resizable: true,
      width: 400,
    },
    {
      title: "Type",
      dataIndex: "type",
      resizable: true,
      width: 400,
      cellType: DataGridCellTypeEnum.OPTION,
      options: {
        valueIndex: "type",
        nameIndex: "label",
        values: QuestionTypesList,
      },
    },
  ];

  const handleChange = (questions: Array<SurveyQuestion>) => {
    onChange && onChange(questions);
  };

  const handleSaveQuestion = (question: SurveyQuestion) => {
    if (question) {
      let data = [...questions];
      const recordIndex = questions.findIndex((q) => q.id === question.id);
      if (recordIndex >= 0) {
        data[recordIndex] = question;
      } else {
        const maxId =
          questions.reduce(
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

  const handleCreate = async () => {
    setQuestion(new SurveyQuestion());
  };

  const handleUpdate = async (question: SurveyQuestion) => {
    const q = questions.find((q) => q.id === question.id);
    q && setQuestion({...q});
  };

  const handleDelete = async (id: number) => {
    let data = [...questions];
    const recordIndex = data.findIndex((rec) => rec.id === id);
    data.splice(recordIndex, 1);
    handleChange(data);
  };

  return (
    <div className={"questions"}>
      <h2>
        <QuestionCircleOutlined/> Questions
      </h2>
      <DataGridComponent<SurveyQuestion>
        bordered
        columns={columns}
        dataSource={questions}
        rowKey={(rec) => rec.id!}
        sort={null}
        filters={null}
        inlineEdit={false}
        pagination={false}
        Actions={<DataGridActionsComponent onCreate={handleCreate}/>}
        RowActions={
          <DataGridRowActionsComponent
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        }
      />
      {questions.length > 0 && (
        <>
          <br/>
          <Button onClick={() => setShowPreview(true)} icon={<EyeOutlined/>}>
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
        okText=""
        onCancel={() => setShowPreview(false)}
        forceRender
      >
        <SurveyForm questions={questions} paginated={paginated}/>
      </Modal>
    </div>
  );
};

export default SurveyBuilderComponent;
