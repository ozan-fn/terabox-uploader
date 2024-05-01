import fs from "fs";
import path from "path";
import { httpServer } from "./server";
import { config } from "dotenv";
config();

async function main() {
	const routes = fs.readdirSync(path.join(__dirname, "./routes"));
	await Promise.all(routes.map((v) => require(`./routes/${v}`)));
	httpServer.listen(3000);
	console.log("server started!");
}
main();
