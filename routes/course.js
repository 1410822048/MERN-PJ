const { courseValidation, courseUpdatedValidation } = require("../validation");
const router = require("express").Router();
const Course = require("../model").course;
const JWT = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.header("Authorization"); // 從 Authorization 標頭中取出 token

  if (!token) {
    return res.status(401).send("沒有提供 token");
  }

  const jwtToken = token.replace("JWT ", "");

  JWT.verify(jwtToken, process.env.PASSPORT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send("無效的 token");
    }
    req.user = user; // 保存解析後的用戶信息
    next(); // 通過驗證，繼續執行後續的路由
  });
}

router.use((req, res, next) => {
  console.log("正在接收course的請求");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("有正常運行course");
});

router.get("/", async (req, res) => {
  //如要串接 .populate 則需將.exec 放在最後 因為他需要的是 queryObj
  try {
    let Cf = await Course.find({})
      .populate("instructor", ["username", "email"])
      //前面是給予 要包裹物件的名稱 後面是對應物件的內容 比方說找到課程id 但不知道其姓名 可以使用這方法
      .exec();
    return res.send(Cf);
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.get("/instructor/:_instructor_id", async (req, res) => {
  //取得講師的id
  let { _instructor_id } = req.params;
  try {
    let Cf = await Course.find({ instructor: _instructor_id }) //前面的instructor 呼應 course-model裡面 instructor的保留字
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(Cf);
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.get("/student/:_student_id", async (req, res) => {
  //取得學生的id
  let { _student_id } = req.params;
  try {
    let Cf = await Course.find({ students: _student_id }) //前面的students 呼應 course-model裡面 students的保留字
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(Cf);
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.get("/findByName/:name", async (req, res) => {
  let { name } = req.params;
  try {
    // 使用正则表达式进行模糊搜索
    let Cf = await Course.find({ title: { $regex: name, $options: "i" } }) // $regex為模糊搜尋title 包含name的所有文檔; $options: "i" 表示忽略大小写
      .populate("instructor", ["username", "email"]) // 查询讲师的用户名和邮箱
      .exec();
    return res.send(Cf);
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let Cf = await Course.find({ _id })
      .populate("instructor", ["email"]) // 內建函數 查找資料庫內 建立者的資料
      .exec();
    return res.send(Cf);
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.post("/", async (req, res) => {
  //新增課程
  let { title, description, price } = req.body;
  let { error } = courseValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  if (req.user.isStudent()) {
    //調用user-model 中 的instance fc 來確認身分
    return res.status(400).send("只有講師才可發佈");
  }
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id, //確保驗整的資料與mongoDB內的ID一致
    });
    await newCourse.save();
    return res.send("新課程已經保存");
  } catch (e) {
    return res.status(500).send("無法創建");
  }
});

router.post("/enroll/:_id", authenticateToken, async (req, res) => {
  let { _id } = req.params;
  try {
    let course = await Course.findOne({ _id }).exec();
    if (course.students.includes(req.user._id)) {
      return res.status(400).send("已擁有該課程");
    }
    course.students.push(req.user._id);
    await course.save();
    res.send("註冊完成");
  } catch (e) {
    return res.status(500).send("註冊失敗");
  }
});

router.post("/quit/:_id", authenticateToken, async (req, res) => {
  let { _id } = req.params;
  try {
    let course = await Course.findOne({ _id }).exec();
    if (!course.students.includes(req.user._id)) {
      // 檢查學生是否已註冊
      return res.status(400).send("未註冊該課程");
    }
    course.students = course.students.filter(
      (studentId) => studentId.toString() !== req.user._id.toString()
    ); // 如果沒有course.students = 的話會導致陣列未被改變。 這麼做才能取代原有陣列，也就才會更新 .filter是過濾不要的值
    await course.save();
    res.send("已退出課程");
  } catch (e) {
    return res.status(500).send("退課失敗");
  }
});

router.patch("/:_id", authenticateToken, async (req, res) => {
  //更改課程
  let { _id } = req.params;
  let { error } = courseUpdatedValidation(req.body);
  // console.log(editCourse);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    let Cf = await Course.findById({ _id }).exec();

    if (!Cf) {
      return res.status(400).send("找不到此課程，無法更新其內容");
    }

    let editCourse = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({ error: "沒有提供更新資料" });
    }

    if (Cf.instructor.equals(req.user._id)) {
      const UpdatedCourse = await Course.findByIdAndUpdate(_id, editCourse, {
        new: true,
        runValidation: true,
      });
      console.log(UpdatedCourse);
      return res.send("課程已被更新");
    } else {
      return res.status(403).send("只有本人可以編輯");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let Cf = await Course.findOne({ _id }).exec();
    if (!Cf) {
      return res.status(400).send("找不到此課程，無法刪除");
    }
    if (Cf.instructor.equals(req.user._id)) {
      await Course.deleteOne({ _id }).exec();
      return res.send("課程已被刪除");
    } else {
      return res.status(403).send("只有本人可以刪除課程");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.get("/top-courses", async (req, res) => {
  try {
    const topCourses = await Course.aggregate([
      {
        $project: {
          title: 1, // 保留課程名稱
          studentCount: { $size: "$students" }, // 計算 students 陣列長度
        },
      },
      {
        $sort: { studentCount: -1 }, // 按 studentCount 降序排序
      },
      {
        $limit: 3, // 只取前 3 名
      },
    ]);

    res.status(200).json(topCourses);
  } catch (error) {
    console.error("Error fetching top courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
