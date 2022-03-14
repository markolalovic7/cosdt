import React, {useEffect} from "react";
import {Form, Input, Modal} from "antd";
import {ClassAttendeeMentorDiary} from "../../../../../model/domain/classes/ClassAttendeeMentorDiary";

interface EvaluationModalProps {
    isModalVisible: boolean
    data: ClassAttendeeMentorDiary
    handleOk(values:any): void

    handleCancel(): void
}

const EvaluationModal = ({isModalVisible, handleCancel, handleOk, data}: EvaluationModalProps) => {
    useEffect(()=> {
        console.log(data)
    }, [data])
    const [form] = Form.useForm();

    return (
        <Modal title="Dodaj ocjene" visible={isModalVisible} onOk={() => {
            form
                .validateFields()
                .then(values => {
                    form.resetFields();
                    handleOk(values);
                    handleCancel()
                })
                .catch(info => {
                    console.log('Validate Failed:', info);
                });
        }} onCancel={handleCancel} destroyOnClose>
            <Form
                preserve={false}
                form={form}
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                autoComplete="off"
                initialValues={data}

            >
                <Form.Item
                    label="Opis evaluacije"
                    name={["atendeeMentor","evaluationDescription"]}
                    preserve={false}

                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    preserve={false}
                    label="Sažetak evaluacije"
                    name={["atendeeMentor","evaluationSummary"]}
                >
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default EvaluationModal