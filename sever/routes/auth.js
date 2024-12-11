const router = require("express").Router();
const User = require("../model").user;
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerValidation = require("../validation").registorValidation;
const loginValidation = require("../validation").loginValidation;
const editorValidation = require("../validation").editorValidation;

// 中間件：驗證 token
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
  console.log("正在處理auth的請求");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("有正常運行auth");
});

router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  let Uf = await User.findOne({ _id }).exec();
  if (!Uf) {
    return res.status(404).send({ error: "找不到此用戶" }); // 用戶未找到
  }
  res.send(Uf);
});

router.post("/register", async (req, res) => {
  //確認數據是否符合規定
  let { username, email, password, role } = req.body;
  let { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const emailExist = await User.findOne({ email }).exec();
  if (emailExist) {
    return res.status(400).send("該信箱已被註册，請更换別的信箱。");
  }
  try {
    let newUser = new User({ username, email, password, role });
    await newUser.save();
    return res.send({
      msg: "使用者成功儲存",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      },
    });
  } catch (e) {
    return res.status(500).send("無法儲存使用者");
  }
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const FUser = await User.findOne({ email }).exec();
  if (!FUser) {
    return res.status(400).send("找不到此用戶，請確認信箱是否正確。");
  }
  FUser.comparePassword(password, (err, isMatch) => {
    if (err) return res.status(500).send(err);
    if (isMatch) {
      const tokenObj = { _id: FUser._id, email: FUser.email };
      const token = JWT.sign(tokenObj, process.env.PASSPORT_SECRET);
      return res.send({
        msg: "成功登入",
        token: "JWT " + token,
        user: FUser,
      });
    } else {
      return res.status(401).send("密碼錯誤");
    }
  });
});

router.patch("/:_id", authenticateToken, async (req, res) => {
  let { _id } = req.params;

  // 驗證請求數據
  let { error } = editorValidation(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message }); // 返回具體錯誤信息
  }

  try {
    // 查找用戶
    let Uf = await User.findById(_id).exec();
    if (!Uf) {
      return res.status(404).send({ error: "找不到此用戶" }); // 用戶未找到
    }

    // 驗證當前用戶是否與要修改的用戶相同
    if (Uf._id.toString() === req.user._id.toString()) {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).send({ error: "沒有提供更新資料" });
      }

      let updatedData = req.body;

      // 如果有提供密碼，則進行加密處理
      if (updatedData.password) {
        const salt = await bcrypt.genSalt(10); // 生成salt
        updatedData.password = await bcrypt.hash(updatedData.password, salt); // 使用salt加密密碼
      }

      // 更新用戶資料
      const updatedUser = await User.findByIdAndUpdate(_id, updatedData, {
        new: true,
        runValidators: true,
      });
      console.log(updatedUser);

      if (!updatedUser) {
        return res.status(500).send({ error: "更新失敗" });
      }

      return res.send({ msg: "資料被更新", user: updatedUser });
    } else {
      return res.status(403).send({ error: "您無權更改此資料" }); // 權限錯誤
    }
  } catch (e) {
    return res.status(500).send({ error: e.message }); // 伺服器錯誤
  }
});

module.exports = router;
