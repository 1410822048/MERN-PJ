import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";
import { Toast, ToastContainer } from "react-bootstrap"; // 引入Toast和ToastContainer
import "../styles/style.css";

const PostCourseComponent = ({ currentUser, setCurrentUser }) => {
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [price, setPrice] = useState(0);
  let [message, setMessage] = useState("");
  let [showToast, setShowToast] = useState(false); // 控制Toast顯示
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };
  const handleChangePrice = (e) => {
    setPrice(e.target.value);
  };

  const postCourse = () => {
    CourseService.post(title, description, price)
      .then(() => {
        setShowToast(true);
      })
      .catch((error) => {
        console.log(error.response);
        setMessage(error.response.data);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      postCourse(); // 當按下 Enter 時執行 HandleLogin
      e.preventDefault(); // 阻止預設表單提交
    }
  };

  const handleCloseToast = () => {
    setShowToast(false); // 關閉Toast
    navigate("/course");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      {!currentUser && (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "#555" }}>
            在發布新課程之前，您必須先登錄。
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
            style={{
              borderRadius: "25px",
              padding: "10px 20px",
              fontSize: "16px",
            }}
          >
            帶我進入登錄頁面。
          </button>
        </div>
      )}

      {currentUser && currentUser.user.role !== "Instructor" && (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "#555" }}>
            只有講師可以發布新課程。
          </p>
        </div>
      )}

      {currentUser && currentUser.user.role === "Instructor" && (
        <div className="form-group">
          <label htmlFor="exampleforTitle" style={{ fontSize: "18px" }}>
            課程標題：
          </label>
          <input
            name="title"
            type="text"
            className="form-control"
            id="exampleforTitle"
            onChange={handleChangeTitle}
            onKeyDown={handleKeyDown} // 新增事件監聽
            style={{
              borderRadius: "25px",
              padding: "10px",
              fontSize: "16px",
              marginBottom: "15px",
            }}
          />
          <br />

          <label htmlFor="exampleforContent" style={{ fontSize: "18px" }}>
            內容：
          </label>
          <textarea
            className="form-control"
            id="exampleforContent"
            name="content"
            onChange={handleChangeDescription}
            onKeyDown={handleKeyDown} // 新增事件監聽
            style={{
              borderRadius: "25px",
              padding: "10px",
              fontSize: "16px",
              marginBottom: "15px",
            }}
          />
          <br />

          <label htmlFor="exampleforPrice" style={{ fontSize: "18px" }}>
            價格：
          </label>
          <input
            name="price"
            type="number"
            className="form-control"
            id="exampleforPrice"
            onChange={handleChangePrice}
            onKeyDown={handleKeyDown} // 新增事件監聽
            style={{
              borderRadius: "25px",
              padding: "10px",
              fontSize: "16px",
              marginBottom: "15px",
            }}
          />
          <br />

          <button
            className="btn btn-primary"
            onClick={postCourse}
            style={{
              borderRadius: "25px",
              padding: "10px 20px",
              fontSize: "16px",
              marginTop: "15px",
            }}
          >
            發布課程
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
                  發布成功
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
                將您導向至課程介面
              </Toast.Body>
            </Toast>
          </ToastContainer>

          {message && (
            <div
              className="alert alert-warning"
              role="alert"
              style={{ marginTop: "20px" }}
            >
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCourseComponent;
