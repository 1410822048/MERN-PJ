import { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileComponent = ({ currentUser, setCurrentUser }) => {
  const [isEditing, setIsEditing] = useState(false); // 编辑模式
  const [username, setUsername] = useState(""); // 用户名
  const [password, setPassword] = useState(""); // 密码

  let [usernameerror, setUserNameError] = useState(""); // 狀態：電子信箱錯誤訊息
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
    //更新資料的OnClick event
    if (!currentUser || !currentUser.user) {
      console.error("currentUser is not defined"); //確認是否都有currentUser
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
        // autoClose: 200, // 顯示1.5秒後自動關閉
        className: "toast-custom",
        style: {
          backgroundColor: "#FF6347", // 可以使用不同的颜色来区分提示信息
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
      return; // 退出函数，不继续执行更新操作
    }

    if (Object.keys(updatedData).length > 0) {
      try {
        let res = await AuthService.editCurrentUserProfile(_id, updatedData);

        if (res.data && res.data.user) {
          const updatedUser = res.data.user; // 后端返回的更新数据

          // 更新状态
          setCurrentUser((prev) => ({
            ...prev,
            user: { ...updatedUser }, // 确保更新为新的用户数据
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

          // 关闭编辑模式
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
      style={{ backgroundColor: "#f4f7fb", minHeight: "90vh", padding: "80px" }}
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
          className="container py-4"
          style={{
            backgroundColor: "#2C1A65",
            borderRadius: "20px",
            maxWidth: "800px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
            padding: "1rem",
            marginTop: "30px",
          }}
        >
          {/* 第一层: 个人档案标题 */}
          <div
            className="text-center mb-4"
            style={{
              backgroundColor: "#2C1A65",
              color: "#ffffff",
              padding: "1.5rem",
            }}
          >
            <h2 className="fw-bold" style={{ fontSize: "2rem" }}>
              個人檔案
            </h2>
          </div>

          {/* 第二层: 用户信息展示 */}
          <div
            className="d-flex align-items-center mb-4"
            style={{
              backgroundColor: "#f9f9f9",
              padding: "1.5rem",
              borderRadius: "15px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "30px",
                border: "4px solid #2C1A65",
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

            <div
              className="d-flex justify-content-between align-items-center w-100"
              style={{ flex: 1 }}
            >
              <div>
                <strong
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {currentUser?.user?.username}
                </strong>
              </div>

              <div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                  style={{
                    backgroundColor: "#FFD700",
                    color: "#2C1A65",
                    borderRadius: "30px",
                    fontWeight: "bold",
                    padding: "10px 30px",
                    textAlign: "center",
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
                padding: "1.5rem",
                borderRadius: "15px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <form>
                <div className="mb-3" style={{ position: "relative" }}>
                  <label htmlFor="username" className="form-label">
                    用户名：
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={username}
                    onKeyDown={handleKeyDown} // 新增事件監聽
                    onChange={(e) => setUsername(e.target.value)}
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
                <div className="mb-3" style={{ position: "relative" }}>
                  <label htmlFor="password" className="form-label">
                    密码：
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onKeyDown={handleKeyDown} // 新增事件監聽
                    onChange={(e) => setPassword(e.target.value)}
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
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={HandleProfileEdit}
                >
                  保存更改
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ms-3"
                  onClick={() => setIsEditing(false)}
                >
                  取消
                </button>
              </form>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "1.5rem",
                borderRadius: "15px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <table className="table table-borderless text-muted">
                <tbody>
                  <tr>
                    <td style={{ width: "120px" }}>
                      <strong>姓名：</strong>
                    </td>
                    <td>{currentUser?.user?.username}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>用户ID：</strong>
                    </td>
                    <td>{currentUser?.user?._id}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>电子邮件：</strong>
                    </td>
                    <td>{currentUser?.user?.email}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>身份：</strong>
                    </td>
                    <td>{currentUser?.user?.role}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {/* Toast Container for center positioning */}
      <ToastContainer
        autoClose={1000}
        className="position-fixed p-3"
        position="top-center"
        style={{
          top: "50%", // 垂直居中
          left: "50%", // 水平居中
          transform: "translate(-50%, -50%)", // 精確居中
          zIndex: 1050, // 確保顯示在其他元素上方
        }}
        transition={Slide} // Apply slide transition
      />
    </main>
  );
};

export default ProfileComponent;
