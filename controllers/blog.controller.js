const Blog = require("../models/blog.model");

// Render form to create a new blog
const renderCreateForm = (req, res) => {
  res.render("create-blog");
};

// Display all blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
    res.render("blog-list", { blogs });  
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Handle blog creation
const createBlog = async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;
    const tagArray = tags ? tags.split(",").map(t => t.trim()) : [];
    await Blog.create({ title, content, author, tags: tagArray });
    res.redirect(`/update-success?message=Blog added successfully`);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Render form to edit a blog
const renderEditForm = async (req, res) => {

  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);  
    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    const tagsString = blog.tags ? blog.tags.join(", ") : "";
    res.render("update-blog", { blog, tagsString });  
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;  
    const { title, content, author, tags } = req.body;
    const tagArray = tags ? tags.split(",").map(t => t.trim()) : [];
   
    await Blog.findByIdAndUpdate(req.params.id, {
      title,
      content,
      author,
      tags: tagArray
    });
  

    res.redirect(`/update-success?message=Blog updated successfully`);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect(`/update-success?message=Blog deleted successfully`);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Like a blog (increment like count)
const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.likes += 1;
    await blog.save();

    res.json({ likes: blog.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Render comments for a specific blog post
const getComments = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);  
    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    const comments = blog.comments || [];  
    res.render("comments", { blog, comments }); 
  } catch (err) {
    console.error("Error fetching blog comments:", err);
    res.status(500).send("Internal Server Error");
  }
};


// Add a comment to a specific blog post
const addComment = async (req, res) => {
  const { id } = req.params; 
  const { comment } = req.body;  

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    blog.comments.push({
      user: "user",  
      comment: comment,
    });
    await blog.save();
    res.redirect(`/blogs/${id}/comments`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

 // Search for blogs containing the query in title or content
const searchBlogs = async (req, res) => {
  try {
    const query = req.query.query || req.query.q;  
    if (!query) {
      return res.redirect('/blogs'); 
    }

    const results = await Blog.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },  // case-insensitive search
        { content: { $regex: query, $options: 'i' } },
         { tags: { $regex: query, $options: 'i' } }
      ]
    });

    res.render('searchResults', { blogs: results, query }); 
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};




module.exports = {
  getBlogs,
  renderCreateForm,
  createBlog,
  renderEditForm,
  updateBlog,
  deleteBlog,
  likeBlog,
  getComments,
  addComment,
  searchBlogs
};