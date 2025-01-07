const router = require("express").Router();
const User = require("../model").user;
const JWT = require("jsonwebtoken");

const registerValidation = require("../validation").registorValidation;
const loginValidation = require("../validation").loginValidation;
const editorValidation = require("../validation").editorValidation;

const handleError = (res, statusCode, message) => {
  return res.status(statusCode).send({ error: message });
};

// 中間件：驗證 token
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.replace("JWT ", "");

  if (!token) {
    return res.status(401).send("沒有提供 token");
  }

  JWT.verify(token, process.env.PASSPORT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send("無效的 token");
    }
    req.user = user; // 保存解析後的用戶信息
    next(); // 通過驗證，繼續執行後續的路由
  });
}

router.use((req, res, next) => {
  console.log("正在處理 auth 的請求");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("有正常運行 auth");
});

router.get("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await User.findById(_id).select("-password").exec();

    if (!user) {
      return handleError(res, 404, "找不到此用戶");
    }

    res.send(user);
  } catch (error) {
    handleError(res, 500, "伺服器錯誤");
  }
});

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);

  if (error) {
    return handleError(res, 400, error.details[0].message);
  }

  const { username, email, password, role } = req.body;

  try {
    const emailExist = await User.findOne({ email }).select("email").exec();

    if (emailExist) {
      return handleError(res, 400, "該信箱已被註册，請更换別的信箱。");
    }

    const newUser = new User({ username, email, password, role });
    await newUser.save();

    res.send({
      msg: "使用者成功儲存",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    handleError(res, 500, "無法儲存使用者");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { error } = loginValidation(req.body);

  if (error) {
    return handleError(res, 400, error.details[0].message);
  }

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return handleError(res, 400, "找不到此用戶，請確認信箱是否正確。");
    }

    const isMatch = await user.comparePassword(password); // 使用 async/await
    if (!isMatch) {
      return handleError(res, 401, "密碼錯誤");
    }

    const token = JWT.sign(
      { _id: user._id, email: user.email },
      process.env.PASSPORT_SECRET,
      { expiresIn: "1h" }
    );

    res.send({
      msg: "成功登入",
      token: "JWT " + token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    handleError(res, 500, "伺服器錯誤");
  }
});

router.patch("/:_id", authenticateToken, async (req, res) => {
  const { _id } = req.params;
  const { error } = editorValidation(req.body);

  if (error) {
    return handleError(res, 400, error.details[0].message);
  }

  try {
    const Uf = await User.findById(_id).exec();
    if (!Uf) {
      return handleError(res, 404, "找不到此用戶");
    }

    if (Uf._id.toString() !== req.user._id.toString()) {
      return handleError(res, 403, "您無權更改此資料");
    }

    if (Object.keys(req.body).length === 0) {
      return handleError(res, 400, "沒有提供更新資料");
    }

    const updatedData = { ...req.body };

    // 更新用戶資料
    const updatedUser = await User.findById(_id);
    if (!updatedUser) {
      return handleError(res, 404, "找不到此用戶");
    }

    // 將更新資料合併到現有用戶資料中
    Object.assign(updatedUser, updatedData);

    // 保存資料，觸發 pre("save")
    await updatedUser.save();

    // 排除密碼欄位後返回更新後的用戶資料
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    return res.send({ msg: "資料被更新", user: userResponse });
  } catch (e) {
    return handleError(res, 500, e.message);
  }
});

module.exports = router;
