import axios from "axios";
import terabox from "../controllers/terabox";
import { app, io, upload } from "../server";
import { v4 as uuidv4 } from "uuid";

app.get("/api/terabox", async (req, res) => {
	try {
		res.json(await terabox.list());
	} catch (error) {
		res.sendStatus(500);
		console.error(error);
	}
});

app.post("/api/terabox", (req, res) => {
	upload.single("file")(req, res, async (err) => {
		try {
			if (err) return res.sendStatus(400);
			console.log(req.file);
			res.sendStatus(200);
		} catch (error) {
			res.sendStatus(500);
			console.error(error);
		}
	});
});

app.post("/api/terabox/remote", async (req, res) => {
	try {
		const { path, url } = req.body;
		if (!url) return res.sendStatus(400);
		if (!path) return res.sendStatus(400);
		res.sendStatus(200);
		const id = uuidv4();
		const fileName = path.split("/")[path.split("/").length - 1];

		const buffer = await axios(url, {
			responseType: "arraybuffer",
			onDownloadProgress(progressEvent) {
				io.send({ id: id, fileName, ...progressEvent });
			},
		});
		await terabox.upload(path, buffer.data, io);
	} catch (error) {
		// res.sendStatus(500);
		console.error(error);
	}
});
