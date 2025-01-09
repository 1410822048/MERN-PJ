import React, { useState, useEffect, useCallback, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";
import { Toast, ToastContainer } from "react-bootstrap";
import "../styles/style.css";

// 樣式物件
const styles = {
  label: {
    display: "block",
    fontSize: "1.1rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#4A4A4A",
  },
  input: {
    width: "100%",
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #E3D9C6",
    outline: "none",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Noto Sans JP', sans-serif",
  },
  textarea: {
    width: "100%",
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #E3D9C6",
    outline: "none",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Noto Sans JP', sans-serif",
    resize: "none",
    lineHeight: "1.6",
  },
  button: {
    backgroundColor: "#F6C89F",
    color: "#FFF",
    fontWeight: "bold",
    border: "none",
    borderRadius: "25px",
    padding: "0.7rem 2rem",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

// 初始狀態
const initialState = {
  editMode: false,
  editCourse: {
    _id: "",
    title: "",
    description: "",
    price: "",
  },
  showToast: false,
  messageType: "",
};

// Reducer 函數
function reducer(state, action) {
  switch (action.type) {
    case "SET_EDIT_MODE":
      return { ...state, editMode: action.payload };
    case "SET_EDIT_COURSE":
      return { ...state, editCourse: action.payload };
    case "SHOW_TOAST":
      return { ...state, showToast: true, messageType: action.payload };
    case "HIDE_TOAST":
      return { ...state, showToast: false };
    default:
      return state;
  }
}

// Toast 元件
const CustomToast = ({ show, onClose, messageType }) => {
  const getToastStyle = () => {
    switch (messageType) {
      case "error":
        return { backgroundColor: "#dc3545", color: "#f8f9fa" };
      case "info":
        return { backgroundColor: "#17a2b8", color: "#f8f9fa" };
      case "del suc":
        return { backgroundColor: "#28a745", color: "#f8f9fa" };
      case "success":
      default:
        return { backgroundColor: "#28a745", color: "#f8f9fa" };
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

  return (
    <Toast
      show={show}
      onClose={onClose}
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
  );
};

// 課程卡片元件
const CourseCard = ({
  course,
  currentUser,
  onDelete,
  onEdit,
  onQuit,
  onDetail,
}) => {
  return (
    <div className="card">
      <div className="card-body">
        {/* 刪除按鈕 */}
        {currentUser && currentUser.user.role === "Instructor" && (
          <button
            className="btn delete-btn"
            onClick={onDelete}
            data-id={course._id}
          >
            × {/* 使用 × 符號 */}
          </button>
        )}

        {/* 課程內容 */}
        <h5 className="card-title">{course.title}</h5>
        <p className="card-text">{course.description}</p>
        <div className="card-info">
          <p>學生人數: {course.students.length}</p>
          <p>課程價格: ${course.price}</p>
        </div>
        {/* 編輯按鈕 */}
        {currentUser && currentUser.user.role === "Instructor" && (
          <button className="btn edit-btn" onClick={() => onEdit(course._id)}>
            編輯課程
          </button>
        )}
        {/* 編輯按鈕 */}
        <button className="btn detail-btn" onClick={() => onDetail(course)}>
          課程詳情
        </button>

        {/* 退出按鈕 */}
        {currentUser && currentUser.user.role === "Student" && (
          <button
            className="btn delete-btn"
            onClick={onQuit}
            data-id={course._id}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// 主元件
const CourseComponent = ({ currentUser, setCurrentUser }) => {
  const Navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [courseData, setCourseData] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { editMode, editCourse, showToast, messageType } = state;

  //取得課程
  const fetchCourses = useCallback(() => {
    if (currentUser) {
      const _id = currentUser.user._id;
      const coursePromise =
        currentUser.user.role === "Instructor"
          ? CourseService.get(_id) //如果是講師的話
          : CourseService.getEnrollCourse(_id); //如果是其他身份

      coursePromise
        .then((res) => {
          setCourseData(res.data);
        })
        .catch((error) => {
          console.error("獲取課程失敗:", error);
        });
    }
  }, [currentUser]);

  //如果沒有登入 就導向登入畫面
  const HandleTakeToLogin = () => {
    Navigate("/login");
  };

  //講師刪除課程
  const HandleToDel = async (e) => {
    const _id = e.target.dataset.id;
    try {
      await CourseService.del(_id);
      dispatch({ type: "SHOW_TOAST", payload: "del suc" });
      setCourseData((prevCourses) =>
        prevCourses.filter((course) => course._id !== _id)
      );
    } catch (e) {
      console.error("删除失败:", e);
      dispatch({ type: "SHOW_TOAST", payload: "error" });
    }
  };

  //學生退出課程
  const HandleToQuit = async (e) => {
    const _id = e.target.dataset.id;
    try {
      await CourseService.quit(_id);
      setCourseData((prevCourses) =>
        prevCourses.filter((course) => course._id !== _id)
      );
      fetchCourses();
      dispatch({ type: "SHOW_TOAST", payload: "success" });
    } catch (e) {
      console.error("退出失败:", e);
      dispatch({ type: "SHOW_TOAST", payload: "error" });
    }
  };

  //編輯課程觸發紐
  const HandleToEdit = (_id) => {
    const course = courseData.find((c) => c._id === _id);
    dispatch({ type: "SET_EDIT_COURSE", payload: course });
    dispatch({ type: "SET_EDIT_MODE", payload: true });
  };

  //導向課程詳情頁面
  const HandleToCourseDetail = (course) => {
    Navigate(`/course/${course._id}`, { state: { course } });
  };

  //編輯課程資訊
  const HandleSaveChanges = async () => {
    const { _id, instructor, students, __v, ...courseToUpdate } = editCourse;
    try {
      await CourseService.update(_id, courseToUpdate);
      setCourseData((prevCourses) =>
        prevCourses.map((course) =>
          course._id === _id ? { ...course, ...courseToUpdate } : course
        )
      );
      dispatch({ type: "SHOW_TOAST", payload: "success" });
      dispatch({ type: "SET_EDIT_MODE", payload: false });
    } catch (e) {
      setMsg(e.response?.data?.message || "更新課程時發生錯誤");
      dispatch({ type: "SHOW_TOAST", payload: "error" });
    }
  };

  //取消編輯
  const HandleCancelEdit = () => {
    dispatch({ type: "SET_EDIT_MODE", payload: false });
  };

  //觸發成功或失敗的彈出視窗
  const handleCloseToast = () => {
    dispatch({ type: "HIDE_TOAST" });
  };

  //依據課程有沒有變化 渲染畫面
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

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
                <CourseCard
                  key={course._id}
                  course={course}
                  currentUser={currentUser}
                  onDelete={HandleToDel}
                  onEdit={HandleToEdit}
                  onQuit={HandleToQuit}
                  onDetail={HandleToCourseDetail}
                />
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
              <label style={styles.label}>課程標題：</label>
              <input
                type="text"
                value={editCourse.title}
                onChange={(e) =>
                  dispatch({
                    type: "SET_EDIT_COURSE",
                    payload: { ...editCourse, title: e.target.value },
                  })
                }
                style={styles.input}
                required
              />
            </div>
            <div style={{ textAlign: "left" }}>
              <label style={styles.label}>內容：</label>
              <textarea
                value={editCourse.description}
                onChange={(e) =>
                  dispatch({
                    type: "SET_EDIT_COURSE",
                    payload: { ...editCourse, description: e.target.value },
                  })
                }
                rows="4"
                style={styles.textarea}
                required
              />
            </div>
            <div style={{ textAlign: "left" }}>
              <label style={styles.label}>價格：</label>
              <input
                type="number"
                value={editCourse.price}
                onChange={(e) =>
                  dispatch({
                    type: "SET_EDIT_COURSE",
                    payload: { ...editCourse, price: e.target.value },
                  })
                }
                style={styles.input}
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
              <button className="save-btn" type="submit" style={styles.button}>
                保存更改
              </button>
              <button
                className="cancel-btn"
                type="button"
                onClick={HandleCancelEdit}
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}
      <ToastContainer
        className="position-fixed p-3"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1050,
        }}
      >
        <CustomToast
          show={showToast}
          onClose={handleCloseToast}
          messageType={messageType}
        />
      </ToastContainer>
    </div>
  );
};

export default CourseComponent;
