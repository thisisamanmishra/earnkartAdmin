import React, { useRef, useEffect, useState } from "react";
import { Form, Input, InputNumber, Space, Divider, Row, Col } from "antd";

import { Layout, Breadcrumb, Statistic, Progress, Tag, Button } from "antd";

import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import axios from "axios";

import { DashboardLayout } from "@/layout";
import RecentTable from "@/components/RecentTable";

const TopCard = ({ title, tagContent, tagColor, prefix }) => {
  return (
    <Col className="gutter-row" span={6}>
      <div
        className="whiteBox shadow"
        style={{ color: "#595959", fontSize: 13, height: "106px" }}
      >
        <div
          className="pad15 strong"
          style={{ textAlign: "center", justifyContent: "center" }}
        >
          <h3 style={{ color: "#22075e", marginBottom: 0 }}>{title}</h3>
        </div>
        <Divider style={{ padding: 0, margin: 0 }}></Divider>
        <div className="pad15">
          <Row gutter={[0, 0]}>
            <Col className="gutter-row" span={11} style={{ textAlign: "left" }}>
              <div className="left">{prefix}</div>
            </Col>
            <Col className="gutter-row" span={2}>
              <Divider
                style={{ padding: "10px 0", justifyContent: "center" }}
                type="vertical"
              ></Divider>
            </Col>
            <Col
              className="gutter-row"
              span={11}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Tag
                color={tagColor}
                style={{ margin: "0 auto", justifyContent: "center" }}
              >
                {tagContent}
              </Tag>
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  );
};
const PreviewState = ({ tag, color, value }) => {
  let colorCode = "#000";
  switch (color) {
    case "bleu":
      colorCode = "#1890ff";
      break;
    case "green":
      colorCode = "#95de64";
      break;
    case "red":
      colorCode = "#ff4d4f";
      break;
    case "orange":
      colorCode = "#ffa940";
      break;
    case "purple":
      colorCode = "#722ed1";
      break;
    case "grey":
      colorCode = "#595959";
      break;
    case "cyan":
      colorCode = "#13c2c2";
      break;
    case "brown":
      colorCode = "#614700";
      break;
    default:
      break;
  }
  return (
    <div style={{ color: "#595959", marginBottom: 5 }}>
      <div className="left alignLeft">{tag}</div>
      <div className="right alignRight">{value} %</div>
      <Progress
        percent={value}
        showInfo={false}
        strokeColor={{
          "0%": colorCode,
          "100%": colorCode,
        }}
      />
    </div>
  );
};
export default function Dashboard() {

  const [disapprovedUsers, setDisapprovedUsers] = useState([]);
  const [disUserCount, setDisUserCount] = useState(0);

useEffect(() => {
  const fetchDisapprovedUsers = async () => {
    try {
      const response = await axios.get("https://earnkart.onrender.com/api/v1/auth/users/disapproved");
      const users = response.data?.data?.users; // Use optional chaining to handle undefined data
      if (users) {
        setDisapprovedUsers(users);
        setDisUserCount(users.length);
      } else {
        console.error("Error: Users data is undefined");
      }
    } catch (error) {
      console.error("Error fetching disapproved users:", error);
    }
  };

  fetchDisapprovedUsers();
}, []);

const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get("https://earnkart.onrender.com/api/v1/auth/users");
        setUserCount(response.data?.data?.users.length || 0);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchUserCount();
  }, []);

  const [appUserCount, setAppUserCount] = useState(0);

  useEffect(() => {
    const fetchAppUserCount = async () => {
      try {
        const response = await axios.get("https://earnkart.onrender.com/api/v1/auth/users/approved");
        setAppUserCount(response.data?.data?.users.length || 0);
        console.log(appUserCount);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchAppUserCount();
  }, []);

 // Function to handle approval of user
 const handleApprove = async (row) => {
  try {
    const userId = row.id; // Assuming the user ID field in the row object is 'id'
    const response = await fetch(`https://earnkart.onrender.com/api/v1/auth/${userId}/approve`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to approve user');
    }
    // After approval, you might want to update the state to remove the approved user from the list
    setDisapprovedUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== userId)
    );
  } catch (error) {
    console.error('Error approving user:', error);
  }
};


const leadColumns = [
  {
    title: "User",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email"
  },
  {
    title: "Actions",
    key: "actions",
    render: (row) => (
      <Button type="primary" onClick={() => handleApprove(row)}>
        Approve
      </Button>
    ),
  },
];

  

  return (
    <DashboardLayout>
      <Row gutter={[24, 24]}>
        <TopCard
          title={"Total Leads"}
          tagColor={"cyan"}
          prefix={"User"}
          tagContent={userCount}
        />
        <TopCard
          title={"Active User"}
          tagColor={"purple"}
          prefix={"User"}
          tagContent={appUserCount}
        />
        <TopCard
          title={"Inactive User"}
          tagColor={"green"}
          prefix={"User"}
          tagContent={disUserCount}
        />
        {/* <TopCard
          title={""}
          tagColor={"red"}
          prefix={"Not Paid"}
          tagContent={"34 000 $"}
        /> */}
      </Row>
      <div className="space30"></div>
      <Row gutter={[24, 24]}>
        <Col className="gutter-row" span={18}>
          <div className="whiteBox shadow" style={{ height: "380px" }}>
            <Row className="pad10" gutter={[0, 0]}>
              <Col className="gutter-row" span={8}>
                <div className="pad15">
                  <h3 style={{ color: "#22075e", marginBottom: 15 }}>
                    Lead Preview
                  </h3>
                  <PreviewState tag={"Draft"} color={"grey"} value={3} />
                  <PreviewState tag={"Pending"} color={"bleu"} value={5} />
                  <PreviewState tag={"Not Paid"} color={"orange"} value={12} />
                  <PreviewState tag={"Overdue"} color={"red"} value={6} />
                  <PreviewState
                    tag={"Partially Paid"}
                    color={"cyan"}
                    value={8}
                  />
                  <PreviewState tag={"Paid"} color={"green"} value={55} />
                </div>
              </Col>
              <Col className="gutter-row" span={8}>
                {" "}
                <div className="pad15">
                  <h3 style={{ color: "#22075e", marginBottom: 15 }}>
                    Quote Preview
                  </h3>
                  <PreviewState tag={"Draft"} color={"grey"} value={3} />
                  <PreviewState tag={"Pending"} color={"bleu"} value={5} />
                  <PreviewState tag={"Not Paid"} color={"orange"} value={12} />
                  <PreviewState tag={"Overdue"} color={"red"} value={6} />
                  <PreviewState
                    tag={"Partially Paid"}
                    color={"cyan"}
                    value={8}
                  />
                  <PreviewState tag={"Paid"} color={"green"} value={55} />
                </div>
              </Col>
              <Col className="gutter-row" span={8}>
                {" "}
                <div className="pad15">
                  <h3 style={{ color: "#22075e", marginBottom: 15 }}>
                    Order Preview
                  </h3>
                  <PreviewState tag={"Draft"} color={"grey"} value={3} />
                  <PreviewState tag={"Pending"} color={"bleu"} value={5} />
                  <PreviewState tag={"Not Paid"} color={"orange"} value={12} />
                  <PreviewState tag={"Overdue"} color={"red"} value={6} />
                  <PreviewState
                    tag={"Partially Paid"}
                    color={"cyan"}
                    value={8}
                  />
                  <PreviewState tag={"Paid"} color={"green"} value={55} />
                </div>
              </Col>
            </Row>
          </div>
        </Col>

        <Col className="gutter-row" span={6}>
          <div className="whiteBox shadow" style={{ height: "380px" }}>
            <div
              className="pad20"
              style={{ textAlign: "center", justifyContent: "center" }}
            >
              <h3 style={{ color: "#22075e", marginBottom: 30 }}>
                Customer Preview
              </h3>

              <Progress type="dashboard" percent={disUserCount} width={148} />
              <p>New Customer this Month</p>
              <Divider />
              <Statistic
                title="Active Customer"
                value={appUserCount}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                prefix={<ArrowUpOutlined />}
              />
            </div>
          </div>
        </Col>
      </Row>
      <div className="space30"></div>
      <Row gutter={[24, 24]}>
        <Col className="gutter-row" span={12}>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: "#22075e", marginBottom: 5 }}>
                Recent Leads
              </h3>
            </div>

            <RecentTable data={disapprovedUsers} dataTableColumns={leadColumns} />
          </div>
        </Col>
      </Row>
    </DashboardLayout>
  );
}
