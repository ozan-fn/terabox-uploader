import { auth } from "../middleware";
import { app } from "../server";

app.get("/", auth, (req, res) => {
	return res.send("asdasd");
});
