import { app } from "../server";
import jwt from "jsonwebtoken";

const USERNAME = process.env.USERNAME!;
const PIN = +process.env.PIN!;
const SECRET = process.env.SECRET!;

app.post("/api/auth", async (req, res, next) => {
	const { username, pin } = req.body;

	if (username === USERNAME && pin === PIN) {
		const token = jwt.sign(":)", SECRET);
		res.json({ token: token });
	} else {
		res.sendStatus(401);
	}
});
