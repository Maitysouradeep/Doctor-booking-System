import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import Layout from "../components/Layout";
import {
  ArrowLeft,
  MessageCircleQuestion,
  UserRound,
  Stethoscope,
  Send,
  CheckCircle2,
  Clock3,
  Eye,
  MessageCircle,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function Query() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [role, setRole] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [customQuestion, setCustomQuestion] = useState("");

  const [myQueries, setMyQueries] = useState([]);
  const [loadingQueries, setLoadingQueries] = useState(false);

  const patientQuestions = [
    "How can I book an appointment?",
    "How can I cancel an appointment?",
    "How can I check my appointment status?",
    "How do I find a doctor?",
    "I am facing an issue with my account.",
  ];

  const doctorQuestions = [
    "How do I update my doctor profile?",
    "How can I manage appointments?",
    "How can I get my doctor account approved?",
    "How can I update my availability?",
    "I am facing an issue with my account.",
  ];

  const questions =
    role === "patient"
      ? patientQuestions
      : role === "doctor"
        ? doctorQuestions
        : [];

  // GET LOGGED-IN USER'S QUERIES
  const getMyQueries = async () => {
    try {
      setLoadingQueries(true);

      const response = await axios.get("/api/query/my-queries", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setMyQueries(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Get my queries error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load your queries"
      );
    } finally {
      setLoadingQueries(false);
    }
  };

  useEffect(() => {
    getMyQueries();
  }, []);

  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question);
    setCustomQuestion("");
  };

  const handleCustomQuestion = (e) => {
    setCustomQuestion(e.target.value);
    setSelectedQuestion("");
  };

  const finalQuestion = customQuestion.trim() || selectedQuestion;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      toast.error("Please select whether you are a patient or doctor");
      return;
    }

    if (!finalQuestion) {
      toast.error("Please select or write a question");
      return;
    }

    try {
      dispatch(showLoading());

      const response = await axios.post(
        "/api/query/create-query",
        {
          role,
          question: finalQuestion,
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

        setSelectedQuestion("");
        setCustomQuestion("");

        // Refresh user's query list
        getMyQueries();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());

      console.error("Submit query error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to submit query"
      );
    }
  };

  const getStatusIcon = (status) => {
    if (status === "New") {
      return <Clock3 size={15} />;
    }

    if (status === "Viewed") {
      return <Eye size={15} />;
    }

    if (status === "Resolved") {
      return <CheckCircle2 size={15} />;
    }

    return <Clock3 size={15} />;
  };

  return (
    <Layout>
      <div className="query-page">
        {/* Back */}
        <button
          className="query-back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={17} />
          Back
        </button>

        {/* Header */}
        <div className="query-header">
          <div className="query-header-icon">
            <MessageCircleQuestion size={25} />
          </div>

          <div>
            <span className="query-eyebrow">
              TAKECARE SUPPORT
            </span>

            <h1>How can we help?</h1>

            <p>
              Send your question to the TakeCare administration team.
            </p>
          </div>
        </div>

        {/* CREATE QUERY */}
        <div className="query-card">
          {/* Step 1 */}
          <div className="query-step">
            <div className="query-step-number">1</div>

            <div className="query-step-content">
              <h2>Who are you?</h2>

              <p>
                Select your account type to see relevant questions.
              </p>

              <div className="query-role-options">
                <button
                  type="button"
                  className={`query-role-card ${
                    role === "patient" ? "active" : ""
                  }`}
                  onClick={() => {
                    setRole("patient");
                    setSelectedQuestion("");
                    setCustomQuestion("");
                  }}
                >
                  <div className="query-role-icon">
                    <UserRound size={22} />
                  </div>

                  <div>
                    <strong>Patient</strong>

                    <span>
                      I'm using TakeCare to find healthcare.
                    </span>
                  </div>

                  {role === "patient" && (
                    <CheckCircle2
                      className="query-role-check"
                      size={19}
                    />
                  )}
                </button>

                <button
                  type="button"
                  className={`query-role-card ${
                    role === "doctor" ? "active" : ""
                  }`}
                  onClick={() => {
                    setRole("doctor");
                    setSelectedQuestion("");
                    setCustomQuestion("");
                  }}
                >
                  <div className="query-role-icon">
                    <Stethoscope size={22} />
                  </div>

                  <div>
                    <strong>Doctor</strong>

                    <span>
                      I'm providing healthcare through TakeCare.
                    </span>
                  </div>

                  {role === "doctor" && (
                    <CheckCircle2
                      className="query-role-check"
                      size={19}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          {role && (
            <div className="query-step">
              <div className="query-step-number">2</div>

              <div className="query-step-content">
                <h2>What do you need help with?</h2>

                <p>
                  Choose a common question or write your own.
                </p>

                <div className="query-question-list">
                  {questions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      className={`query-question ${
                        selectedQuestion === question
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handleQuestionSelect(question)
                      }
                    >
                      {question}

                      {selectedQuestion === question && (
                        <CheckCircle2 size={17} />
                      )}
                    </button>
                  ))}
                </div>

                <div className="query-divider">
                  <span>OR</span>
                </div>

                <textarea
                  value={customQuestion}
                  onChange={handleCustomQuestion}
                  placeholder="Write your question here..."
                  rows={5}
                  className="query-textarea"
                />

                <div className="query-submit-wrapper">
                  <button
                    type="button"
                    className="query-submit-button"
                    disabled={!finalQuestion}
                    onClick={handleSubmit}
                  >
                    <Send size={17} />
                    Send query
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MY QUERIES */}
        <div className="my-queries-section">
          <div className="my-queries-header">
            <div>
              <span className="query-eyebrow">
                SUPPORT HISTORY
              </span>

              <h2>My queries</h2>

              <p>
                View your submitted questions and responses from
                the TakeCare team.
              </p>
            </div>

            <MessageCircle size={24} />
          </div>

          {loadingQueries ? (
            <div className="my-queries-empty">
              Loading your queries...
            </div>
          ) : myQueries.length === 0 ? (
            <div className="my-queries-empty">
              <MessageCircleQuestion size={35} />

              <h3>No queries yet</h3>

              <p>
                Your submitted support questions will appear here.
              </p>
            </div>
          ) : (
            <div className="my-queries-list">
              {myQueries.map((query) => (
                <div
                  className="my-query-card"
                  key={query._id}
                >
                  <div className="my-query-top">
                    <div className="my-query-question">
                      <div className="my-query-icon">
                        <MessageCircleQuestion size={18} />
                      </div>

                      <div>
                        <span>YOUR QUESTION</span>

                        <h3>{query.question}</h3>
                      </div>
                    </div>

                    <div
                      className={`my-query-status ${query.status
                        ?.toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {getStatusIcon(query.status)}
                      {query.status}
                    </div>
                  </div>

                  <div className="my-query-meta">
                    <span>
                      <CalendarDays size={14} />

                      {moment(query.createdAt).format(
                        "DD MMM YYYY, hh:mm A"
                      )}
                    </span>

                    <span>
                      {query.role === "doctor" ? (
                        <Stethoscope size={14} />
                      ) : (
                        <UserRound size={14} />
                      )}

                      {query.role === "doctor"
                        ? "Doctor"
                        : "Patient"}
                    </span>
                  </div>

                  {/* ADMIN REPLY */}
                  {query.reply ? (
                    <div className="my-query-reply">
                      <div className="my-query-reply-header">
                        <div className="my-query-reply-icon">
                          <MessageCircle size={17} />
                        </div>

                        <div>
                          <span>TAKECARE ADMIN</span>
                          <strong>Response</strong>
                        </div>
                      </div>

                      <p>{query.reply}</p>

                      {query.repliedAt && (
                        <small>
                          Replied on{" "}
                          {moment(query.repliedAt).format(
                            "DD MMM YYYY, hh:mm A"
                          )}
                        </small>
                      )}
                    </div>
                  ) : (
                    <div className="my-query-waiting">
                      <Clock3 size={16} />

                      <span>
                        Your query has been received. The
                        TakeCare team hasn't replied yet.
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Query;