import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Table, Tag, Modal, Input } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import moment from "moment";
import {
  MessageCircleQuestion,
  UserRound,
  Stethoscope,
  CalendarDays,
  Eye,
  CheckCircle2,
} from "lucide-react";

function Querieslist() {
  const [queries, setQueries] = useState([]);

  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyText, setReplyText] = useState("");

  const dispatch = useDispatch();

  // =========================
  // GET ALL QUERIES
  // =========================
  const getQueriesData = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.get(
        "/api/admin/query/get-all-queries",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());

      if (response.data.success) {
        setQueries(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());

      console.error("Get queries error:", error);

      toast.error(
        error.response?.data?.message || "Unable to load queries"
      );
    }
  };

  // =========================
  // CHANGE QUERY STATUS
  // =========================
  const changeQueryStatus = async (record, status) => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        "/api/admin/query/change-query-status",
        {
          queryId: record._id,
          status,
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
        getQueriesData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());

      console.error("Change query status error:", error);

      toast.error(
        error.response?.data?.message ||
          "Error updating query status"
      );
    }
  };

  // =========================
  // OPEN REPLY MODAL
  // =========================
  const openReplyModal = (record) => {
    setSelectedQuery(record);
    setReplyText(record.reply || "");
    setReplyModalOpen(true);
  };

  // =========================
  // CLOSE REPLY MODAL
  // =========================
  const closeReplyModal = () => {
    setReplyModalOpen(false);
    setSelectedQuery(null);
    setReplyText("");
  };

  // =========================
  // SEND ADMIN REPLY
  // =========================
  const sendReply = async () => {
    if (!replyText.trim()) {
      toast.error("Please write a reply");
      return;
    }

    if (!selectedQuery) {
      toast.error("Query not selected");
      return;
    }

    try {
      dispatch(showLoading());

      const response = await axios.post(
        "/api/admin/reply-to-query",
        {
          queryId: selectedQuery._id,
          reply: replyText,
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

        closeReplyModal();

        getQueriesData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());

      console.error("Send reply error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to send reply"
      );
    }
  };

  useEffect(() => {
    getQueriesData();
  }, []);

  // =========================
  // STATUS TAG
  // =========================
  const getStatusTag = (status) => {
    if (status === "New") {
      return <Tag color="processing">New</Tag>;
    }

    if (status === "Viewed") {
      return <Tag color="warning">Viewed</Tag>;
    }

    if (status === "Resolved") {
      return <Tag color="success">Resolved</Tag>;
    }

    return <Tag>{status}</Tag>;
  };

  // =========================
  // TABLE COLUMNS
  // =========================
  const columns = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div className="admin-query-user">
          <div className="admin-query-avatar">
            {record.userName?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <strong>{record.userName}</strong>
            <span>{record.userEmail}</span>
          </div>
        </div>
      ),
    },

    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <div className="admin-query-role">
          {role === "doctor" ? (
            <Stethoscope size={15} />
          ) : (
            <UserRound size={15} />
          )}

          <span>
            {role === "doctor" ? "Doctor" : "Patient"}
          </span>
        </div>
      ),
    },

    {
      title: "Question",
      dataIndex: "question",
      key: "question",
      render: (question) => (
        <div className="admin-query-question">
          {question}
        </div>
      ),
    },

    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => (
        <div className="admin-query-date">
          <CalendarDays size={15} />

          <span>
            {moment(createdAt).format("DD MMM YYYY")}
          </span>
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
        if (record.status === "New") {
          return (
            <div className="admin-query-actions">
              <button
                className="admin-query-action-button"
                onClick={() =>
                  changeQueryStatus(record, "Viewed")
                }
              >
                <Eye size={14} />
                Mark viewed
              </button>

              <button
                className="admin-query-action-button reply"
                onClick={() => openReplyModal(record)}
              >
                Reply
              </button>
            </div>
          );
        }

        if (record.status === "Viewed") {
          return (
            <div className="admin-query-actions">
              <button
                className="admin-query-action-button resolved"
                onClick={() =>
                  changeQueryStatus(record, "Resolved")
                }
              >
                <CheckCircle2 size={14} />
                Resolve
              </button>

              <button
                className="admin-query-action-button reply"
                onClick={() => openReplyModal(record)}
              >
                Reply
              </button>
            </div>
          );
        }

        return (
          <button
            className="admin-query-action-button"
            onClick={() => openReplyModal(record)}
          >
            {record.reply ? "View reply" : "Reply"}
          </button>
        );
      },
    },
  ];

  // =========================
  // COUNTS
  // =========================
  const newCount = queries.filter(
    (item) => item.status === "New"
  ).length;

  const viewedCount = queries.filter(
    (item) => item.status === "Viewed"
  ).length;

  const resolvedCount = queries.filter(
    (item) => item.status === "Resolved"
  ).length;

  return (
    <Layout>
      <div className="admin-queries-page">

        {/* ================= HEADER ================= */}

        <div className="admin-queries-header">
          <div className="admin-queries-heading">

            <div className="admin-queries-icon">
              <MessageCircleQuestion />
            </div>

            <div>
              <span className="admin-queries-eyebrow">
                ADMINISTRATION
              </span>

              <h1>Queries</h1>

              <p>
                Review questions and support requests
                submitted by patients and doctors.
              </p>
            </div>

          </div>

          <div className="admin-queries-stats">

            <div className="admin-query-stat">
              <span>Total</span>
              <strong>{queries.length}</strong>
            </div>

            <div className="admin-query-stat new">
              <span>New</span>
              <strong>{newCount}</strong>
            </div>

            <div className="admin-query-stat viewed">
              <span>Viewed</span>
              <strong>{viewedCount}</strong>
            </div>

            <div className="admin-query-stat resolved">
              <span>Resolved</span>
              <strong>{resolvedCount}</strong>
            </div>

          </div>
        </div>

        {/* ================= TABLE ================= */}

        <div className="admin-queries-card">

          <div className="admin-queries-card-header">
            <div>
              <h2>Support queries</h2>

              <p>
                Questions submitted by TakeCare users.
              </p>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={queries}
            rowKey="_id"
            pagination={{
              pageSize: 8,
              hideOnSinglePage: true,
            }}
            locale={{
              emptyText: (
                <div className="admin-query-empty">

                  <MessageCircleQuestion size={38} />

                  <h3>No queries yet</h3>

                  <p>
                    User questions will appear here.
                  </p>

                </div>
              ),
            }}
          />

        </div>

        {/* ================= REPLY MODAL ================= */}

        <Modal
          title="Reply to query"
          open={replyModalOpen}
          onCancel={closeReplyModal}
          onOk={sendReply}
          okText="Send reply"
          cancelText="Cancel"
          centered
        >
          {selectedQuery && (
            <div className="admin-query-reply-modal">

              <div className="admin-query-reply-user">
                <div className="admin-query-avatar">
                  {selectedQuery.userName
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </div>

                <div>
                  <strong>
                    {selectedQuery.userName}
                  </strong>

                  <span>
                    {selectedQuery.userEmail}
                  </span>
                </div>
              </div>

              <div className="admin-query-original-question">
                <span>USER QUESTION</span>

                <p>
                  {selectedQuery.question}
                </p>
              </div>

              <div className="admin-query-reply-field">
                <label>Admin reply</label>

                <Input.TextArea
                  rows={5}
                  placeholder="Write your response to the user..."
                  value={replyText}
                  onChange={(e) =>
                    setReplyText(e.target.value)
                  }
                  maxLength={1000}
                  showCount
                />
              </div>

              {selectedQuery.reply && (
                <div className="admin-query-existing-reply">
                  <span>PREVIOUS REPLY</span>

                  <p>{selectedQuery.reply}</p>

                  {selectedQuery.repliedAt && (
                    <small>
                      Replied on{" "}
                      {moment(
                        selectedQuery.repliedAt
                      ).format("DD MMM YYYY, hh:mm A")}
                    </small>
                  )}
                </div>
              )}

            </div>
          )}
        </Modal>

      </div>
    </Layout>
  );
}

export default Querieslist;