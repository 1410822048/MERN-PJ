import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import "../styles/style.css";

const NavComponent = ({ currentUser, setCurrentUser }) => {
  const Navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const HandleLogOut = async function () {
    try {
      await AuthService.logout();
      setCurrentUser(null);
    } catch (e) {}
    Navigate("/"); // 跳轉到首頁
  };

  useEffect(() => {
    if (currentUser) {
      setDropdownOpen(false); // 如果有登錄，用戶不會自動開啟下拉選單
    }
  }, [currentUser]);

  const handleMouseEnter = () => setDropdownOpen(true);
  const handleMouseLeave = () => setDropdownOpen(false);
  const handleLinkClick = () => setDropdownOpen(false);

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-light"
        style={{
          backgroundColor: "#2C1A65",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ borderColor: "#FFD700" }}
          >
            <span
              className="navbar-toggler-icon"
              style={{ backgroundColor: "#FFD700" }}
            ></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/"
                  style={{ color: "#FFF", fontSize: "16px", fontWeight: "600" }}
                >
                  首頁
                </Link>
              </li>
              {!currentUser && (
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/register"
                    style={{
                      color: "#FFF",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    註冊會員
                  </Link>
                </li>
              )}
              {!currentUser && (
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/login"
                    style={{
                      color: "#FFF",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    會員登入
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {currentUser && (
            <div
              className="dropdown"
              style={{
                position: "relative",
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={handleMouseEnter}
            >
              <div
                className="profile-pic"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  border: "2px solid #FFD700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <img
                  src="/images/profile.png"
                  alt="User Avatar"
                  style={{
                    width: "120%",
                    height: "120%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div
                className="dropdown-menu"
                style={{
                  position: "absolute",
                  top: "50px",
                  right: "0",
                  backgroundColor: "#2C1A65",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  display: dropdownOpen ? "block" : "none",
                  zIndex: 9999,
                }}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  className="dropdown-item"
                  to="/profile"
                  style={{
                    color: "#FFF",
                    fontWeight: "600",
                    padding: "10px 15px",
                    fontSize: "14px",
                    transition: "background-color 0.2s ease, color 0.2s ease",
                  }}
                  onClick={handleLinkClick}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#FFD700"; // 懸停時改變背景色
                    e.target.style.color = "#2C1A65"; // 懸停時改變文字顏色
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent"; // 離開時恢復背景色
                    e.target.style.color = "#FFF"; // 恢復文字顏色
                  }}
                >
                  個人頁面
                </Link>
                <Link
                  className="dropdown-item"
                  to="/course"
                  style={{
                    color: "#FFF",
                    fontWeight: "600",
                    padding: "10px 15px",
                    fontSize: "14px",
                    transition: "background-color 0.2s ease, color 0.2s ease",
                  }}
                  onClick={handleLinkClick}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#FFD700"; // 懸停時改變背景色
                    e.target.style.color = "#2C1A65"; // 懸停時改變文字顏色
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent"; // 離開時恢復背景色
                    e.target.style.color = "#FFF"; // 恢復文字顏色
                  }}
                >
                  課程頁面
                </Link>
                {currentUser &&
                  currentUser.user.role === "Instructor" && ( // 只有 Instructor 顯示新增課程
                    <Link
                      className="dropdown-item"
                      to="/postCourse"
                      style={{
                        color: "#FFF",
                        fontWeight: "600",
                        padding: "10px 15px",
                        fontSize: "14px",
                        transition:
                          "background-color 0.2s ease, color 0.2s ease",
                      }}
                      onClick={handleLinkClick}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#FFD700"; // 懸停時改變背景色
                        e.target.style.color = "#2C1A65"; // 懸停時改變文字顏色
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent"; // 離開時恢復背景色
                        e.target.style.color = "#FFF"; // 恢復文字顏色
                      }}
                    >
                      新增課程
                    </Link>
                  )}
                {currentUser &&
                  currentUser.user.role === "Student" && ( // 只有 Student 顯示新增課程
                    <Link
                      className="dropdown-item"
                      to="/enroll"
                      style={{
                        color: "#FFF",
                        fontWeight: "600",
                        padding: "10px 15px",
                        fontSize: "14px",
                        transition:
                          "background-color 0.2s ease, color 0.2s ease",
                      }}
                      onClick={handleLinkClick}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#FFD700"; // 懸停時改變背景色
                        e.target.style.color = "#2C1A65"; // 懸停時改變文字顏色
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent"; // 離開時恢復背景色
                        e.target.style.color = "#FFF"; // 恢復文字顏色
                      }}
                    >
                      註冊課程
                    </Link>
                  )}
                <hr style={{ margin: "5px 0", borderColor: "#FFD700" }} />
                <Link
                  className="dropdown-item"
                  onClick={HandleLogOut}
                  to="/"
                  style={{
                    color: "#FFF",
                    fontWeight: "600",
                    padding: "10px 15px",
                    fontSize: "14px",
                    transition: "background-color 0.2s ease, color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#FFD700"; // 懸停時改變背景色
                    e.target.style.color = "#2C1A65"; // 懸停時改變文字顏色
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent"; // 離開時恢復背景色
                    e.target.style.color = "#FFF"; // 恢復文字顏色
                  }}
                >
                  登出
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavComponent;
