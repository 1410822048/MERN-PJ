import React, { useState } from "react";
import AuthService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap"; // 引入Toast和ToastContainer
import "../styles/style.css";

const RegisterComponent = () => {
  const Navigate = useNavigate();
  const location = useLocation(); //傳遞用
  const { Inrole } = location.state || {}; // 參數命名為前面要傳入目標的State 確保角色傳遞正確

  let [username, setUserName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [role, setRole] = useState(Inrole || ""); //傳遞Home 設定的值 需搭配 useLocation 做使用
  let [msg, setMsg] = useState("");
  let [showToast, setShowToast] = useState(false); // 控制Toast顯示

  const HandleUsername = (e) => {
    setUserName(e.target.value);
  };

  const HandleEmail = (e) => {
    setEmail(e.target.value);
  };

  const HandlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleRole = (e) => {
    setRole(e.target.value);
  };

  const HandleRegister = async function () {
    try {
      await AuthService.register(username, email, password, role);
      setShowToast(true); // 註冊成功後顯示Toast
    } catch (e) {
      setMsg(e.response.data.error);
    }
  };

  const handleCloseToast = () => {
    setShowToast(false); // 關閉Toast
    Navigate("/login"); // 跳轉到登入頁面
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f7f9fc",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "3rem",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          width: "100%",
          border: "1px solid #e0e0e0",
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
          註冊會員
        </h2>
        <div style={{ marginBottom: "1rem" }}>
          <div>{msg && <div className="alert alert-danger">{msg}</div>}</div>
          <label htmlFor="username" style={labelStyle}>
            用戶名稱:
          </label>
          <input
            onChange={HandleUsername}
            type="text"
            className="form-control"
            name="username"
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email" style={labelStyle}>
            電子信箱：
          </label>
          <input
            onChange={HandleEmail}
            type="text"
            className="form-control"
            name="email"
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="password" style={labelStyle}>
            密碼：
          </label>
          <input
            onChange={HandlePassword}
            type="password"
            className="form-control"
            name="password"
            placeholder="長度最少6個字元並至少含一個英文及數字"
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="role" style={labelStyle}>
            身份：
          </label>
          <select
            className="form-control"
            name="role"
            value={role}
            onChange={handleRole}
            style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
          >
            <option value="" disabled>
              請選擇身份
            </option>
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
          </select>
        </div>
        <button
          onClick={HandleRegister}
          className="btn btn-primary"
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "1rem",
            fontWeight: "600",
            backgroundColor: "#007bff",
            border: "none",
            borderRadius: "30px",
            color: "#fff",
            boxShadow: "0 4px 10px rgba(0, 123, 255, 0.2)",
            cursor: "pointer",
            transition: "all 0.3s ease-in-out",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#0056b3";
            e.target.style.boxShadow = "0 6px 15px rgba(0, 123, 255, 0.3)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#007bff";
            e.target.style.boxShadow = "0 4px 10px rgba(0, 123, 255, 0.2)";
          }}
        >
          註冊會員
        </button>
      </div>
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
              註冊成功
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
            將您導向至登入介面
          </Toast.Body>
        </Toast>
      </ToastContainer>
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

export default RegisterComponent;
