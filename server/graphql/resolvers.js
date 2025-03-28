// Third-party dependencies
const jwt = require("jsonwebtoken");

// Models
const User = require("../models/user");
const Post = require("../models/post");

// Utils
const { AppError } = require("../utils/error");
const { HTTP_STATUS, APP_ERRORS, PAGINATION } = require("../utils/constants");
const {
  validateEmail,
  validatePassword,
  validatePostInput,
  clearImage,
} = require("../utils/helpers");

module.exports = {
  login: async ({ email, password }) => {
    validateEmail(email);
    validatePassword(password);

    const user = await User.findOne({ email });
    if (!user)
      throw new AppError(APP_ERRORS.USER.NOT_FOUND, HTTP_STATUS.UNAUTHORIZED);

    const valid = await user.comparePassword(password);
    if (!valid)
      throw new AppError(
        APP_ERRORS.USER.INCORRECT_PASSWORD,
        HTTP_STATUS.UNAUTHORIZED
      );

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token: token, userId: user._id.toString() };
  },

  posts: async (
    { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.ITEMS_PER_PAGE },
    { isAuth }
  ) => {
    if (!isAuth)
      throw new AppError(APP_ERRORS.UNAUTHENTICATED, HTTP_STATUS.UNAUTHORIZED);

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("creator"),
      Post.countDocuments(),
    ]);

    return {
      posts: posts.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        };
      }),
      totalPosts: total,
      hasNext: skip + limit < total,
    };
  },

  post: async ({ id }, { isAuth }) => {
    if (!isAuth)
      throw new AppError(APP_ERRORS.UNAUTHENTICATED, HTTP_STATUS.UNAUTHORIZED);
    const post = await Post.findById(id).populate("creator");
    if (!post)
      throw new AppError(APP_ERRORS.POST.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },

  user: async (_, { isAuth, userId }) => {
    if (!isAuth)
      throw new AppError(APP_ERRORS.UNAUTHENTICATED, HTTP_STATUS.UNAUTHORIZED);
    const user = await User.findById(userId);
    if (!user)
      throw new AppError(APP_ERRORS.USER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return { ...user._doc, _id: user._id.toString() };
  },

  createUser: async ({ userInput }) => {
    validateEmail(userInput.email);
    validatePassword(userInput.password);

    const exists = await User.exists({ email: userInput.email });
    if (exists)
      throw new AppError(APP_ERRORS.USER.EXISTS, HTTP_STATUS.CONFLICT);

    const user = await User.create(userInput);
    return { ...user._doc, _id: user._id.toString() };
  },

  createPost: async ({ postInput }, { isAuth, userId }) => {
    if (!isAuth)
      throw new AppError(APP_ERRORS.UNAUTHENTICATED, HTTP_STATUS.UNAUTHORIZED);
    validatePostInput(postInput);

    const user = await User.findById(userId);
    if (!user)
      throw new AppError(APP_ERRORS.USER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);

    const post = await Post.create({ ...postInput, creator: user });
    user.posts.push(post);
    await user.save();
    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },

  updatePost: async ({ id, postInput }, { isAuth, userId }) => {
    if (!isAuth)
      throw new AppError(APP_ERRORS.UNAUTHENTICATED, HTTP_STATUS.UNAUTHORIZED);
    validatePostInput(postInput);

    const post = await Post.findById(id).populate("creator");
    if (!post) {
      throw new AppError(APP_ERRORS.POST.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    if (post.creator._id.toString() !== userId.toString()) {
      throw new AppError(APP_ERRORS.USER.NOT_AUTHORIZED, HTTP_STATUS.FORBIDDEN);
    }

    post.title = postInput.title;
    post.content = postInput.content;
    if (postInput.imageUrl !== "undefined") {
      post.imageUrl = postInput.imageUrl;
    }
    const updatedPost = await post.save();
    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString(),
    };
  },

  deletePost: async ({ id }, { isAuth, userId }) => {
    if (!isAuth)
      throw new AppError(APP_ERRORS.UNAUTHENTICATED, HTTP_STATUS.UNAUTHORIZED);

    const post = await Post.findById(id);
    if (!post) {
      throw new AppError(APP_ERRORS.POST.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    if (post.creator.toString() !== userId.toString()) {
      throw new AppError(APP_ERRORS.USER.NOT_AUTHORIZED, HTTP_STATUS.FORBIDDEN);
    }
    await clearImage(post.imageUrl);
    await Post.findByIdAndDelete(id);
    const user = await User.findById(userId);
    user.posts.pull(id);
    await user.save();
    return true;
  },

  updateStatus: async ({ status }, { isAuth, userId }) => {
    if (!isAuth)
      throw new AppError(APP_ERRORS.UNAUTHENTICATED, HTTP_STATUS.UNAUTHORIZED);

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(APP_ERRORS.USER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    user.status = status;
    await user.save();
    return { ...user._doc, _id: user._id.toString() };
  },
};
