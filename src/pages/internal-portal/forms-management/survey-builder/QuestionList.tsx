import React from "react";
import { QuestionTypeEnum } from "../../../../model/domain/enums/QuestionTypeEnum";
import { QuestionTypesList, SurveyQuestion } from "./SurveyBuilder";

interface QuestionListProps {
  questions: Array<SurveyQuestion>;
}

const QuestionListComponent = ({ questions }: QuestionListProps) => {
  function getTypeName(type: QuestionTypeEnum) {
    const qType = QuestionTypesList.find(
      (questionType) => questionType.type === type
    )?.label;
    return qType || "";
  }

  return (
    <div className={"question-preview"}>
      {questions.map((question, index) => (
        <React.Fragment key={`question_${index}`}>
          {/* <Row>
            <Col span={6}>
              <div className={"table-header-label "}>
                {index + 1 + "."} Question:{" "}
              </div>
            </Col>
            <Col span={16}>
              <div className={"table-header-value header"}>
                {question.name}{" "}
              </div>
            </Col>
          </Row> */}
          <div
            className={"table-header"}
            style={{ width: "60%", maxWidth: "60%" }}
          >
            <div className={"table-header-label "}>
              {index + 1 + "."} Question:{" "}
            </div>
            <div className={"table-header-value header"}>{question.name} </div>
          </div>
          <div
            className={"table-header"}
            style={{ width: "20%", justifyContent: "flex-start" }}
          >
            <div className={"table-header-label"}>Question type: </div>
            <div className={"table-header-value header "}>
              {getTypeName(question.type)}
            </div>
          </div>
          {!!question.range && (
            <div
              className={"table-header"}
              style={{ width: "10%", minWidth: "10%" }}
            >
              <div className={"table-header-label range"}>Range 1-</div>
              <div className={"table-header-value header "}>
                {question.range}
              </div>
            </div>
          )}
          {question.answers.map((answer, index) => (
            <div className={"table-question"} key={`question_${index}`}>
              <div className={"table-header-label"}>{answer.id}</div>
              <div className={"table-header-value question"}>{answer.body}</div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default QuestionListComponent;
