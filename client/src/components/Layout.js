import React, { useState } from "react";
import "../layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge } from "antd";
import { FiMessageCircle } from "react-icons/fi";

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const location = useLocation();

  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-3-line",
    },
    {
      name: "Appointment",
      path: "/appointment",
      icon: "ri-file-list-3-line",
    },
    {
      name: "Apply As Doctor",
      path: "/apply-doctor",
      icon: "ri-stethoscope-line",
    },
  ];

  const adminMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-3-line",
    },
    {
      name: "Users",
      path: "/admin/userslist",
      icon: "ri-user-line",
    },
    {
      name: "Doctors",
      path: "/admin/doctorslist",
      icon: "ri-stethoscope-line",
    },
    {
      name: "Queries",
      path: "/admin/queries",
      icon: "ri-question-answer-line",
    },
  ];

  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-3-line",
    },
    {
      name: "Appointment",
      path: "/doctor/appointment",
      icon: "ri-file-list-3-line",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "ri-account-box-line",
    },
  ];

  const menuToBeRendered = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
      ? doctorMenu
      : userMenu;

  const role = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "Patient";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className={`app-layout ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside className="app-sidebar">
        {/* Logo */}

        <div className="app-sidebar-brand">
          <Link to="/" className="app-logo">
            <div className="app-logo-mark">
              <i className="ri-heart-pulse-line"></i>
            </div>

            {!collapsed && (
              <div className="app-logo-text">
                <strong>TakeCare</strong>
                <span>Healthcare</span>
              </div>
            )}
          </Link>
        </div>

        {/* Role */}

        {!collapsed && (
          <div className="app-role-card">
            <div className="app-role-avatar">
              <i className="ri-user-3-line"></i>
            </div>

            <div>
              <span>Signed in as</span>
              <strong>{role}</strong>
            </div>
          </div>
        )}

        {/* Navigation */}

        <nav className="app-navigation">
          {!collapsed && <span className="app-nav-label">MENU</span>}

          {menuToBeRendered.map((menu) => {
            const isActive = location.pathname === menu.path;

            return (
              <Link
                to={menu.path}
                className={`app-nav-item ${
                  isActive ? "app-nav-item-active" : ""
                }`}
                key={menu.name}
                title={collapsed ? menu.name : ""}
              >
                <i className={menu.icon}></i>

                {!collapsed && <span>{menu.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}

        <div className="app-sidebar-bottom">
          <button
            className="app-logout-button"
            onClick={handleLogout}
            title={collapsed ? "Logout" : ""}
          >
            <i className="ri-logout-circle-r-line"></i>

            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="app-main">
        {/* Header */}

        <header className="app-header">
          <button
            className="app-menu-toggle"
            onClick={() => setCollapsed(!collapsed)}
          >
            <i className={collapsed ? "ri-menu-2-line" : "ri-menu-3-line"}></i>
          </button>

          <div className="app-header-right">
            {/* Notifications */}

            <button
              className="app-notification-button"
              onClick={() => navigate("/notification")}
              title="Notifications"
            >
              <Badge count={user?.unseenNotification?.length || 0} size="small">
                <i className="ri-notification-3-line"></i>
              </Badge>
            </button>

            {/* User */}

            <Link
              className="app-user-profile"
              to={user?.isDoctor ? `/doctor/profile/${user?._id}` : "/"}
            >
              <div className="app-user-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="app-user-info">
                <strong>{user?.name}</strong>
                <span>{role}</span>
              </div>

              <i className="ri-arrow-down-s-line"></i>
            </Link>
          </div>
        </header>

        {/* Page */}

        <section className="app-body">{children}</section>
      </main>
      <button
        className="floating-query-button"
        onClick={() => navigate("/query")}
      >
        <FiMessageCircle />
        <span>Ask TakeCare</span>
      </button>
    </div>
  );
}

export default Layout;
