import axios from "axios";
// const API_URL = "http://localhost:8080/api/user";
const API_URL = "https://mern-pj.onrender.com/api/user";

class AuthService {
  login(email, password) {
    return axios.post(API_URL + "/login", {
      email,
      password,
    });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(username, email, password, role) {
    return axios.post(API_URL + "/register", {
      username,
      email,
      password,
      role,
    });
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  editCurrentUserProfile(_id, updatedData) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(`${API_URL}/${_id}`, updatedData, {
      headers: {
        Authorization: token,
      },
    });
  }
}
const authServiceInstance = new AuthService();
export default authServiceInstance;
