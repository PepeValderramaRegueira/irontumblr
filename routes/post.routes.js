const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.render("posts/index")
})

router.get("/new",(req,res,next)=>{
  res.render("posts/newpost")
})


module.exports = router;