import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash"; // 導入 debounce
import CourseService from "../services/course.service";
import { Toast, ToastContainer } from "react-bootstrap";
import "../styles/style.css";

const EnrollComponent = ({ currentUser, setCurrentUser }) => {
  const Navigate = useNavigate();
  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState(null);
  let [showToast, setShowToast] = useState(false); // 控制Toast顯示
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success, error, info

  const getToastStyle = () => {
    switch (messageType) {
      case "error":
        return {
          backgroundColor: "#dc3545", // 紅色背景
          color: "#f8f9fa", // 白色文字
        };
      case "info":
        return {
          backgroundColor: "#17a2b8", // 藍色背景
          color: "#f8f9fa", // 白色文字
        };
      case "del suc":
        return {
          backgroundColor: "#28a745", // 綠色背景
          color: "#f8f9fa", // 白色文字
        };
      case "success":
      default:
        return {
          backgroundColor: "#28a745", // 綠色背景
          color: "#f8f9fa", // 白色文字
        };
    }
  };

  const getToastHeader = () => {
    switch (messageType) {
      case "error":
        return "發生錯誤";
      case "info":
        return "資訊";
      case "del suc":
        return "刪除成功";
      case "success":
      default:
        return "操作成功";
    }
  };

  const handleTakeToLogin = () => {
    Navigate("/login");
  };

  const HandleToCourseDetail = (course) => {
    Navigate(`/course/${course._id}`, { state: { course } });
  };

  const debouncedSearch = debounce((value) => {
    if (value.trim() === "") {
      // 如果輸入欄位為空，清空搜索結果
      setSearchResult(null);
      return;
    }
    CourseService.getCourseByName(value)
      .then((data) => {
        setSearchResult(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, 300); // 設置 300ms 的延遲

  const handleChangeInput = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleEnroll = (e) => {
    CourseService.enroll(e.target.id)
      .then(() => {
        setMessageType("success");
        setMessage("註冊成功");
        setShowToast(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCloseToast = () => {
    if (messageType === "success") {
      setShowToast(false); // 關閉Toast
      Navigate("/course"); // 跳轉到課程頁面
    }
    setShowToast(false); // 關閉Toast
  };

  return (
    <div
      style={{
        padding: "3rem",
        backgroundColor: "#FAF3E0", // 柔和背景色
        minHeight: "100vh",
        fontFamily: "'Noto Sans JP', sans-serif", // 日系字體
        color: "#4A4A4A",
      }}
    >
      {!currentUser && (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
            您必須先登入才能搜尋課程。
          </p>
          <button
            className="btn btn-primary"
            onClick={handleTakeToLogin}
            style={{
              backgroundColor: "#F6C89F",
              borderColor: "#F6C89F",
              color: "#FFF",
              fontWeight: "bold",
              borderRadius: "25px", // 圓角按鈕
              padding: "0.5rem 1.5rem",
            }}
          >
            回到登入頁面
          </button>
        </div>
      )}

      {currentUser && currentUser.user.role === "Instructor" && (
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#D89E67" }}>僅學生可註冊課程。</h1>
        </div>
      )}

      {currentUser && currentUser.user.role === "Student" && (
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <div
            className="input-group"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <input
              onChange={handleChangeInput}
              value={searchInput}
              type="text"
              className="form-control"
              placeholder="搜尋課程"
              style={{
                width: "60%",
                padding: "0.75rem",
                borderRadius: "20px",
                border: "1px solid #E3D9C6",
              }}
            />
          </div>
        </div>
      )}

      {currentUser && searchResult && searchResult.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <p style={{ fontSize: "2rem", color: "#888" }}>
            查無此課程，請確保輸入正確
          </p>
        </div>
      )}

      {currentUser && searchResult && searchResult.length !== 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1.5rem",
          }}
        >
          {searchResult.map((course) => {
            const isEnrolled = course.students.includes(currentUser.user._id);

            return (
              <div key={course._id} className="card">
                <div className="card-body" style={{ padding: "1.5rem" }}>
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <div className="card-info">
                    <p style={{ marginBottom: "0.5rem", fontWeight: "600" }}>
                      價格: ${course.price}
                    </p>
                    <p style={{ marginBottom: "0.5rem", fontWeight: "600" }}>
                      學生人數: {course.students.length}
                    </p>
                    <p style={{ marginBottom: "1rem", fontWeight: "600" }}>
                      講師: {course.instructor.username}
                    </p>
                  </div>

                  {/* 只有未註冊的學生才顯示註冊按鈕 */}
                  {!isEnrolled && (
                    <>
                      <button
                        onClick={handleEnroll}
                        className="btn btn-primary"
                        id={course._id}
                      >
                        註冊課程
                      </button>
                      <button
                        onClick={() => HandleToCourseDetail(course)}
                        className="btn btn-detail"
                        id={course._id}
                      >
                        查看詳情
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

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
          className="toast-custom"
          style={{
            ...getToastStyle(),
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            width: "100%",
            maxWidth: "600px",
            fontSize: "1rem",
            whiteSpace: "nowrap",
            padding: ".5rem",
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
              {getToastHeader()}
            </strong>
          </Toast.Header>
          <Toast.Body>{message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default EnrollComponent;
