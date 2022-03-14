import {Button, DatePicker, Form, Input, Popconfirm} from "antd";
import React, {useState} from "react";
import {DeleteOutlined, EditOutlined, SaveOutlined, StopOutlined} from "@ant-design/icons/lib";
import DatePickerComponent from "../../../../../../shared/components/date-picker/DatePicker";
import './StudentsMentors.scss';
import UserPickerComponent from "../../../../../../shared/components/user-picker/UserPicker";

const moment = require('moment');
const MentorsForm = ({mentor, handleDelete, handleUpdate, handleCreate, onCancel, editable}: any) => {
  const [editMode, setEditMode] = useState<boolean>(false);

  const layout = {
    labelCol: {span: 10},
    wrapperCol: {span: 32},
  };
  const mentorLayout = {
    labelCol: {span: 12},
    wrapperCol: {span: 8},
  };
  const mentorLayoutLeft = {
    labelCol: {span: 10},
    wrapperCol: {span: 8},
  };
  const tailLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 32},
  };

  async function deleteItem() {
    await mentor && handleDelete(mentor.id)
  }

  const [form] = Form.useForm();

  async function updateItem(data: any) {
    !!mentor &&
    await handleUpdate(data, mentor.mentor, mentor.id)
  }

  async function createItem(data: any) {
    await handleCreate(data)
  }

  const onFinish = (values: any) => {
    let datesArray = [
      'odlukaOIzboruKandidataDatum',
      'odlukaOOdredjivanjuDatum',
      'odlukaOOdredjivanjuMentoraDatum',
      'start',
      'end',
    ];
    console.log(values);
    /*for (let item in values) {
      if (datesArray.indexOf(item) !== -1) {
        console.log(item);
        console.log(values[item]);
        values = {...values, [item]: moment(values[item],'DD-MM-YYYY').format('YYYY-MM-DD')};
      }
    }*/
    !!mentor ? updateItem(values) : createItem(values)

  };
  return (
    <div className={"mentors-card"}
         key={!!mentor ? mentor.id : "new-mentor-form"}>
      <Form
        {...layout}
        form={form}
        onFinish={onFinish}
        initialValues={mentor}>
        {mentor
          ? (<div className={"item-header"}>
            <div className={"item-header form-item"}>
              <div className={"item-data"}>Name: <b>{mentor?.mentor?.firstName} {mentor?.mentor?.lastName}</b></div>
              <div className={"item-data"}>Institution: <b>{mentor?.mentor?.institution?.name}</b></div>
              <div className={"item-data"}>Function: <b>{mentor?.mentor?.function?.name}</b></div>
            </div>
            <React.Fragment>

              {!editMode && editable &&
              <>
                  <Button
                      icon={<EditOutlined/>}
                      type="link"
                      onClick={() => setEditMode(true)}
                      style={{marginRight: 4}}
                  />
                  <Popconfirm
                      title="Sure to delete?"
                      onConfirm={deleteItem}
                  >
                      <Button
                          icon={<DeleteOutlined/>}
                          type="link"
                          danger
                          style={{marginRight: 4}}
                      />
                  </Popconfirm>
              </>
              }
              {editMode && editable &&
              <>
                  <Button
                      icon={<SaveOutlined/>}
                      type="link"
                      onClick={() => {
                        form.submit();
                        setEditMode(false)
                      }}
                      style={{marginRight: 4}}

                  >
                  </Button>
                  <Button
                      icon={<StopOutlined/>}
                      type="link"
                      onClick={() => {
                        setEditMode(false)
                      }}
                      style={{marginRight: 4}}
                  />
              </>
              }
            </React.Fragment>
          </div>)
          : (<div className={"item-header"}>
            <div className={"item-header form-item"}>
              <Form.Item
                name={"mentor"}
                label={"Mentor"}
              >
                <UserPickerComponent/>
              </Form.Item>
            </div>
            <React.Fragment>
              <Button
                icon={<SaveOutlined/>}
                type="link"
                onClick={() => {
                  form.submit();
                  setEditMode(false)
                }}
                style={{marginRight: 4}}
              />
              <Button
                icon={<StopOutlined/>}
                type="link"
                onClick={() => {
                  onCancel()
                }}
                style={{marginRight: 4}}
              />
            </React.Fragment>
          </div>)
        }
        <hr/>
        <div className={"item-header"}>
          <div className={"form-item"}>
            <Form.Item name={"odlukaOOdredjivanjuBr"}
                       label={"Odluka o odredjivanju br"}>
              <Input
                disabled={!!mentor && !editMode}/>
            </Form.Item>
          </div>
          <div className={"form-item"}>
            <Form.Item {...mentorLayout} name={"odlukaOOdredjivanjuDatum"}
                       label={"Odluka o odredjivanju datum"}>
              <DatePickerComponent
                picker={"date"} disabled={!!mentor && !editMode} format={'YYYY-MM-DD'} viewFormat={'DD-MM-YYYY'}/>
            </Form.Item>
          </div>
        </div>
        <div className={"item-header"}>
          <div className={"form-item"}>
            <Form.Item label={"Odluka o izboru kandidata br"}
                       name={"odlukaOIzboruKandidataBr"}>
              <Input
                disabled={!!mentor && !editMode}/>
            </Form.Item>
          </div>
          <div className={"form-item"}>
            <Form.Item {...mentorLayout} label={"Odluka o izboru kandidata datum"}
                       name={"odlukaOIzboruKandidataDatum"}>
              <DatePickerComponent
                picker={"date"} disabled={!!mentor && !editMode} format={'YYYY-MM-DD'} viewFormat={'DD-MM-YYYY'}/>
            </Form.Item>
          </div>
        </div>
        <div className={"item-header"}>
          <div className={"form-item"}>
            <Form.Item label={"Odlukao odredjivanju mentora br"}
                       name={"odlukaOOdredjivanjuMentoraBr"}>
              <Input
                disabled={!!mentor && !editMode}/>
            </Form.Item>
          </div>
          <div className={"form-item"}>
            <Form.Item {...mentorLayout} label={"Odluka o odredjivanju mentora datum"}
                       name={"odlukaOOdredjivanjuMentoraDatum"}>
              <DatePickerComponent picker={"date"} disabled={!!mentor && !editMode} format={'YYYY-MM-DD'} viewFormat={'DD-MM-YYYY'}/>
            </Form.Item>
          </div>
        </div>
        <div className={"item-header"}>
          <div className={"form-item"}>
            <Form.Item {...mentorLayoutLeft} name={"start"}
                       label={"Početak"}>
              <DatePickerComponent picker={"date"} disabled={!!mentor && !editMode} format={'YYYY-MM-DD'} viewFormat={'DD-MM-YYYY'}
                                   onChange={(e: any) => {
                                     console.log(e)
                                   }}/>
            </Form.Item>
          </div>
          <div className={"form-item"}>
            <Form.Item {...mentorLayout} name={"end"}
                       label={"Kraj"}>
              <DatePickerComponent picker={"date"} disabled={!!mentor && !editMode} format={'YYYY-MM-DD'} viewFormat={'DD-MM-YYYY'}/>
            </Form.Item>
          </div>
        </div>
        <hr/>
        <div className={"form-item"}>
          <Form.Item {...tailLayout} name={"evaluationDescription"}
                     label={"Evaluation description"}>
            <Input disabled={!!mentor && !editMode}/>
          </Form.Item>
        </div>
        <div className={"form-item"}>
          <Form.Item {...tailLayout} name={"evaluationSummary"}
                     label={"Evaluation summary"}>
            <Input disabled={!!mentor && !editMode}/>
          </Form.Item>
        </div>
      </Form>
    </div>
  )
};

export default MentorsForm;
