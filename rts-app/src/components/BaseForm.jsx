import React ,{ useState } from "react";
import { Modal, Form, Input, Select, Upload, Button, Space, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { DatePicker, TimePicker } from "antd";
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
  dynamicOptions = {}
}) => {
  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };
  return (    
    <Modal title={title} open={isOpen} onCancel={onCancel} footer={null}>
      <Form form={form} layout="vertical" onFinish={onSubmit} preserve={false}>
        {fields.map((field) => (
          <Form.Item key={field.name} name={field.name} label={field.label} rules={field.rules}>
            {field.type === "input" && <Input placeholder={field.placeholder} />}
            {(field.type === "date") && <DatePicker />}
            {(field.type==="time") && <TimePicker use12Hours format="h:mm a" minuteStep={15} />}

            {field.type === "dynamic_select" && (
              <Select placeholder={field.placeholder} showSearch>
                {(dynamicOptions[field.name] || []).map(option => (
                  <Option key={field.name - option.id} value={option.id}>{option.title} {option.name}</Option>
                ))}
              </Select>
            )}
            {field.type === "select" && (
              <Select placeholder={field.placeholder}>
                {field.options.map((option) => (
                  <Option key={option} value={option}>{option}</Option>
                ))}
              </Select>
            )}
            {field.type === "tags" && (
              <Select
                mode="tags"
                style={{ width: "100%" }}
                placeholder={field.placeholder}
                tokenSeparators={[",", "\n"]}
              />
            )}
            {field.type === "textarea" && <TextArea rows={4} placeholder={field.placeholder} />}
            {field.type === "upload" && (
              <Upload fileList={fileList} onChange={handleChange} maxCount={1} beforeUpload={() => { message.success("File uploaded"); return false; }}>
                <Button icon={<UploadOutlined />}>Upload File</Button>
              </Upload>
            )}
          </Form.Item>
        ))}

        <Form.Item style={{ display: "flex", justifyContent: "flex-end" }} >
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">{editing ? "Update" : "Submit"}</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BaseForm;
