import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal } from "antd";

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [selectedUserForms, setSelectedUserForms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("https://earnkart.onrender.com/api/v1/auth/users/approved");
        const users = response.data?.data?.users;
        console.log(users);
        if (users) {
          setCustomers(users);
        } else {
          console.error("Error: Users data is undefined");
        }
      } catch (error) {
        console.error("Error fetching disapproved users:", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleDisapprove = async (userId) => {
    try {
      await axios.patch(`https://earnkart.onrender.com/api/v1/auth/${userId}/disapprove`);
      // Update the state after disapproval
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.id !== userId)
      );
    } catch (error) {
      console.error("Error disapproving user:", error);
    }
  };

  const handleFetchUserForms = async (userId) => {
    try {
      const response = await axios.get(`https://earnkart.onrender.com/api/v1/forms/admin/getForms/${userId}`);
      const forms = response.data?.data?.forms;
      console.log(forms);
      if (forms) {
        setSelectedUserForms(forms);
        setModalVisible(true);
      } else {
        console.error("Error: Forms data is undefined");
      }
    } catch (error) {
      console.error("Error fetching user forms:", error);
    }
  };
  const handleDownload = async (formId) => {
    try {
      // Make a GET request to download the response for the specified form
      const response = await axios.get(`https://earnkart.onrender.com/api/v1/forms/exceldownload/${formId}`, {
        responseType: "blob", // Set responseType to "blob" for binary data
      });
  
      // Create a temporary URL for the response blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
  
      // Create a temporary <a> element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `response_${formId}.xlsx`);
      document.body.appendChild(link);
  
      // Trigger the download
      link.click();
  
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading form response:", error);
    }
  };
  

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      render: (record) => (
        <>
          <Button onClick={() => handleDisapprove(record.id)}>Disapprove</Button>
          <Button onClick={() => handleFetchUserForms(record.id)}>View Forms</Button>
        </>
      ),
    },
  ];

  const formsColumns = [
    {
      title: "Form Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Download Response",
      dataIndex: "",
      key: "download",
      render: (record) => (
        <Button onClick={() => handleDownload(record._id)}>Download</Button>
      ),
    },
    
  ];

  return (
    <div>
      <h1 style={{ fontSize: "2rem", color: "#1890ff", textAlign: "center", marginBottom: "20px" }}>
        Customers List
      </h1>
      <Table columns={columns} dataSource={customers} />

      <Modal
        title="User Forms"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Table columns={formsColumns} dataSource={selectedUserForms} />
      </Modal>
    </div>
  );
}

export default Customer;

