const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

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

		const token = jwt.sign(username, SECRET_KEY);
		return res.json({ message: "Signed in!", _token: token });
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
