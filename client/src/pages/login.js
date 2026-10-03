import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input } from "antd";
import { FiArrowLeft, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/alertsSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());

      const response = await axios.post("/api/user/login", values);

      dispatch(hideLoading());

      if (response.data.success) {
        toast.success(response.data.message);

        localStorage.setItem("token", response.data.data);

        navigate("/home");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());

      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="login-brand-section">
        <div className="login-brand-content">

          <Link to="/" className="login-logo">
            <span className="login-logo-icon">♡</span>
            <span>TakeCare</span>
          </Link>

          <div className="login-hero-content">
            <span className="login-badge">
              <span className="login-badge-dot"></span>
              Healthcare made simpler
            </span>

            <h1>
              Your healthcare,
              <br />
              <span>all in one place.</span>
            </h1>

            <p>
              Find trusted doctors, book appointments, and manage
              your healthcare journey with TakeCare.
            </p>

            <div className="login-trust">
              <div className="login-avatar-stack">
                <span>SM</span>
                <span>AK</span>
                <span>RS</span>
                <span>+</span>
              </div>

              <div>
                <div className="login-stars">★★★★★</div>
                <small>Simple care. Better experience.</small>
              </div>
            </div>
          </div>

          <div className="login-footer-text">
            Trusted healthcare appointment platform
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-form-section">

        <Link to="/" className="login-back">
          <FiArrowLeft />
          Back to home
        </Link>

        <div className="login-form-container">

          <div className="login-heading">
            <div className="login-mobile-logo">
              <span className="login-logo-icon">♡</span>
            </div>

            <h2>Welcome back</h2>

            <p>
              Sign in to continue to your TakeCare account.
            </p>
          </div>

          <Form
            layout="vertical"
            onFinish={onFinish}
            className="takecare-login-form"
          >

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
              <Input
                size="large"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password",
                },
              ]}
            >
              <Input
                size="large"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                suffix={
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                }
              />
            </Form.Item>

            <button
              type="submit"
              className="login-submit-button"
            >
              Sign in
              <FiArrowRight />
            </button>

          </Form>

          <div className="login-divider">
            <span>New to TakeCare?</span>
          </div>

          <Link
            to="/register"
            className="login-register-button"
          >
            Create an account
          </Link>

          <p className="login-bottom-text">
            By continuing, you agree to use TakeCare responsibly
            for healthcare appointment management.
          </p>

        </div>

      </div>
    </div>
  );
}