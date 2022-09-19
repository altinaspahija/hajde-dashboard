/**
 * Check if user is allowed to access the route based on the role (middleware)
 * @param  {...any} allowed allowed roles 
 * @returns 
 */
module.exports = (...allowed) => {
  const isAllowed = role => allowed.indexOf(role) > -1;

  return (req, res, next) => {
      if(req.user && isAllowed(req.user.role)) {
          next();
      } else {
          res.status(401);
          res.json({
              "status":"Failed",
              "msg": "Unauthorized"
          });
      }
  }
}