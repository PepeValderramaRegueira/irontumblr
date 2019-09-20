const router = require("express").Router();
const upload = require("./../config/cloudinary.config");
const access = require("./../middlewares/access.mid");
const Post = require("./../models/Post");
const Comment = require("./../models/Comment");

router.get("/", (req, res, next) => {
  Post.find()
    .populate("creatorId")
    .then(posts => {
      res.render("posts/index", { posts });
    });
});

router.get("/new", access.checkLogin, (req, res, next) => {
  if (req.query.error) {
    res.render("posts/newpost", { message: "Please fill all the fields" });
    return;
  }

  res.render("posts/newpost");
});

router.post(
  "/new",
  [access.checkLogin, upload.single("picName")],
  (req, res, next) => {
    let { title, content } = req.body;

    if (!content || !title || !req.file) {
      res.redirect("/posts/new?error=empty-fields");
      return;
    }

    let { originalname, url } = req.file;
    Post.create({
      title,
      content,
      picName: originalname,
      picPath: url,
      creatorId: req.user._id
    })
      .then(newPost => {
        res.redirect("/posts");
      })
      .catch(error => {
        console.log(error);
      });
  }
);

router.post(
  "/:postid/newComment",
  [access.checkLogin, upload.single("picName")],
  (req, res, next) => {
    let { content } = req.body;
    let { postid } = req.params;
    if (!content) {
      res.redirect("/posts/newComment?error=empty-fields");
      return;
    }
    let originalname = null;
    let url = null;
    if (req.file) {
      originalname = req.file.originalname;
      url = req.file.url;
    }
    Comment.create({
      content,
      picName: originalname,
      picPath: url,
      authorId: req.user._id
    })
      .then(newComment => {
        console.log(newComment);
        Post.findByIdAndUpdate(postid, { $push: { comments: newComment._id } }).then(commentAdded => {
          res.redirect(`/posts/${postid}`);
          return;
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
);

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .populate("creatorId")
    .populate({ path: "comments", populate: { path: "authorId" } })
    .then(post => {
      res.render("posts/post-detail", {
        post
      });
    });
});
module.exports = router;
