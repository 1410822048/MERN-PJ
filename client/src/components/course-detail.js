import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";
import "../styles/style.css";
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

  // 註冊課程
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
    <div className="course-detail-container">
      {/* 主內容區 */}
      <div className="main-content">
        {/* 課程標題與描述 */}
        <div className="course-header">
          <h1>{course.title}</h1>
          <p>{course.description}</p>
        </div>

        {/* 課程大綱 */}
        <div className="course-section">
          <h2>
            <FaListAlt /> 課程大綱
          </h2>
          <ul>
            {detail.syllabus?.map((section, index) => (
              <li key={index}>
                <h3>{section.title}</h3>
                <p>{section.description}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* 講師介紹 */}
        <div className="course-section">
          <h2>
            <FaChalkboardTeacher /> 講師介紹
          </h2>
          <p>
            <strong>姓名:</strong> {course.instructor?.username}
          </p>
          <p>
            <strong>資歷:</strong> 擁有 10 年以上的教學經驗。
          </p>
          <p>
            <strong>教學風格:</strong> 以實戰為主，注重學生的實際操作能力。
          </p>
        </div>

        {/* 學生評價 */}
        <div className="course-section">
          <h2>
            <FaComments /> 學生評價
          </h2>
          <ul>
            {detail.reviews?.map((review, index) => (
              <li key={index}>
                <p>
                  <strong>{review.student}:</strong> {review.comment}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* 常見問題 */}
        <div className="course-section">
          <h2>
            <FaQuestionCircle /> 常見問題
          </h2>
          <ul>
            {detail.faq?.map((faq, index) => (
              <li key={index}>
                <p>
                  <strong>Q: {faq.question}</strong>
                </p>
                <p>A: {faq.answer}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* 學習資源 */}
        <div className="course-section">
          <h2>
            <FaBook /> 學習資源
          </h2>
          <ul>
            <li>教材: 提供完整的課程講義與參考資料。</li>
            <li>影片: 超過 20 小時的高清教學影片。</li>
            <li>工具: 提供專屬的學習平台與實戰工具。</li>
          </ul>
        </div>

        {/* 課程時長與進度 */}
        <div className="course-section">
          <h2>
            <FaClock /> 課程時長與進度
          </h2>
          <p>
            <strong>總時長: {detail.duration} </strong>
          </p>
          <p>
            <strong>每週學習時間:</strong> {detail.weeklyHours}
          </p>
          <h3 style={{padding:"1.5rem 0rem"}}>進度安排</h3>
          <ul>
            {detail.schedule?.map((schedule, index) => (
              <li key={index}>
                <strong>{schedule.week}:</strong> {schedule.topic}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 側邊欄 */}
      <div className="sidebar">
        {/* 課程資訊 */}
        <div className="course-info">
          <h3>課程資訊</h3>
          <p>價格: ${course.price}</p>
          <p>講師: {course.instructor?.username}</p>
          <p>學生人數: {course.students?.length}</p>
          {currentUser &&
            currentUser.user.role === "Student" &&
            !isEnrolled && (
              <button onClick={handleEnroll} id={course._id}>
                加入課程
              </button>
            )}
        </div>

        {/* 聯絡方式 */}
        <div className="contact-info">
          <h3>
            <FaEnvelope /> 聯絡方式
          </h3>
          <p>
            <strong>Email:</strong> {detail.contact?.email}
          </p>
          <p>
            <strong>電話:</strong> {detail.contact?.phone}
          </p>
          <p>
            <strong>LINE 官方帳號:</strong> {detail.contact?.line}
          </p>
        </div>

        {/* 社群連結 */}
        <div className="social-links">
          <h3>
            <FaFacebook /> 社群連結
          </h3>
          <ul>
            <li>
              <a
                href={detail.social?.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook /> Facebook 社團
              </a>
            </li>
            <li>
              <a
                href={detail.social?.discord}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaDiscord /> Discord 群組
              </a>
            </li>
            <li>
              <a
                href={detail.social?.line}
                target="_blank"
                rel="noopener noreferrer"
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