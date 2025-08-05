import React, { useState } from "react";
import "../layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {Badge} from 'antd'
function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const loaction = useLocation();
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
      name: "users",
      path: "/admin/userslist",
      icon: "ri-user-line",
    },
    {
      name: "Doctors",
      path: "/admin/doctorslist",
      icon: "ri-stethoscope-line",
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
      path: `/doctor/profile/$(user?._id)`,
      icon: "ri-account-box-line",
    },
  ];

  const menuToBeRenderded = user?.isAdmin ? adminMenu : user?.isDoctor?doctorMenu:userMenu;
  const role=user?.isAdmin?"Admin":user?.isDoctor?"Doctor":"User";
  return (
    <div className="main">
      <div className="d-flex layout">
        <div className="sidebar">
          <div className="sidebar-header">
            <h2>MEDO</h2>
            <h1 className="role">{role}</h1>
          </div>
          <div className="menu">
            {menuToBeRenderded.map((menu) => {
              const isActive = loaction.pathname === menu.path;
              return (
                <div
                  className={`d-flex menu-item ${
                    isActive && "active-menu-item"
                  }`}
                  key={menu.name}
                >
                  <i className={menu.icon}></i>
                  {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                </div>
              );
            })}
            <div
              className={`d-flex menu-item`}
              onClick={() => {
                localStorage.clear();
                 window.location.href = "/login";
              }}
            >
              <i className="ri-logout-circle-r-line"></i>
              {!collapsed && <Link to="/login">Logout</Link>}
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            {collapsed ? (
              <i
                className="ri-menu-2-fill header-action-icon"
                onClick={() => setCollapsed(false)}
              ></i>
            ) : (
              <i
                className="ri-close-fill header-action-icon"
                onClick={() => setCollapsed(true)}
              ></i>
            )}
            <div className="d-flex align-items-center px-4">
              <Badge count={user?.unseenNotification?.length||0}onClick={()=>navigate('/notification')}>
                <i className="ri-notification-3-line header-action-icon px-3"></i>
              </Badge>
              <Link className="anchor mx-2" to="/profile">
                {user?.name}
              </Link>
            </div>
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
      <div className="content"></div>
    </div>
  );
}

export default Layout;
