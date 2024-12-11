const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const saltRounds = 14;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: [3, "請至少輸入三個字元"],
    maxlength: [12, "超出字數限制!!"],
  },
  email: {
    type: String,
    required: true,
    minlength: [5, "請至少輸入五個字元"],
    maxlength: [25, "超出字元限制!!"],
  },
  password: {
    type: String,
    minlength: [8, "Password must be at least 8 characters"],
    maxlengeh: [15, "Password must be less than 15 characters"],
    validate: {
      validator: function (v) {
        // 表達檢查是否包含至少一個字母和一個數字
        return /^(?=.*[A-Za-z])(?=.*\d)/.test(v);
      },
      message: "Password must contain at least one letter and one number",
    },
  },
  role: {
    type: String,
    required: true,
    enum: ["Student", "Instructor"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.isStudent = function () {
  return this.role == "Student"; //無法用arrow fc 會抓不到 this
};

userSchema.methods.isInstructor = function () {
  return this.role == "Instructor";
};

userSchema.methods.comparePassword = async function (password, cb) {
  let result;
  try {
    result = await bcrypt.compare(password, this.password);
    return cb(null, result);
  } catch (e) {
    return cb(e, result);
  }
};

userSchema.pre("save", async function (next) {
  //表示在save前觸發此fc
  if (this.isNew || this.isModified("password")) {
    //isNew 確認是否為新文檔 || isModified確認是否經修改過 兩者為mongoose 內建函數
    const hashedPass = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPass;
  }
  next();
  //把主動權交給下一位
});

module.exports = mongoose.model("User", userSchema);
