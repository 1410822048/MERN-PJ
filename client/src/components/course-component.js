import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";
import { Toast, ToastContainer } from "react-bootstrap";
import "../styles/style.css";

const CourseComponent = ({ currentUser, setCurrentUser }) => {
  const Navigate = useNavigate();
  let [msg, setMsg] = useState("");
  const [courseData, setCourseData] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [editMode, setEditMode] = useState(false); // 是否進入編輯模式
  const [editCourse, setEditCourse] = useState({
    _id: "",
    title: "",
    description: "",
    price: "",
  }); //要更改的東西 _id只是當個媒介導入而已
  const [messageType, setMessageType] = useState(""); // success, error, info

  const labelStyle = {
    display: "block",
    fontSize: "1.1rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#4A4A4A",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #E3D9C6",
    outline: "none",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Noto Sans JP', sans-serif",
  };

  const textareaStyle = {
    ...inputStyle,
    resize: "none",
    lineHeight: "1.6",
  };

  const buttonStyle = {
    backgroundColor: "#F6C89F",
    color: "#FFF",
    fontWeight: "bold",
    border: "none",
    borderRadius: "25px",
    padding: "0.7rem 2rem",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const fetchCourses = () => {
    if (currentUser) {
      const _id = currentUser.user._id;
      const coursePromise =
        currentUser.user.role === "Instructor"
          ? CourseService.get(_id) // 講師的課程
          : CourseService.getEnrollCourse(_id); // 學生的註冊課程

      coursePromise
        .then((res) => {
          setCourseData(res.data); // 設定課程資料
        })
        .catch((error) => {
          console.error("獲取課程失敗:", error);
        });
    }
  };

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

  const HandleTakeToLogin = () => {
    Navigate("/login");
  };

  const HandleToDel = (e) => {
    let _id = e.target.dataset.id;
    CourseService.del(_id)
      .then((res) => {
        // console.log("课程删除成功:", res);
        setMessageType("del suc");
        setShowToast(true);
        setCourseData((prevCourses) =>
          prevCourses.filter((course) => course._id !== _id)
        );
      })
      .catch((e) => {
        console.error("删除失败:", e);
        setMessageType("error");
        setShowToast(true);
      });
  };

  const HandleToQuit = (e) => {
    let _id = e.target.dataset.id;
    CourseService.quit(_id)
      .then((res) => {
        // console.log("退出成功:", res);
        setCourseData((prevCourses) =>
          prevCourses.filter((course) => course._id !== _id)
        );
        fetchCourses();
        setMessageType("success");
        setShowToast(true);
      })
      .catch((e) => {
        console.error("退出失败:", e);
        setMessageType("error");
        setShowToast(true);
      });
  };

  const HandleToEdit = (_id) => {
    const course = courseData.find((c) => c._id === _id); //找到目標課程的_id
    // console.log(course);

    setEditCourse(course); //將原本的資料存放進去裡面
    setEditMode(true);
  };

  const HandleSaveChanges = () => {
    const { _id, instructor, students, __v, ...courseToUpdate } = editCourse; //从 editCourse 对象中提取出 _id, instructor, students, 和 __v 字段，并将其移除。

    CourseService.update(_id, courseToUpdate)
      .then((res) => {
        // console.log("课程更新成功:", res);
        setCourseData((prevCourses) =>
          prevCourses.map(
            (course) =>
              course._id === _id ? { ...course, ...courseToUpdate } : course //如果找到了该课程，则用更新后的数据，如果沒有則保持原來的數據
          )
        );
        setMessageType("success");
        setEditMode(false); // 回到主頁面
      })
      .catch((e) => {
        setMsg(e.response.data);
      });
  };

  const HandleCancelEdit = () => {
    setEditMode(false);
  };
  const handleCloseToast = () => {
    setShowToast(false); // 關閉Toast
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div
      style={{
        padding: "3rem",
        backgroundColor: "#FAF3E0",
        minHeight: "100vh",
        color: "#4A4A4A",
        fontFamily: "'Noto Sans JP', sans-serif",
      }}
    >
      {!editMode && (
        <>
          {!currentUser && (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
                您必須先登入才能看到課程。
              </p>
              <button
                className="btn btn-primary btn-lg"
                style={{
                  backgroundColor: "#F6C89F",
                  borderColor: "#F6C89F",
                  color: "#FFF",
                  fontWeight: "bold",
                  borderRadius: "25px",
                  padding: "0.5rem 1.5rem",
                }}
                onClick={HandleTakeToLogin}
              >
                回到登入頁面
              </button>
            </div>
          )}
          {currentUser && currentUser.user.role === "Instructor" && (
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h1 style={{ color: "#D89E67" }}>歡迎來到講師的課程頁面。</h1>
              <p style={{ fontSize: "1.2rem" }}>在此管理或查看您的課程。</p>
            </div>
          )}
          {currentUser && currentUser.user.role === "Student" && (
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h1 style={{ color: "#D89E67" }}>歡迎來到學生的課程頁面。</h1>
              <p style={{ fontSize: "1.2rem" }}>在此管理或查看您的課程。</p>
            </div>
          )}
          {currentUser && courseData && courseData.length !== 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "1.5rem",
              }}
            >
              {courseData.map((course) => (
                <div
                  className="card"
                  style={{
                    width: "20rem",
                    backgroundColor: "#FFF",
                    border: "1px solid #E3D9C6",
                    borderRadius: "10px",
                    paddingBottom: "3rem",
                  }}
                  key={course._id}
                >
                  <div className="card-body" style={{ padding: "1.5rem" }}>
                    <h5
                      className="card-title"
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#D89E67",
                      }}
                    >
                      {course.title}
                    </h5>
                    <p className="card-text">{course.description}</p>
                    <p>學生人數: {course.students.length}</p>
                    <p>課程價格: ${course.price}</p>
                    {currentUser && currentUser.user.role === "Instructor" && (
                      <button
                        className="btn delete-btn"
                        onClick={HandleToDel}
                        data-id={course._id}
                      >
                        刪除課程
                      </button>
                    )}
                    {currentUser && currentUser.user.role === "Instructor" && (
                      <button
                        className="btn edit-btn"
                        onClick={() => HandleToEdit(course._id)}
                      >
                        編輯課程
                      </button>
                    )}
                    {currentUser && currentUser.user.role === "Student" && (
                      <button
                        className="btn delete-btn"
                        onClick={HandleToQuit}
                        data-id={course._id}
                      >
                        退出課程
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {editMode && (
        <div
          style={{
            textAlign: "center",
            backgroundColor: "#FFF",
            padding: "3rem",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            maxWidth: "600px",
            margin: "3rem auto",
            color: "#4A4A4A",
            fontFamily: "'Noto Sans JP', sans-serif",
          }}
        >
          <h1 style={{ color: "#D89E67", marginBottom: "2rem" }}>編輯課程</h1>
          <div>{msg && <div className="alert alert-danger">{msg}</div>}</div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              HandleSaveChanges();
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <label style={labelStyle}>課程標題：</label>
              <input
                type="text"
                value={editCourse.title}
                onChange={(e) =>
                  setEditCourse({ ...editCourse, title: e.target.value })
                }
                style={inputStyle}
                required
              />
            </div>
            <div style={{ textAlign: "left" }}>
              <label style={labelStyle}>內容：</label>
              <textarea
                value={editCourse.description}
                onChange={(e) =>
                  setEditCourse({ ...editCourse, description: e.target.value })
                }
                rows="4"
                style={textareaStyle}
                required
              />
            </div>
            <div style={{ textAlign: "left" }}>
              <label style={labelStyle}>價格：</label>
              <input
                type="number"
                value={editCourse.price}
                onChange={(e) =>
                  setEditCourse({ ...editCourse, price: e.target.value })
                }
                style={inputStyle}
                required
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "2rem",
              }}
            >
              <button className="save-btn" type="submit" style={buttonStyle}>
                保存更改
              </button>
              <button
                className="cancel-btn"
                type="button"
                style={{
                  ...buttonStyle,
                  backgroundColor: "#ccc",
                  color: "#333",
                }}
                onClick={HandleCancelEdit}
              >
                取消
              </button>
            </div>
          </form>
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
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default CourseComponent;
