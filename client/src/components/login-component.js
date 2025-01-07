import React, { useState } from "react";
import AuthService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap"; // 引入Toast和ToastContainer
import "../styles/style.css";

const LoginComponent = ({ currentUser, setCurrentUser }) => {
  const Navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [emailError, setEmailError] = useState(""); // 狀態：電子信箱錯誤訊息
  let [passwordError, setPasswordError] = useState(""); // 狀態：密碼錯誤訊息
  let [showToast, setShowToast] = useState(false); // 控制Toast顯示

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const HandleLogin = async function () {
    setEmailError(""); // 清除先前的錯誤訊息
    setPasswordError(""); // 清除先前的錯誤訊息
    try {
      let response = await AuthService.login(email, password);
      localStorage.setItem("user", JSON.stringify(response.data));
      setShowToast(true);
    } catch (e) {
      if (e.response.data.error.includes("信箱")) {
        setEmailError(e.response.data.error); // 設定電子信箱錯誤訊息
      }
      if (e.response.data.error.includes("密碼")) {
        setPasswordError(e.response.data.error); // 設定密碼錯誤訊息
      }
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      HandleLogin(); // 當按下 Enter 時執行 HandleLogin
      e.preventDefault(); // 阻止預設表單提交
    }
  };

  const handleCloseToast = () => {
    setShowToast(false); // 關閉Toast
    setCurrentUser(AuthService.getCurrentUser());
    Navigate("/profile"); // 跳轉到登入頁面
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f7f9fc",
        padding: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          maxWidth: "800px",
          width: "100%",
          overflow: "hidden",
          border: "1px solid #e0e0e0",
          gap: "1rem",
          padding: "1rem",
        }}
      >
        {/* 左側插圖區域 */}
        <div
          style={{
            flex: 1,
            background: "linear-gradient(135deg, #d9a7c7, #fffcdc)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#333",
            padding: "2rem",
            borderRadius: "16px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              歡迎回來！
            </h2>
            <p style={{ fontSize: "1rem", lineHeight: "1.5" }}>
              請登入以繼續使用我們的尊爵學習系統。
              <br />
              如果您還沒有帳號，請先註冊會員。
            </p>
            <img
              src="/images/login-animation.gif"
              alt="登入插圖"
              style={{
                maxWidth: "100%",
                marginTop: "1rem",
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              }}
            />
          </div>
        </div>

        {/* 右側表單區域 */}
        <div
          style={{
            flex: 1,
            padding: "2rem 3rem",
            borderRadius: "16px",
            border: "1px solid #ddd",
          }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: "600",
              color: "#333",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            登入系統
          </h2>
          <div style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="email" style={labelStyle}>
              電子信箱：
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="form-control"
                name="email"
                value={email}
                onChange={handleEmailChange}
                onKeyDown={handleKeyDown} // 新增事件監聽
                style={inputStyle}
              />
              {emailError && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "-20px",
                    right: "0",
                    fontSize: "0.9rem",
                    color: "red",
                    maxWidth: "100%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {emailError}
                </span>
              )}
            </div>
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="password" style={labelStyle}>
              密碼：
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                className="form-control"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                onKeyDown={handleKeyDown} // 新增事件監聽
                style={inputStyle}
              />
              {passwordError && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "-20px",
                    right: "0",
                    fontSize: "0.9rem",
                    color: "red",
                    maxWidth: "100%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {passwordError}
                </span>
              )}
            </div>
          </div>
          <button
            className="btn btn-primary"
            style={{
              width: "100%",
              padding: "0.75rem",
              fontSize: "1rem",
              fontWeight: "600",
              backgroundColor: "#d9a7c7",
              border: "none",
              borderRadius: "30px",
              color: "#fff",
              boxShadow: "0 4px 10px rgba(217, 167, 199, 0.5)",
              cursor: "pointer",
              transition: "all 0.3s ease-in-out",
            }}
            onClick={HandleLogin}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#bf84aa";
              e.target.style.boxShadow = "0 6px 15px rgba(217, 167, 199, 0.7)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#d9a7c7";
              e.target.style.boxShadow = "0 4px 10px rgba(217, 167, 199, 0.5)";
            }}
          >
            登入系統
          </button>
          {/* Toast Container for center positioning */}
          <ToastContainer
            className="position-fixed p-3"
            style={{
              top: "50%", // 垂直居中
              left: "50%", // 水平居中
              transform: "translate(-50%, -50%)", // 精確居中
              zIndex: 1050, // 確保顯示在其他元素上方
            }}
          >
            <Toast
              show={showToast}
              onClose={handleCloseToast}
              className="toast-custom" // 在這裡添加自定義動畫
              style={{
                backgroundColor: "#6c757d", // 鮮明的橙色背景
                color: "#f8f9fa", // 白色文字
                borderRadius: "10px", // 圓角邊框
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // 添加陰影
                width: "100%", // 調整寬度
                maxWidth: "600px", // 最大寬度
                fontSize: "1rem", // 增加字體大小
                whiteSpace: "nowrap", // 允許文字換行
                padding: ".5rem", // 增加內邊距
              }}
            >
              <Toast.Header>
                <strong
                  className="me-auto"
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  登入成功
                </strong>
              </Toast.Header>
              <Toast.Body
                style={{
                  fontSize: ".9rem",
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                將您導向至個人資料介面
              </Toast.Body>
            </Toast>
          </ToastContainer>
          <div />
          <p
            style={{
              marginTop: "1.5rem",
              textAlign: "center",
              color: "#555",
              fontSize: "0.9rem",
            }}
          >
            還沒有帳號？{" "}
            <a href="/register" style={linkStyle}>
              註冊會員
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const labelStyle = {
  fontSize: "1rem",
  color: "#555",
  marginBottom: "0.5rem",
  display: "block",
  fontWeight: "500",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "1rem",
  outline: "none",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
};

const linkStyle = {
  color: "#bf84aa",
  textDecoration: "none",
  fontWeight: "500",
  transition: "color 0.2s ease",
};

export default LoginComponent;
