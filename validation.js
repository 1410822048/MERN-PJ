const Joi = require("joi");

const registorValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(12).required().messages({
      "string.min": "用戶名稱長度至少 3 個字元。",
      "string.max": "用戶名稱長度不能超過 12 個字元。",
      "string.empty": "用戶名稱不能為空。",
      "any.required": "用戶名稱為必填項。",
    }),
    email: Joi.string().min(5).max(25).required().email().messages({
      "string.min": "電子信箱至少 3 個字元。",
      "string.max": "電子信箱不能超過 12 個字元。",
      "string.email": "請輸入有效的電子郵件地址。",
      "string.empty": "電子信箱不能為空。",
      "any.required": "電子信箱為必填項",
    }),
    password: Joi.string()
      .min(8)
      .max(15)
      .required()
      .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,15}$"))
      .messages({
        "string.min": "密碼至少 8個字元。",
        "string.max": "密碼不能超過 15 個字元。",
        "string.pattern.base":
          "密碼必须至少包含一個字母和一個數字，且長度在 8 到 15 個字元之間。",
        "string.empty": "密碼不能為空。",
        "any.required": "密碼是必填項。",
      }),
    role: Joi.string()
      .valid("Student", "Instructor") // 限制為 "Student" 或 "Instructor"
      .required()
      .messages({
        "string.empty": "身份不能為空。",
        "any.required": "身份是必填的。",
        "any.invalid": "身份必須是 Student 或 Instructor。",
        "any.only": "身份必須是 Student 或 Instructor。",
      }),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email().messages({
      "string.email": "🚫此信箱尚未註册。",
      "string.empty": "🚫電子信箱不能為空。",
      "any.required": "電子信箱為必填項。",
    }),
    password: Joi.string().required().messages({
      "string.pattern.base": "🚫邮箱或密码错误，请重新输入。",
      "string.empty": "🚫密碼不能為空。",
      "any.required": "密碼是必填項。",
    }),
  });
  return schema.validate(data);
};

const courseValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(6).max(20).required().messages({
      "string.min": "課程名稱至少 6 個字元。",
      "string.max": "課程名稱不能超過 20 個字元。",
      "string.empty": "課程名稱不能為空。",
      "any.required": "課程名稱為必填項。",
    }),
    description: Joi.string().min(6).max(50).required().messages({
      "string.min": "課程介紹至少 6 個字元。",
      "string.max": "課程介紹不能超過 50 個字元。",
      "string.empty": "課程介紹不能為空。",
      "any.required": "課程介紹為必填項。",
    }),
    price: Joi.number().min(200).max(9999).required().messages({
      "number.min": "課程價格至少 ≥ 200。",
      "number.max": "課程金額必須 < 10000",
      "number.empty": "課程金額不能為空。",
      "any.required": "課程金額為必填項。",
    }),
  });
  return schema.validate(data);
};

const editorValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(12).optional().messages({
      "string.min": "用戶名稱長度至少 3 個字元。",
      "string.max": "用戶名稱長度不能超過 12 個字元。",
      "string.empty": "用戶名稱不能為空。",
    }),
    password: Joi.string()
      .min(8)
      .max(15)
      .optional()
      .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,15}$"))
      .messages({
        "string.min": "密碼至少 8個字元。",
        "string.max": "密碼不能超過 15 個字元。",
        "string.pattern.base":
          "密碼必须至少包含一個字母和一個數字，且長度在 8 到 15 個字元之間。",
        "string.empty": "密碼不能為空。",
      }),
  });
  return schema.validate(data);
};

const courseUpdatedValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(6).max(20).optional().messages({
      "string.min": "課程名稱至少 6 個字元。",
      "string.max": "課程名稱不能超過 20 個字元。",
      "string.empty": "課程名稱不能為空。",
    }),
    description: Joi.string().min(6).max(50).optional().messages({
      "string.min": "課程介紹至少 6 個字元。",
      "string.max": "課程介紹不能超過 50 個字元。",
      "string.empty": "課程介紹不能為空。",
    }),
    price: Joi.number().min(200).max(9999).optional().messages({
      "number.min": "課程價格至少 ≥ 200。",
      "number.max": "課程金額必須 < 10000",
      "number.empty": "課程金額不能為空。",
    }),
  });
  return schema.validate(data);
};

module.exports.registorValidation = registorValidation;
module.exports.loginValidation = loginValidation;
module.exports.courseValidation = courseValidation;
module.exports.editorValidation = editorValidation;
module.exports.courseUpdatedValidation = courseUpdatedValidation;
