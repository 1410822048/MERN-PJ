import axios from "axios";
const API_URL = "http://localhost:8080/api/course";

class CourseService {
  post(title, description, price) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL,
      { title, description, price },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
  getEnrollCourse(_id) {
    //學生已註冊的課程
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(`${API_URL}/student/${_id}`, {
      headers: {
        Authorization: token,
      },
    });
  }

  get(_id) {
    //使用Instructor來找到講師擁有的課程
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(`${API_URL}/instructor/${_id}`, {
      headers: {
        Authorization: token,
      },
    });
  }
  getCourseByName(name) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(`${API_URL}/findByName/${name}`, {
      headers: {
        Authorization: token,
      },
    });
  }
  enroll(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      `${API_URL}/enroll/${_id}`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
  del(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.delete(`${API_URL}/${_id}`, {
      headers: {
        Authorization: token,
      },
    });
  }
  update(_id, editCourse) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    console.log("Sending data to update:", editCourse); // 查看發送的資料

    return axios.patch(`${API_URL}/${_id}`, editCourse, {
      headers: {
        Authorization: token,
      },
    });
  }
  quit(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      `${API_URL}/quit/${_id}`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
}
const CourseServiceInstance = new CourseService();
export default CourseServiceInstance;
