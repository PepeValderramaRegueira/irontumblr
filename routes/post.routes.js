const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.render("posts/index")
})

module.exports = router;