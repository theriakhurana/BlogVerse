const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    tags: {
      type: [String],
      default: [],
      required: false,
    },

    likes: {
      type: Number,
      default: 0,
      required: false,
    },

    comments: [
      {
        user: {
          type: String,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    
  },
  {
    timestamps: true,
    collection: "crud",
  }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
