import React, {useEffect} from "react";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {Comment, Form, Input} from "antd";
import {SurveyQuestion} from "../SurveyBuilder";
import "./questions.scss";
import {QuestionTypeEnum} from "../../../../../model/domain/enums/QuestionTypeEnum";
import {InfoCircleOutlined} from "@ant-design/icons/lib";

interface OpenAnswerProps {
  question: SurveyQuestion;
  itemNo: number;
  className: string;
  handleQuestionType(type: QuestionTypeEnum): void

}

const {TextArea} = Input;
const OpenAnswerSurvey = ({question, itemNo, className, handleQuestionType}: OpenAnswerProps) => {
  const onContentStateChange = (contentState: any) => {
  };
  useEffect(() => {
    setType()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [className]);
  const setType = () => {
    handleQuestionType(QuestionTypeEnum.OPEN_ENDED)
  };
  return (
    <>
      <Form.Item
        name={question.id}
        label={itemNo + ". " + question.name}
        className={"form-item table-header-label " + className}
      >
        {question.editor ? (
          <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onContentStateChange={onContentStateChange}
          />
        ) : (
          <TextArea rows={2}/>
        )}
      </Form.Item>
      {question.note &&
      <Comment
          author={<a>Note</a>}
          avatar={<InfoCircleOutlined style={{fontSize: 32, color: "#1890ff"}}/>}
          content={
            question.note
          }
      />
      }
    </>
  );
};

export default OpenAnswerSurvey;
