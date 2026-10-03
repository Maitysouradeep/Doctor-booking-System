import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Table, Tag } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import moment from "moment";
import {
  UserRound,
  CalendarDays,
  Phone,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

function Doctorslist() {
  const [doctor, setDoctor] = useState([]);
  const dispatch = useDispatch();

  const getDoctorsData = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.get("/api/admin/get-all-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      dispatch(hideLoading());

      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Unable to load doctors");
    }
  };

  const changeDoctorStatus = async (record, status) => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        "/api/admin/change-doctor-account-status",
        {
          doctorId: record._id,
          userId: record.userId,
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
        getDoctorsData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error changing doctor account status");
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  const getStatusTag = (status) => {
    if (status === "Approved") {
      return (
        <Tag color="success" icon={<CheckCircle2 size={12} />}>
          Approved
        </Tag>
      );
    }

    if (status === "Rejected") {
      return (
        <Tag color="error" icon={<XCircle size={12} />}>
          Rejected
        </Tag>
      );
    }

    return (
      <Tag color="warning" icon={<Clock3 size={12} />}>
        Pending
      </Tag>
    );
  };

  const columns = [
    {
      title: "Doctor",
      key: "doctor",
      render: (_, record) => (
        <div className="admin-doctor-cell">
          <div className="admin-doctor-avatar">
            {record.firstName?.charAt(0)?.toUpperCase() || "D"}
          </div>

          <div className="admin-doctor-info">
            <div className="admin-doctor-name">
              Dr. {record.firstName} {record.lastName}

              {record.status === "Approved" && (
                <CheckCircle2
                  size={15}
                  className="admin-doctor-verified"
                />
              )}
            </div>

            <span>
              {record.specialization || "Medical Specialist"}
            </span>
          </div>
        </div>
      ),
    },

    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => (
        <div className="admin-doctor-date">
          <CalendarDays size={15} />
          <span>
            {moment(createdAt).format("DD MMM YYYY")}
          </span>
        </div>
      ),
    },

    {
      title: "Phone",
      dataIndex: "phoneNo",
      key: "phoneNo",
      render: (phoneNo) => (
        <div className="admin-doctor-phone">
          <Phone size={15} />
          <span>{phoneNo}</span>
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
      key: "actions",
      render: (_, record) => (
        <div className="admin-doctor-actions">

          {record.status === "Pending" && (
            <>
              <button
                className="admin-doctor-approve"
                onClick={() =>
                  changeDoctorStatus(record, "Approved")
                }
              >
                <CheckCircle2 size={14} />
                Approve
              </button>

              <button
                className="admin-doctor-reject"
                onClick={() =>
                  changeDoctorStatus(record, "Rejected")
                }
              >
                <XCircle size={14} />
                Reject
              </button>
            </>
          )}

          {record.status === "Approved" && (
            <span className="admin-doctor-no-action">
              Account approved
            </span>
          )}

          {record.status === "Rejected" && (
            <button
              className="admin-doctor-approve"
              onClick={() =>
                changeDoctorStatus(record, "Approved")
              }
            >
              <CheckCircle2 size={14} />
              Approve
            </button>
          )}

        </div>
      ),
    },
  ];

  const pendingCount = doctor.filter(
    (item) => item.status === "Pending"
  ).length;

  const approvedCount = doctor.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedCount = doctor.filter(
    (item) => item.status === "Rejected"
  ).length;

  return (
    <Layout>
      <div className="admin-doctors-page">

        {/* Header */}

        <div className="admin-doctors-header">

          <div className="admin-doctors-heading">

            <div className="admin-doctors-icon">
              <UserRound />
            </div>

            <div>
              <span className="admin-doctors-eyebrow">
                ADMINISTRATION
              </span>

              <h1>Doctors</h1>

              <p>
                Review doctor applications and manage verification
                status.
              </p>
            </div>

          </div>


          {/* Stats */}

          <div className="admin-doctors-stats">

            <div className="admin-doctor-stat">
              <span>Total</span>
              <strong>{doctor.length}</strong>
            </div>

            <div className="admin-doctor-stat pending">
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>

            <div className="admin-doctor-stat approved">
              <span>Approved</span>
              <strong>{approvedCount}</strong>
            </div>

            <div className="admin-doctor-stat rejected">
              <span>Rejected</span>
              <strong>{rejectedCount}</strong>
            </div>

          </div>

        </div>


        {/* Doctors Table */}

        <div className="admin-doctors-card">

          <div className="admin-doctors-card-header">

            <div>
              <h2>Doctor applications</h2>

              <p>
                Review applications and approve or reject doctor
                accounts.
              </p>
            </div>

          </div>

          <Table
            columns={columns}
            dataSource={doctor}
            rowKey="_id"
            pagination={{
              pageSize: 8,
              hideOnSinglePage: true,
            }}
            locale={{
              emptyText: (
                <div className="admin-doctors-empty">

                  <div className="admin-doctors-empty-icon">
                    <UserRound size={27} />
                  </div>

                  <h3>No doctor applications</h3>

                  <p>
                    Doctor applications will appear here.
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

export default Doctorslist;

