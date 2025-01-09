import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/home-component";
import Register from "./components/register-component";
import Login from "./components/login-component";
import Profile from "./components/profile-component";
import { useState } from "react";
import AuthService from "./services/auth.service";
import Course from "./components/course-component";
import Enroll from "./components/enroll-component";
import PostCourse from "./components/postCourse-component";
import CourseDetail from "./components/course-detail";

const course = {
  syllabus: [
    { title: "第一章：課程介紹", description: "課程目標與學習資源" },
    { title: "第二章：基礎知識", description: "基本概念與實例分析" },
  ],
  reviews: [
    {
      student: "學生A",
      comment: "這門課程讓我有了全新的認識，非常實用！",
    },
    { student: "學生B", comment: "講師的教學方式很有趣，內容也很容易理解。" },
  ],
  faq: [
    {
      question: "這門課程適合初學者嗎？",
      answer: "是的，課程內容從基礎到進階，適合所有程度的學生。",
    },
  ],
  duration: "8 週",
  weeklyHours: "5-7 小時",
  schedule: [
    { week: "第 1-2 週", topic: "基礎知識" },
    { week: "第 3-4 週", topic: "進階章節" },
  ],
  contact: {
    email: "course@example.com",
    phone: "02-1234-5678",
    line: "@course123",
  },
  social: {
    facebook: "https://facebook.com",
    discord: "https://discord.com",
    line: "#",
  },
};

function App() {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        >
          <Route index element={<Home />} />
          <Route path="register">
            <Route index element={<Register />} />
          </Route>
          <Route path="login">
            <Route
              index
              element={
                <Login
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
          </Route>
          <Route path="profile">
            <Route
              index
              element={
                <Profile
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
          </Route>
          <Route path="course">
            <Route
              index
              element={
                <Course
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
            {/* 修正後的 CourseDetail 路由 */}
            <Route
              path=":id"
              element={
                <CourseDetail detail={course} currentUser={currentUser} />
              }
            />
          </Route>
          <Route path="enroll">
            <Route
              index
              element={
                <Enroll
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
          </Route>
          <Route path="postcourse">
            <Route
              index
              element={
                <PostCourse
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
