import { Router } from "express";
import passport from "passport";
import { generateAccessToken } from "../utils/GenerateToken.js";

const authRouter = Router();

authRouter.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/login" }),
	(req, res) => {
		const token = generateAccessToken(req.user);
		res.redirect(`http://localhost:3000/?token=${token}`);
	}
);

export default authRouter;
