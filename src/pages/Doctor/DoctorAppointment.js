import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Table } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import moment from "moment";

function DoctorAppointment() {
  const [appointment, setAppointment] = useState([]);
  const dispatch = useDispatch();
  const getAppointmentData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "/api/doctor/get-appointment-by-doctor-id",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointment(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };
  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/change-appointment-status",
        { appointmentId: record._id, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getAppointmentData();
      }
    } catch (error) {
      toast.error("error changing doctor account status");
      dispatch(hideLoading());
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Patient",
      dataIndex: "name",
      render: (text, record) => <span>{record.userInfo.name}</span>,
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")}{" "}
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNo",
      render: (text, record) => <span>{record.doctorInfo.phoneNo}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status.toLowerCase() === "pending" && (
            <div className="d-flex">
              <h1
                className="anchor px-2"
                onClick={() => changeAppointmentStatus(record, "Approved")}
              >
                Approve
              </h1>
              <h1
                className="anchor"
                onClick={() => changeAppointmentStatus(record, "Rejected")}
              >
                Reject
              </h1>
            </div>
          )}
        </div>
      ),
    },
  ];
  useEffect(() => {
    getAppointmentData();
  }, []);

  return (
    <Layout>
      <h1 className="page-header">Appointment</h1>
      <Table columns={columns} dataSource={appointment} />
    </Layout>
  );
}

export default DoctorAppointment;
