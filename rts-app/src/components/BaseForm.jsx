import React from "react";
import { Modal, Form, Input, Select, Upload, Button, Space, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

const BaseForm = ({
  isOpen,
  onCancel,
  onSubmit,
  form,
  title,
  editing,
  fields,
}) => {
  return (
    <Modal title={title} open={isOpen} onCancel={onCancel} footer={null}>
      <Form form={form} layout="vertical" onFinish={onSubmit} preserve={false}>
        {fields.map((field) => (
          <Form.Item key={field.name} name={field.name} label={field.label} rules={field.rules}>
            {field.type === "input" && <Input placeholder={field.placeholder} />}
            {field.type === "select" && (
              <Select placeholder={field.placeholder}>
                {field.options.map((option) => (
                  <Option key={option} value={option}>{option}</Option>
                ))}
              </Select>
            )}
            {field.type === "textarea" && <TextArea rows={4} placeholder={field.placeholder} />}
            {field.type === "upload" && (
              <Upload maxCount={1} beforeUpload={() => { message.success("File uploaded"); return false; }}>
                <Button icon={<UploadOutlined />}>Upload File</Button>
              </Upload>
            )}
          </Form.Item>
        ))}

        <Form.Item className="flex justify-end">
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">{editing ? "Update" : "Add"}</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BaseForm;
