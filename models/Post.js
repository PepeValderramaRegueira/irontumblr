const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const postSchema = new Schema(
  {
    title: String,
    content: String,
    creatorId: [ { type : Schema.Types.ObjectId, ref: 'User' } ],
    picName: String,
    picPath: String
  },
  {
    timestamps: true
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;