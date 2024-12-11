let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../model").user;

module.exports = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  //这个方法由前綴中提取 JWT，前提是 JWT 存在于以 jwt 为前缀的。
  opts.secretOrKey = process.env.PASSPORT_SECRET;
  // 當前配置.env 環境中的 secretOrKey 用來檢測 網站有無被非法盜用

  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
        let FUser = await User.findOne({ _id: jwt_payload._id }).exec();
        //jwt_payload 回傳一個obj 裡面包含 email,_id,iat 但我們只要取_id 來查找身分
        if (FUser) {
          return done(null, FUser);
        } else {
          return done(null, false, { message: "No user found" }); // 没有找到用户时，返回 false
        }
      } catch (e) {
        return done(e, false);
      }
    })
  );
};
