import asyncHandler from "express-async-handler";

export const isOwner = asyncHandler(async (req, res, next) => {
  const user = req.user; // User from token
  const { id: targetUserId } = req.params; // User being modified

  console.info(`User: ${user._id}\nTarget User ID: ${targetUserId}`);

  // Admins can modify anyone
  if (user.role === "admin") {
    return next();
  }

  // If the user is not an admin, they can only modify their own account
  if (user._id !== targetUserId) {
    return res.status(403).json({
      message: "Forbidden: You can only access/modify your own account.",
    });
  }

  next();
});
