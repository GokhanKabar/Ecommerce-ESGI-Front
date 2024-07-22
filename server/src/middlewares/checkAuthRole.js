const {User} = require("../databases/sequelize/models");
const jwt= require("jsonwebtoken");
const config = require("../config/config.json");



module.exports = ({ roles = [] } = {}) => async (req, res, next) => {
  const header = req.headers.Authorization ?? req.headers.authorization;
  
  if (!header) {
    return res.sendStatus(401);
  }
  
  const [type, token] = header.split(/\s+/);
  
  if (type !== 'Bearer') {
    return res.sendStatus(401);
  }
  
  try {
    const decoded = jwt.verify(token, config.development.privateKey);
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.sendStatus(401);
    }
    
    req.user = user;
    if (roles.length > 0 && !roles.includes(user.role)) {
      return res.sendStatus(403);
    }
    
    next();
  } catch (e) {
    return res.sendStatus(401);
  }
};
