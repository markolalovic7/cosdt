import React, {useState} from "react";

import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Menu,
  Modal,
  Row, Tooltip,
} from "antd";
import {PlusOutlined, InfoCircleTwoTone} from "@ant-design/icons";
import styles from "./QuestionForm.module.scss";
import {QuestionTypeEnum} from "../../../../model/domain/enums/QuestionTypeEnum";
import {
  QuestionTypesList,
  SurveyAnswer,
  SurveyQuestion,
} from "./SurveyBuilder";
import {AddField} from "./answers/AddField";
import {Editor} from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
//@ts-ignore
import htmlToDraft from 'html-to-draftjs';
import {EditorState, ContentState} from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface QuestionFormProps {
  question: SurveyQuestion;

  onSave(question?: SurveyQuestion): void;
}

const QuestionFormComponent = ({question, onSave}: QuestionFormProps) => {
  const [form] = Form.useForm();
  const [questionType, setQuestionType] = useState<QuestionTypeEnum>(
    question.type
  );
  const onContentStateChange = (contentState: any) => {
    return (draftToHtml(contentState));
  };
  const onFinish = (values: SurveyQuestion) => {
    const updated = {
      ...question,
      ...values,
      type: questionType,
    };
    onSave(updated);
  };

  const onCancel = () => {
    onSave();
  };

  const handleSubmit = () => {
    if (isInfoBox) {
      const fields = form.getFieldsValue();
      const projects = fields;
      Object.assign(projects, {name: onContentStateChange(fields.name)});
      form.setFieldsValue(projects);
    }
    form.submit()
  };

  const handleSetType = (type: QuestionTypeEnum) => {
    if (type === QuestionTypeEnum.OPEN_ENDED)
      form.setFieldsValue({answers: []});
    setQuestionType(type);
  };

  const handleAddAnswer = (callback: Function) => {
    const newAnswer = new SurveyAnswer();
    newAnswer.id =
      (form.getFieldValue("answers") as Array<SurveyAnswer>).reduce(
        (max, answer) => (answer.id > max ? answer.id : max),
        -1
      ) + 1;
    callback(newAnswer);
  };

  const handleRemoveAnswer = (index: number, callback: Function) => {
    callback(index);
  };

  const blocksFromHtml = htmlToDraft(question.name);
  const {contentBlocks, entityMap} = blocksFromHtml;
  const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
  const editorState = EditorState.createWithContent(contentState);


  const isCrossTab = questionType === QuestionTypeEnum.CROSSTAB;
  const isOpenEnded = questionType === QuestionTypeEnum.OPEN_ENDED;
  const isInfoBox = questionType === QuestionTypeEnum.INFOBOX;
  const isClassicCrossTab = questionType === QuestionTypeEnum.CLASSIC_CROSSTAB;
  return (
    <Modal
      title="Edit question"
      className="bigModal"
      visible={true}
      destroyOnClose={true}
      onOk={handleSubmit}
      okText="Save"
      onCancel={onCancel}
      forceRender
    >
      <div className={"survey-container"}>
        <div className={"form-header"}>
          <Row>
            <Col className="align-right">
              <p style={{width: "173px", margin: "13px 0"}}>
                {" "}
                Question type:
              </p>
            </Col>
            <Col>
              <Menu className={"button-group"}>
                {QuestionTypesList.map((item) => {
                  return (
                    <Button
                      onClick={() => handleSetType(item.type)}
                      icon={item.icon}
                      className={"button"}
                      key={item.type}
                      autoFocus={item.type === question.type}
                      type={(item.type === questionType ? "primary" : "ghost")}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Menu>
            </Col>
          </Row>
        </div>
        <div className={"question-form question-field"}>
          <Form
            style={{width: "100%"}}
            onFinish={onFinish}
            initialValues={question}
            form={form}
            component={false}
            preserve={false}
          >
            {isCrossTab && (
              <Form.Item
                className={"range"}
                name="range"
                label="Rating range from 1 to "
                rules={[
                  {required: true},
                  {type: "number", min: 0, max: 10},
                ]}
              >
                <InputNumber/>
              </Form.Item>
            )}
            {isClassicCrossTab && <AddField/>}
            <div style={{display: "flex"}}>
              <Form.Item
                rules={[{required: true, message: "Question is required"}]}
                name="name"
                label="Question"
                style={{flex: 1}}
              >
                {isInfoBox ?
                  <Editor
                    defaultEditorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onContentStateChange={onContentStateChange}
                  />
                  : <Input/>}
              </Form.Item>
              {!isCrossTab && !isClassicCrossTab && !isOpenEnded && !isInfoBox &&
              <Tooltip title="Za tačan odgovor" overlay={false}>
                  <Form.Item
                      style={{flexShrink: 1, width: 200}}
                      name={"score"}
                      label={"Score"}
                      shouldUpdate
                  >
                      <Input prefix={<InfoCircleTwoTone/>} style={{width: 75}}/>
                  </Form.Item>
              </Tooltip>
              }
            </div>
            {isOpenEnded && (
              <Form.Item
                name="editor"
                className={"range"}
                valuePropName="checked"
                //shouldUpdate
                label="Use editor"
              >
                <Checkbox value={true}/>
              </Form.Item>
            )}
            <Form.Item
              name="note"
              //shouldUpdate
              label="Note"
            >
              <Input/>
            </Form.Item>
            <Form.Item
              name="order"
              //shouldUpdate
            >
              <Input type={"hidden"}/>
            </Form.Item>
            <Form.Item
              name="timer"
              className={"range"}
              label="Time allowed in seconds"
            >
              <Input/>
            </Form.Item>
            <Form.List name="answers">
              {(answers, {add, remove}) => (
                <div>
                  {answers.map((answer, index) => (
                    <div
                      className={"form-item-multiple"}
                      key={"answer_" + index}
                    >
                      <div className={"single-item-group"}>
                        {!isInfoBox && <Form.Item
                            rules={[{required: true}]}
                            name={[answer.name, "body"]}
                            label={index + 1 + "."}
                            shouldUpdate
                            className={"question-input"}
                        >
                            <Input/>
                        </Form.Item>}
                        {!isCrossTab && !isOpenEnded && !isClassicCrossTab && !isInfoBox && (
                          <>
                            <Form.Item
                              name={[answer.name, "correct"]}
                              valuePropName="checked"
                              className={"correct-checkbox"}
                              shouldUpdate
                              //label="Correct"
                            >
                              <Checkbox className={styles.correctCheckbox}>
                                Correct
                              </Checkbox>
                            </Form.Item>
                          </>
                        )}
                        <div className="align-right">
                          <Button
                            type="link"
                            danger
                            disabled={answers.length <= 1}
                            onClick={() => handleRemoveAnswer(index, remove)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!isOpenEnded && !isInfoBox && (
                    <Button
                      style={{marginLeft: "160px"}}
                      type={"primary"}
                      onClick={() => handleAddAnswer(add)}
                      icon={<PlusOutlined/>}
                    >
                      Add new option
                    </Button>
                  )}
                </div>
              )}
            </Form.List>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default QuestionFormComponent;
