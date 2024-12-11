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
          <Route
            index
            element={
              <Home currentUser={currentUser} setCurrentUser={setCurrentUser} />
            }
          />
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
