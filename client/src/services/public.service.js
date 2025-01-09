import axios from "axios";
// const API_URL = "http://localhost:8080/api/public";
const API_URL = "https://mern-pj.onrender.com/api/public";

class PublicService {
  // 獲取熱門課程
  getTopCourses() {
    return axios.get(API_URL + "/top-courses");
  }
}

const publicServiceInstance = new PublicService();
export default publicServiceInstance;
