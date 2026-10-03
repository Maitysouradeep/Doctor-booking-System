import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Table, Tag } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import moment from "moment";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Phone,
  UserRound,
  XCircle,
} from "lucide-react";

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
      toast.error("Unable to load appointments");
    }
  };

  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        "/api/doctor/change-appointment-status",
        {
          appointmentId: record._id,
          status: status,
        },
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
      toast.error("Error changing appointment status");
      dispatch(hideLoading());
    }
  };

  const getStatusTag = (status) => {
    if (status === "Approved") {
      return (
        <Tag
          color="success"
          icon={<CheckCircle2 size={12} />}
        >
          Approved
        </Tag>
      );
    }

    if (status === "Rejected") {
      return (
        <Tag
          color="error"
          icon={<XCircle size={12} />}
        >
          Rejected
        </Tag>
      );
    }

    return (
      <Tag
        color="warning"
        icon={<Clock3 size={12} />}
      >
        Pending
      </Tag>
    );
  };

  const columns = [
    {
      title: "Patient",
      key: "patient",
      render: (_, record) => (
        <div className="doctor-appointment-patient">
          <div className="doctor-appointment-avatar">
            <UserRound size={18} />
          </div>

          <div>
            <strong>{record.userInfo.name}</strong>
            <span>Patient</span>
          </div>
        </div>
      ),
    },

    {
      title: "Appointment",
      key: "appointment",
      render: (_, record) => (
        <div className="doctor-appointment-date">
          <div>
            <CalendarDays size={15} />
            <span>
              {moment(record.date).format("DD MMM YYYY")}
            </span>
          </div>

          <div>
            <Clock3 size={15} />
            <span>
              {moment(record.time, "HH:mm").format("hh:mm A")}
            </span>
          </div>
        </div>
      ),
    },

    {
      title: "Phone",
      key: "phone",
      render: (_, record) => (
        <div className="doctor-appointment-phone">
          <Phone size={15} />
          <span>{record.userInfo.phoneNo || record.doctorInfo.phoneNo}</span>
        </div>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        if (record.status.toLowerCase() !== "pending") {
          return (
            <span className="doctor-appointment-completed">
              No action required
            </span>
          );
        }

        return (
          <div className="doctor-appointment-actions">
            <button
              className="doctor-approve-button"
              onClick={() =>
                changeAppointmentStatus(record, "Approved")
              }
            >
              <CheckCircle2 size={14} />
              Approve
            </button>

            <button
              className="doctor-reject-button"
              onClick={() =>
                changeAppointmentStatus(record, "Rejected")
              }
            >
              <XCircle size={14} />
              Reject
            </button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getAppointmentData();
  }, []);

  const pendingCount = appointment.filter(
    (item) => item.status.toLowerCase() === "pending"
  ).length;

  const approvedCount = appointment.filter(
    (item) => item.status === "Approved"
  ).length;

  return (
    <Layout>
      <div className="doctor-appointments-page">

        {/* Header */}

        <div className="doctor-appointments-header">
          <div>
            <span className="doctor-appointments-eyebrow">
              DOCTOR DASHBOARD
            </span>

            <h1>Appointments</h1>

            <p>
              Review and manage your upcoming patient appointments.
            </p>
          </div>

          <div className="doctor-appointments-stats">

            <div className="doctor-appointment-stat">
              <span>Total</span>
              <strong>{appointment.length}</strong>
            </div>

            <div className="doctor-appointment-stat pending">
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>

            <div className="doctor-appointment-stat approved">
              <span>Approved</span>
              <strong>{approvedCount}</strong>
            </div>

          </div>
        </div>


        {/* Table */}

        <div className="doctor-appointments-card">

          <div className="doctor-appointments-card-header">
            <div>
              <h2>Patient appointments</h2>
              <p>
                Review appointment requests and update their status.
              </p>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={appointment}
            rowKey="_id"
            pagination={{
              pageSize: 8,
              hideOnSinglePage: true,
            }}
            locale={{
              emptyText: (
                <div className="doctor-appointments-empty">
                  <div className="doctor-appointments-empty-icon">
                    <CalendarDays size={28} />
                  </div>

                  <h3>No appointments yet</h3>

                  <p>
                    Patient appointment requests will appear here.
                  </p>
                </div>
              ),
            }}
          />

        </div>

      </div>
    </Layout>
  );
}

export default DoctorAppointment;
