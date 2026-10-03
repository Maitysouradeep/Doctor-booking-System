import { Link, useNavigate } from "react-router-dom";
import { Form, Input } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../redux/alertsSlice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());

      const response = await axios.post("/api/user/register", values);

      dispatch(hideLoading());

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="register-page">
      {/* LEFT SIDE */}
      <section className="register-visual">
        <Link to="/" className="register-logo">
          <span className="register-logo-icon">♡</span>
          <span>TakeCare</span>
        </Link>

        <div className="register-visual-content">
          <div className="register-badge">
            <span className="register-badge-dot"></span>
            Healthcare made simpler
          </div>

          <h1>
            Start your
            <br />
            <span>healthcare</span>
            <br />
            journey today.
          </h1>

          <p>
            Create your TakeCare account and discover trusted doctors,
            convenient appointments, and simpler healthcare management.
          </p>

          <div className="register-trust">
            <div className="register-avatars">
              <span>SM</span>
              <span>AK</span>
              <span>RS</span>
              <span>+</span>
            </div>

            <div className="register-rating">
              <div>★★★★★</div>
              <small>Simple care. Better experience.</small>
            </div>
          </div>
        </div>

        <div className="register-footer-text">
          Trusted healthcare appointment platform
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="register-form-section">
        <Link to="/" className="register-back">
          ← &nbsp; Back to home
        </Link>

        <div className="register-form-wrapper">
          <div className="register-icon">♡</div>

          <h2>Create your account</h2>

          <p className="register-subtitle">
            Join TakeCare and make healthcare easier.
          </p>

          <Form
            layout="vertical"
            onFinish={onFinish}
            className="register-form"
          >
            <Form.Item
              label="Full name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter your name",
                },
              ]}
            >
              <Input placeholder="Your name" />
            </Form.Item>

            <Form.Item
              label="Email address"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email",
                },
                {
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input placeholder="you@example.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter a password",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters",
                },
              ]}
            >
              <Input.Password placeholder="Create a password" />
            </Form.Item>

            <button
              type="submit"
              className="register-submit"
            >
              Create account
              <span>→</span>
            </button>
          </Form>

          <div className="register-login-divider">
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className="register-login-button">
            Sign in to TakeCare
          </Link>

          <p className="register-terms">
            By creating an account, you agree to use TakeCare responsibly
            for healthcare appointment management.
          </p>
        </div>
      </section>
    </div>
  );
}