import { useState } from 'react';
import { Modal, message, Form } from 'antd';

const useInterviews = (initialInterviews = []) => {
  const [interviews, setInterviews] = useState(initialInterviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [form] = Form.useForm();

  const showAddInterviewModal = (form) => {
    setEditingInterview(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditInterviewModal = (interview) => {
    setEditingInterview(interview);
    console.log(interview);
    form.setFieldsValue({
      candidate: interview.name,
      position: interview.email,
      interviewer: interview.phone,
      date: interview.applied_position,
      // time: interview.time,
      status: interview.status,
    });
    setIsModalOpen(true);
  };

  const showFeedbackModal = (form, interview) => {
    setCurrentInterview(interview);
    form.setFieldsValue({ feedback: interview.feedback || '' });
    setIsFeedbackModalOpen(true);
  };

  const handleCancel = () => setIsModalOpen(false);
  const handleFeedbackCancel = () => setIsFeedbackModalOpen(false);

  const handleSubmit = (values) => {
    if (editingInterview) {
      setInterviews(interviews.map((interview) =>
        interview.id === editingInterview.id ? { ...interview, ...values } : interview
      ));
    } else {
      const newInterview = {
        id: interviews.length ? Math.max(...interviews.map(i => i.id)) + 1 : 1,
        ...values,
        feedback: '',
      };
      setInterviews([...interviews, newInterview]);
    }
    setIsModalOpen(false);
  };

  const handleFeedbackSubmit = (values) => {
    setInterviews(interviews.map((interview) =>
      interview.id === currentInterview.id ? { ...interview, feedback: values.feedback, status: 'Completed' } : interview
    ));
    setIsFeedbackModalOpen(false);
  };

  const handleDeleteInterview = (id) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this interview?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setInterviews(interviews.filter(interview => interview.id !== id));
        message.success('Interview deleted successfully');
      },
    });
  };

  return {
    interviews,
    isModalOpen,
    isFeedbackModalOpen,
    showAddInterviewModal,
    showEditInterviewModal,
    showFeedbackModal,
    handleCancel,
    handleFeedbackCancel,
    handleSubmit,
    handleFeedbackSubmit,
    handleDeleteInterview,
  };
};

export default useInterviews;
