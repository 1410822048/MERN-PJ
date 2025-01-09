import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import PublicService from "../services/public.service";

const HomeComponent = () => {
  const navigate = useNavigate();
  const [topCourses, setTopCourses] = useState([]);

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  const handleInstructorRedirect = () => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      navigate("/register", { state: { Inrole: "Instructor" } });
    } else if (user.user.role === "Instructor") {
      navigate("/postCourse");
    } else if (user.user.role === "Student") {
      navigate("/register", { state: { Inrole: "Instructor" } });
    }
  };

  useEffect(() => {
    // 使用 PublicService 獲取熱門課程
    PublicService.getTopCourses()
      .then((response) => {
        setTopCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching top courses:", error);
      });
  }, []);

  return (
    <main
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        padding: "2rem 0",
      }}
    >
      <div className="container">
        {/* Hero Section */}
        <div
          className="p-5 mb-4 rounded-3"
          style={{
            background: "linear-gradient(135deg, #6a11cb, #2575fc)",
            color: "#fff",
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="container-fluid py-5 text-center">
            <h1 className="display-4 fw-bold">學逸 - EduEase</h1>
            <p className="lead col-md-8 mx-auto">
              本系統使用 React.js 作為前端框架，Node.js、MongoDB
              作為後端服務器。這是 MERN 項目的結合，專為高端用戶設計。
            </p>
            <div className="d-flex justify-content-center mt-4">
              <button
                className="btn btn-light btn-lg shadow-sm"
                type="button"
                style={{
                  borderRadius: "30px",
                  fontWeight: "bold",
                  padding: "10px 30px",
                  backgroundColor: "#fff",
                  color: "#6a11cb",
                  border: "none",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                立即體驗
              </button>
            </div>
          </div>
        </div>

        {/* 平台特色區塊 */}
        <div className="row mt-5 g-4">
          <div className="col-md-4">
            <div
              className="h-100 p-4 text-center rounded-3 shadow-sm"
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
              }}
            >
              <i className="bi bi-book fs-1 text-primary mb-3"></i>
              <h3 className="fw-bold">豐富課程</h3>
              <p>超過 1000 門課程，涵蓋程式設計、設計、商業等多個領域。</p>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="h-100 p-4 text-center rounded-3 shadow-sm"
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
              }}
            >
              <i className="bi bi-people fs-1 text-success mb-3"></i>
              <h3 className="fw-bold">專業講師</h3>
              <p>來自全球的頂尖講師，提供高質量的教學內容。</p>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="h-100 p-4 text-center rounded-3 shadow-sm"
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
              }}
            >
              <i className="bi bi-laptop fs-1 text-warning mb-3"></i>
              <h3 className="fw-bold">靈活學習</h3>
              <p>隨時隨地學習，支持多設備無縫切換。</p>
            </div>
          </div>
        </div>

        {/* 熱門課程區塊 */}
        <div className="row mt-5">
          <div className="col-md-12">
            <h2 className="fw-bold text-center mb-4">熱門課程</h2>
            <div
              className="card-container"
              style={{
                display: "flex",
                justifyContent: "space-between", // 讓卡片均勻分佈
                alignItems: "flex-start", // 讓卡片頂部對齊
              }}
            >
              {topCourses.map((course, index) => (
                <div
                  key={course._id}
                  style={{
                    flex: 1, // 讓卡片均分空間
                    margin: "0 10px", // 卡片之間的間距
                    display: "flex",
                    flexDirection: "column",
                    alignItems: index === 1 ? "center" : "flex-start", // 中間卡片置中
                  }}
                >
                  <div
                    className="card h-100 shadow-sm"
                    style={{ borderRadius: "12px", width: "100%" }} // 確保卡片寬度一致
                  >
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{course.title}</h5>
                      <p className="card-text">
                        報名人數: {course.studentCount} 人
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 用戶與講師區塊 */}
        <div className="row align-items-md-stretch mt-5 g-4">
          <div className="col-md-6">
            <div
              className="h-100 p-5 text-white rounded-3 shadow-sm"
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
                  padding: "10px 20px",
                }}
                onClick={handleRegisterRedirect}
              >
                登錄會員 / 註冊帳號
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <div
              className="h-100 p-5 text-white rounded-3 shadow-sm"
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
                  padding: "10px 20px",
                }}
                onClick={handleInstructorRedirect}
              >
                開始開設課程
              </button>
            </div>
          </div>
        </div>

        {/* 平台數據統計區塊 */}
        <div className="row mt-5">
          <div className="col-md-12">
            <div
              className="p-5 rounded-3"
              style={{
                background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
                color: "#fff",
                borderRadius: "15px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 className="fw-bold text-center mb-4">平台數據</h2>
              <div className="row text-center">
                <div className="col-md-4">
                  <h3 className="fw-bold">10,000+</h3>
                  <p>註冊用戶</p>
                </div>
                <div className="col-md-4">
                  <h3 className="fw-bold">500+</h3>
                  <p>課程數量</p>
                </div>
                <div className="col-md-4">
                  <h3 className="fw-bold">200+</h3>
                  <p>專業講師</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 用戶見證區塊 */}
        <div className="row mt-5">
          <div className="col-md-12">
            <h2 className="fw-bold text-center mb-4">用戶見證</h2>
            <div className="row g-4">
              {[1, 2, 3].map((testimonial) => (
                <div className="col-md-4" key={testimonial}>
                  <div
                    className="p-4 rounded-3 shadow-sm"
                    style={{ backgroundColor: "#fff", borderRadius: "12px" }}
                  >
                    <p>"這個平台意外的有幫助，課程內容非常實用！"</p>
                    <p className="fw-bold">- 用戶 {testimonial}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer
          className="pt-3 mt-4 text-center"
          style={{
            color: "#6c757d",
            borderTop: "1px solid #e9ecef",
            padding: "20px",
          }}
        >
          &copy; 2024 Jacky Zheng
        </footer>
      </div>
    </main>
  );
};

export default HomeComponent;
