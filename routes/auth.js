const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");

const jwt = require("jsonwebtoken");
const {
	authenticateJWT,
	ensureLoggedIn,
	ensureCorrectUser,
} = require("../middleware/auth");
const User = require("../models/user");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post("/login", async (req, res, next) => {
	try {
		const { username, password } = req.body;
		if (!username || !password)
			throw new ExpressError("Username and password required", 400);
		User.authenticate(username, password);
		User.updateLoginTimestamp(username);

		return res.json({ message: "Logged in!" });
	} catch (e) {
		return next(e);
	}
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post("/register", async (req, res, next) => {
	try {
		const { username, password, first_name, last_name, phone } = req.body;
		if (!username || !password || !first_name || !last_name || !phone)
			throw new ExpressError("Missing data requirements", 400);

		const user = await User.register(
			username,
			password,
			first_name,
			last_name,
			phone
		);

		return res.json(user);
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
