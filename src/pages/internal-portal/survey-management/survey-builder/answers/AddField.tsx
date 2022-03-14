import { Button, Form, Input } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import * as React from "react";

export const AddField = () => {
  const formItemLayoutWithOutLabel = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };

  return (
    <Form.List
      {...formItemLayoutWithOutLabel}
      name="headOptions"
      rules={[
        {
          validator: async (_, names) => {
            if (!names || names.length < 2) {
              return Promise.reject(new Error("At least 2 items"));
            }
          },
        },
      ]}
    >
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map((field) => (
            <Form.Item
              //style={{ width: "25%" }}
              required={false}
              key={field.key}
              label={`Head item ${field.key + 1}`}
            >
              <Form.Item
                //label="Head items"
                {...field}
                validateTrigger={["onChange", "onBlur"]}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Enter question or delete this fields.",
                  },
                ]}
                noStyle
              >
                <Input placeholder="Head item" style={{ width: "60%" }} />
              </Form.Item>
              {fields.length > 1 ? (
                <MinusCircleOutlined
                  className="dynamic-delete-button"
                  style={{ marginLeft: "7px" }}
                  onClick={() => remove(field.name)}
                />
              ) : null}
            </Form.Item>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              style={{ marginLeft: "160px" }}
              onClick={() => add()}
              icon={<PlusOutlined />}
            >
              Add field
            </Button>
            <Form.ErrorList errors={errors} />
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};
