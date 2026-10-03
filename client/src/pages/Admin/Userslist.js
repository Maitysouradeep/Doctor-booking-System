import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Table, Tag } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import moment from "moment";
import {
  Mail,
  UserRound,
  CalendarDays,
  ShieldCheck,
  Ban,
} from "lucide-react";

function Userslist() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const getUsersData = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.get("/api/admin/get-all-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      dispatch(hideLoading());

      if (response.data.success) {
        setUsers([...response.data.data].reverse());
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Unable to load users");
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const columns = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div className="admin-user-cell">
          <div className="admin-user-avatar">
            {record.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="admin-user-info">
            <strong>{record.name}</strong>
            <span>Patient</span>
          </div>
        </div>
      ),
    },

    {
      title: "Email",
      key: "email",
      render: (_, record) => (
        <div className="admin-email-cell">
          <Mail size={15} />
          <span>{record.email}</span>
        </div>
      ),
    },

    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => (
        <div className="admin-date-cell">
          <CalendarDays size={15} />
          <span>
            {moment(createdAt).format("DD MMM YYYY")}
          </span>
        </div>
      ),
    },

    {
      title: "Account",
      key: "account",
      render: () => (
        <Tag
          color="success"
          icon={<ShieldCheck size={12} />}
        >
          Active
        </Tag>
      ),
    },

    {
      title: "Action",
      key: "actions",
      render: () => (
        <button
          className="admin-block-button"
          onClick={() =>
            toast("User blocking is not enabled yet.")
          }
        >
          <Ban size={14} />
          Block
        </button>
      ),
    },
  ];

  return (
    <Layout>
      <div className="admin-users-page">

        {/* Header */}

        <div className="admin-users-header">

          <div className="admin-users-heading">
            <div className="admin-users-icon">
              <UserRound />
            </div>

            <div>
              <span className="admin-users-eyebrow">
                ADMINISTRATION
              </span>

              <h1>Users</h1>

              <p>
                Manage registered patients and review their account
                information.
              </p>
            </div>
          </div>

          <div className="admin-users-count">
            <strong>{users.length}</strong>
            <span>Registered users</span>
          </div>

        </div>


        {/* Table */}

        <div className="admin-users-card">

          <div className="admin-users-card-header">
            <div>
              <h2>Registered users</h2>
              <p>
                Latest registered users are shown first.
              </p>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={users}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              hideOnSinglePage: true,
            }}
            locale={{
              emptyText: (
                <div className="admin-users-empty">
                  <div className="admin-users-empty-icon">
                    <UserRound size={27} />
                  </div>

                  <h3>No users found</h3>

                  <p>
                    Registered users will appear here.
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

export default Userslist;