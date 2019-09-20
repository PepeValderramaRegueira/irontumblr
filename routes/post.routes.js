const router = require("express").Router();
const upload = require("./../config/cloudinary.config");
const access = require("./../middlewares/access.mid");

router.get("/", (req, res, next) => {
  res.render("posts/index")
})

router.get("/new", access.checkLogin, (req,res,next)=>{
  if (req.query.error) {
    res.render("posts/newpost", {message: "Please fill all the fields"})
    return
  }

  res.render("posts/newpost")
})

router.post("/new", [
  access.checkLogin,
  upload.single('picName')
], (req, res, next) => {
  let {title, content} = req.body
  
  if (!content || !title || !req.file) {
    res.redirect("/posts/new?error=empty-fields")
    return
  }
  
  let {originalname, url} = req.file

})


module.exports = router;