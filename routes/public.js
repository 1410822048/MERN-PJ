const router = require("express").Router();
const Course = require("../model").course;

// 公開路由：獲取熱門課程
router.get("/top-courses", async (req, res) => {
  try {
    const topCourses = await Course.aggregate([
      {
        $project: {
          title: 1,
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
