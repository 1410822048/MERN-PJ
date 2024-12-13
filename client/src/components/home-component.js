import React from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const HomeComponent = (currentUser, setCurrentUser) => {
  const navigate = useNavigate();

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  const handleInstructorRedirect = () => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      navigate("/register", { state: { Inrole: "Instructor" } });
    } else if (currentUser && user.user.role === "Instructor") {
      navigate("/postCourse");
    } else if (currentUser && user.user.role === "Student") {
      navigate("/register", { state: { Inrole: "Instructor" } });
    }
  };
  return (
    <main style={{ backgroundColor: "#f4f7fb", minHeight: "100vh" }}>
      <div
        className="container py-4"
        style={{ backgroundColor: "#ffffff", borderRadius: "15px" }}
      >
        {/* 使用渐变背景和透明阴影效果 */}
        <div
          className="p-5 mb-4 rounded-3"
          style={{
            background: "linear-gradient(135deg, #2C1A65, #FFD700)", // 深紫到金色渐变
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            borderRadius: "15px",
          }}
        >
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold text-white">尊貴學習系統</h1>
            <p className="col-md-8 fs-4 text-white">
              本系統使用 React.js 作為前端框架，Node.js、MongoDB
              作為後端服務器。這是 MERN 項目的結合，專為高端用戶設計。
            </p>
            <div className="d-flex flex-column align-items-center">
              <img
                src="/images/poster.png" // 确保路径正确
                alt="學習平台"
                className="img-fluid mb-4"
                style={{
                  maxWidth: "90%",
                  height: "auto",
                  borderRadius: "12px",
                  objectFit: "cover",
                  maskImage:
                    "linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))", // 上到下渐变剪影效果
                  WebkitMaskImage:
                    "linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))", // 为Webkit浏览器添加兼容
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)", // 增加阴影，提升视觉效果
                }}
              />

              <button
                className="btn btn-light btn-lg shadow-lg"
                type="button"
                style={{
                  borderRadius: "30px",
                  fontWeight: "bold",
                  padding: "10px 30px",
                  backgroundColor: "#FFD700", // 金色按钮
                  color: "#2C1A65", // 深紫色文字
                  border: "none",
                  transition: "transform 0.2s ease", // 平滑过渡
                }}
                onMouseEnter={(e) =>
                  (e.target.style.animation = "shake 0.5s ease infinite")
                } // 添加震动动画
                onMouseLeave={(e) => (e.target.style.animation = "")} // 移除动画
              >
                立即體驗
              </button>
            </div>
          </div>
        </div>

        {/* 用户和讲师部分，使用柔和的色调和精致的卡片效果 */}
        <div className="row align-items-md-stretch mt-4">
          <div className="col-md-6">
            <div
              className="h-100 p-5 text-white rounded-3 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #28a745, #218838)",
                borderRadius: "12px",
              }}
            >
              <h2 className="fw-bold">作為一個使用者</h2>
              <p>
                用戶可以輕鬆註冊，選擇感興趣的課程，並開始學習之旅。
                我們致力於提供高質量的內容和個性化的學習體驗。
              </p>
              <button
                className="btn btn-light"
                type="button"
                style={{
                  borderRadius: "30px",
                  fontWeight: "bold",
                }}
                onClick={handleRegisterRedirect}
              >
                登錄會員 / 註冊帳號
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <div
              className="h-100 p-5 text-white rounded-3 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #007bff, #0056b3)",
                borderRadius: "12px",
              }}
            >
              <h2 className="fw-bold">作為一個講師</h2>
              <p>
                講師可以輕鬆創建課程，並開始傳授知識給全球學員。
                我們為您提供了最先進的工具來管理課程和學員。
              </p>
              <button
                className="btn btn-light"
                type="button"
                style={{
                  borderRadius: "30px",
                  fontWeight: "bold",
                }}
                onClick={handleInstructorRedirect}
              >
                開始開設課程
              </button>
            </div>
          </div>
        </div>

        {/* 底部区域，使用深色调背景，增加现代感 */}
        <footer
          className="pt-3 mt-4 border-top"
          style={{
            background: "linear-gradient(135deg, #2f2f2f, #1a1a1a)",
            color: "#fff", // 设置字体颜色为白色
            borderTop: "2px solid #444",
            textAlign: "center",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          &copy; 2024 Jacky Zheng
        </footer>
      </div>
    </main>
  );
};

export default HomeComponent;

// CSS动画（在<style>标签内或者单独的CSS文件中）
const style = document.createElement("style");
style.innerHTML = `
  @keyframes shake {
    0% { transform: translate(0, 0); }
    25% { transform: translate(2px, 2px); }
    50% { transform: translate(-2px, -2px); }
    75% { transform: translate(2px, -2px); }
    100% { transform: translate(0, 0); }
  }
`;
document.head.appendChild(style);
