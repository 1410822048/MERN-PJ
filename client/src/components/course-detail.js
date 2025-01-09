import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";
import {
  FaChalkboardTeacher,
  FaListAlt,
  FaComments,
  FaQuestionCircle,
  FaBook,
  FaClock,
  FaEnvelope,
  FaLine,
  FaFacebook,
  FaDiscord,
} from "react-icons/fa";

const CourseDetail = ({ detail, currentUser }) => {
  const location = useLocation();
  const Navigate = useNavigate();

  const { course } = location.state || {};

  // 檢查當前學生是否已經註冊了該課程
  const isEnrolled = course?.students?.includes(currentUser?.user?._id);

  //註冊課程
  const handleEnroll = (e) => {
    CourseService.enroll(e.target.id)
      .then(() => {
        Navigate("/course");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (!course) {
    return <div>課程資訊不存在</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        padding: "2rem",
        backgroundColor: "#F8F9FA",
      }}
    >
      {/* 主內容區 */}
      <div style={{ flex: 3 }}>
        {/* 課程標題與描述 */}
        <div
          style={{
            background: "linear-gradient(135deg, #FFFFFF, #F8F9FA)",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h1
            style={{
              color: "#D89E67",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {course.title}
          </h1>
          <p
            style={{ fontSize: "1.2rem", color: "#4A4A4A", lineHeight: "1.6" }}
          >
            {course.description}
          </p>
        </div>

        {/* 課程大綱 */}
        <div
          style={{
            marginTop: "2rem",
            background: "linear-gradient(135deg, #FFFFFF, #F8F9FA)",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              color: "#D89E67",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FaListAlt /> 課程大綱
          </h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {detail.syllabus?.map((section, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "1.5rem",
                  paddingBottom: "1.5rem",
                  borderBottom: "1px solid #EEE",
                }}
              >
                <h3 style={{ color: "#4A4A4A", marginBottom: "0.5rem" }}>
                  {section.title}
                </h3>
                <p style={{ color: "#666", lineHeight: "1.6" }}>
                  {section.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* 講師介紹 */}
        <div
          style={{
            marginTop: "2rem",
            background: "linear-gradient(135deg, #FFFFFF, #F8F9FA)",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              color: "#D89E67",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FaChalkboardTeacher /> 講師介紹
          </h2>
          <p style={{ color: "#4A4A4A", marginBottom: "1rem" }}>
            <strong>姓名:</strong> {course.instructor?.username}
          </p>
          <p style={{ color: "#4A4A4A", marginBottom: "1rem" }}>
            <strong>資歷:</strong> 擁有 10 年以上的教學經驗。
          </p>
          <p style={{ color: "#4A4A4A" }}>
            <strong>教學風格:</strong> 以實戰為主，注重學生的實際操作能力。
          </p>
        </div>

        {/* 學生評價 */}
        <div
          style={{
            marginTop: "2rem",
            background: "linear-gradient(135deg, #FFFFFF, #F8F9FA)",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              color: "#D89E67",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FaComments /> 學生評價
          </h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {detail.reviews?.map((review, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "1.5rem",
                  paddingBottom: "1.5rem",
                  borderBottom: "1px solid #EEE",
                }}
              >
                <p style={{ color: "#4A4A4A" }}>
                  <strong>{review.student}:</strong> {review.comment}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* 常見問題 */}
        <div
          style={{
            marginTop: "2rem",
            background: "linear-gradient(135deg, #FFFFFF, #F8F9FA)",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              color: "#D89E67",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FaQuestionCircle /> 常見問題
          </h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {detail.faq?.map((faq, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "1.5rem",
                  paddingBottom: "1.5rem",
                  borderBottom: "1px solid #EEE",
                }}
              >
                <p style={{ color: "#4A4A4A" }}>
                  <strong>Q: {faq.question}</strong>
                </p>
                <p style={{ color: "#666" }}>A: {faq.answer}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* 學習資源 */}
        <div
          style={{
            marginTop: "2rem",
            background: "linear-gradient(135deg, #FFFFFF, #F8F9FA)",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              color: "#D89E67",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FaBook /> 學習資源
          </h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "1rem", color: "#4A4A4A" }}>
              教材: 提供完整的課程講義與參考資料。
            </li>
            <li style={{ marginBottom: "1rem", color: "#4A4A4A" }}>
              影片: 超過 20 小時的高清教學影片。
            </li>
            <li style={{ marginBottom: "1rem", color: "#4A4A4A" }}>
              工具: 提供專屬的學習平台與實戰工具。
            </li>
          </ul>
        </div>

        {/* 課程時長與進度 */}
        <div
          style={{
            marginTop: "2rem",
            background: "linear-gradient(135deg, #FFFFFF, #F8F9FA)",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              color: "#D89E67",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FaClock /> 課程時長與進度
          </h2>
          <p style={{ color: "#4A4A4A", marginBottom: "1rem" }}>
            <strong>總時長: {detail.duration} </strong>
          </p>
          <p style={{ color: "#4A4A4A", marginBottom: "1.5rem" }}>
            <strong>每週學習時間:</strong> {detail.weeklyHours}
          </p>
          <h3 style={{ color: "#D89E67", marginBottom: "1rem" }}>進度安排</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {detail.schedule?.map((schedule, index) => (
              <li
                key={index}
                style={{ marginBottom: "1rem", color: "#4A4A4A" }}
              >
                <strong>{schedule.week}:</strong> {schedule.topic}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 側邊欄 */}
      <div style={{ flex: 1 }}>
        {/* 課程資訊 */}
        <div
          style={{
            background: "linear-gradient(135deg, #FFFFFF, #F8F9FA)",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ color: "#D89E67", marginBottom: "1.5rem" }}>課程資訊</h3>
          <p style={{ color: "#4A4A4A", marginBottom: "1rem" }}>
            價格: ${course.price}
          </p>
          <p style={{ color: "#4A4A4A", marginBottom: "1rem" }}>
            講師: {course.instructor?.username}
          </p>
          <p style={{ color: "#4A4A4A", marginBottom: "1.5rem" }}>
            學生人數: {course.students?.length}
          </p>
          {currentUser &&
            currentUser.user.role === "Student" &&
            !isEnrolled && (
              <button
                style={{
                  background: "linear-gradient(135deg, #F6C89F, #D89E67)",
                  color: "#FFF",
                  padding: "0.75rem 1.5rem",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  width: "100%",
                  fontSize: "1rem",
                  fontWeight: "600",
                  transition: "background 0.3s ease",
                }}
                onClick={handleEnroll}
                id={course._id}
                onMouseOver={(e) =>
                  (e.target.style.background =
                    "linear-gradient(135deg, #D89E67, #F6C89F)")
                }
                onMouseOut={(e) =>
                  (e.target.style.background =
                    "linear-gradient(135deg, #F6C89F, #D89E67)")
                }
              >
                加入課程
              </button>
            )}
        </div>

        {/* 聯絡方式 */}
        <div
          style={{
            marginTop: "2rem",
            background: "linear-gradient(135deg, #FFFFFF, #F8F9FA)",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              color: "#D89E67",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FaEnvelope /> 聯絡方式
          </h3>
          <p style={{ color: "#4A4A4A", marginBottom: "1rem" }}>
            <strong>Email:</strong> {detail.contact?.email}
          </p>
          <p style={{ color: "#4A4A4A", marginBottom: "1rem" }}>
            <strong>電話:</strong> {detail.contact?.phone}
          </p>
          <p style={{ color: "#4A4A4A" }}>
            <strong>LINE 官方帳號:</strong> {detail.contact?.line}
          </p>
        </div>

        {/* 社群連結 */}
        <div
          style={{
            marginTop: "2rem",
            background: "linear-gradient(135deg, #FFFFFF, #F8F9FA)",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              color: "#D89E67",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FaFacebook /> 社群連結
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "1rem" }}>
              <a
                href={detail.social?.facebook}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#4A4A4A",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaFacebook /> Facebook 社團
              </a>
            </li>
            <li style={{ marginBottom: "1rem" }}>
              <a
                href={detail.social?.discord}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#4A4A4A",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaDiscord /> Discord 群組
              </a>
            </li>
            <li style={{ marginBottom: "1rem" }}>
              <a
                href={detail.social?.line}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#4A4A4A",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaLine /> LINE 群組
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
