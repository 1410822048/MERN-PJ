import { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileComponent = ({ currentUser, setCurrentUser }) => {
  const [isEditing, setIsEditing] = useState(false); // 编辑模式
  const [username, setUsername] = useState(""); // 用户名
  const [password, setPassword] = useState(""); // 密码

  let [usernameerror, setUserNameError] = useState(""); // 狀態：用戶名錯誤訊息
  let [passwordError, setPasswordError] = useState(""); // 狀態：密碼錯誤訊息

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, [setCurrentUser]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      HandleProfileEdit(); // 當按下 Enter 時執行 HandleLogin
      e.preventDefault(); // 阻止預設表單提交
    }
  };

  const HandleProfileEdit = async () => {
    // 更新資料的 OnClick event
    if (!currentUser || !currentUser.user) {
      console.error("currentUser is not defined"); // 確認是否都有 currentUser
      return;
    }

    let _id = currentUser.user._id; // 获取当前用户 ID
    const updatedData = {};

    // 只在数据有更改时更新
    if (username && username !== currentUser?.user?.username) {
      updatedData.username = username;
    }
    if (password && password !== currentUser?.user?.password) {
      updatedData.password = password;
    }
    if (Object.keys(updatedData).length === 0) {
      toast("没有需要更新的内容！", {
        className: "toast-custom",
        style: {
          backgroundColor: "#FF6347",
          color: "#ffffff",
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
          maxWidth: "250px",
          maxHeight: "20px",
          fontSize: "1rem",
          whiteSpace: "nowrap",
          padding: ".5rem",
          textAlign: "center",
        },
        closeButton: false,
        position: "top-center", // Top-center position
        transition: Slide,
        hideProgressBar: true,
      });
      return;
    }

    if (Object.keys(updatedData).length > 0) {
      try {
        let res = await AuthService.editCurrentUserProfile(_id, updatedData);

        if (res.data && res.data.user) {
          const updatedUser = res.data.user; // 後端返回的更新數據

          // 更新狀態
          setCurrentUser((prev) => ({
            ...prev,
            user: { ...updatedUser }, // 确保更新為新的用户数据
          }));

          // 更新 localStorage，保留 token
          const currentUserData =
            JSON.parse(localStorage.getItem("user")) || {};

          currentUserData.user = updatedUser;

          localStorage.setItem("user", JSON.stringify(currentUserData));

          console.log(
            "Updated localStorage:",
            JSON.parse(localStorage.getItem("user"))
          );

          setIsEditing(false);

          toast("更新成功", {
            autoClose: 200, // 顯示1.5秒後自動關閉
            className: "toast-custom",
            style: {
              backgroundColor: "#8080C0",
              color: "#ffffff",
              borderRadius: "15px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
              maxWidth: "600px",
              fontSize: "1rem",
              whiteSpace: "nowrap",
              padding: ".5rem",
            },
            closeButton: false, // 不顯示關閉按鈕
            position: "top-center", // Top-center position
            transition: Slide,
            hideProgressBar: true,
          });
        }
      } catch (e) {
        if (e.response.data.error.includes("用戶")) {
          setUserNameError(e.response.data.error);
        }
        if (e.response.data.error.includes("密碼")) {
          setPasswordError(e.response.data.error); // 設定密碼錯誤訊息
        }
      }
    }
  };

  return (
    <main
      style={{
        backgroundColor: "#f4f7fb",
        minHeight: "90vh",
        padding: "20px",
        "@media (min-width: 768px)": {
          padding: "80px",
        },
      }}
    >
      {!currentUser && (
        <div
          style={{
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          請先登入才可查探個人訊息
        </div>
      )}
      {currentUser && (
        <div
          style={{
            backgroundColor: "#2C1A65",
            borderRadius: "20px",
            maxWidth: "800px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
            padding: "1rem",
            margin: "0 auto",
            marginTop: "30px",
          }}
        >
          {/* 第一层: 个人档案标题 */}
          <div
            style={{
              backgroundColor: "#2C1A65",
              color: "#ffffff",
              padding: "1.5rem",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: "2rem", fontWeight: "bold" }}>個人檔案</h2>
          </div>

          {/* 第二层: 用户信息展示 */}
          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "1.5rem",
              borderRadius: "15px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column", // 預設為垂直排列（手機端）
              alignItems: "center", // 內容置中
              gap: "1rem", // 元素間距
              "@media (min-width: 768px)": {
                flexDirection: "row", // 桌面端改為水平排列
                alignItems: "center", // 內容垂直置中
              },
            }}
          >
            {/* 頭像區域 */}
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "4px solid #2C1A65",
                flexShrink: 0, // 防止頭像被壓縮
              }}
            >
              <img
                src="/images/profile.png"
                alt="User Avatar"
                style={{
                  width: "125%",
                  height: "125%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* 用戶名和按鈕區域 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column", // 預設為垂直排列（手機端）
                alignItems: "center", // 內容置中
                gap: "1rem", // 元素間距
                flex: 1, // 佔滿剩餘空間
                "@media (min-width: 768px)": {
                  flexDirection: "row", // 桌面端改為水平排列
                  justifyContent: "space-between", // 用戶名和按鈕分開
                  alignItems: "center", // 內容垂直置中
                },
              }}
            >
              {/* 用戶名 */}
              <div>
                <strong
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#2C1A65", // 用戶名顏色
                  }}
                >
                  {currentUser?.user?.username}
                </strong>
              </div>

              {/* 編輯資料按鈕 */}
              <div>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    backgroundColor: "#FFD700",
                    color: "#2C1A65",
                    borderRadius: "30px",
                    fontWeight: "bold",
                    padding: "10px 30px",
                    textAlign: "center",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease", // 添加過渡效果
                    ":hover": {
                      backgroundColor: "#E6C200", // 滑鼠懸停時變色
                    },
                  }}
                >
                  编辑资料
                </button>
              </div>
            </div>
          </div>

          {/* 编辑模式 */}
          {isEditing ? (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "2rem",
                borderRadius: "15px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                marginTop: "1.5rem",
              }}
            >
              <form>
                {/* 用户名输入框 */}
                <div style={{ marginBottom: "1.5rem", position: "relative" }}>
                  <label
                    htmlFor="username"
                    style={{
                      fontSize: "1rem",
                      color: "#555",
                      marginBottom: "0.5rem",
                      display: "block",
                      fontWeight: "500",
                    }}
                  >
                    用户名：
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
                    }}
                  />
                  {usernameerror && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "-20px",
                        right: "0",
                        fontSize: "0.9rem",
                        color: "red",
                        maxWidth: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {usernameerror}
                    </span>
                  )}
                </div>

                {/* 密码输入框 */}
                <div style={{ marginBottom: "1.5rem", position: "relative" }}>
                  <label
                    htmlFor="password"
                    style={{
                      fontSize: "1rem",
                      color: "#555",
                      marginBottom: "0.5rem",
                      display: "block",
                      fontWeight: "500",
                    }}
                  >
                    密码：
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
                    }}
                  />
                  {passwordError && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "-20px",
                        right: "0",
                        fontSize: "0.9rem",
                        color: "red",
                        maxWidth: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {passwordError}
                    </span>
                  )}
                </div>

                {/* 按钮区域 */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "1rem",
                    marginTop: "1.5rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={HandleProfileEdit}
                    style={{
                      backgroundColor: "#28a745",
                      color: "#ffffff",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "500",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#218838";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#28a745";
                    }}
                  >
                    保存更改
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{
                      backgroundColor: "#6c757d",
                      color: "#ffffff",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "500",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#5a6268";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#6c757d";
                    }}
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // 非編輯模式的顯示內容
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "2rem",
                borderRadius: "15px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                marginTop: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  gap: "1rem",
                }}
              >
                <div style={{ fontWeight: "bold", color: "#555" }}>姓名：</div>
                <div>{currentUser?.user?.username}</div>
                <div style={{ fontWeight: "bold", color: "#555" }}>用户ID：</div>
                <div>{currentUser?.user?._id}</div>
                <div style={{ fontWeight: "bold", color: "#555" }}>電子信箱：</div>
                <div>{currentUser?.user?.email}</div>
                <div style={{ fontWeight: "bold", color: "#555" }}>身份：</div>
                <div>{currentUser?.user?.role}</div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Toast Container for center positioning */}
      <ToastContainer
        autoClose={1000}
        position="top-center"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1050,
        }}
        transition={Slide}
      />
    </main>
  );
};

export default ProfileComponent;