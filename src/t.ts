import axios from "axios";
import cookies from "./cookies/terabox.json";

const cookie = cookies.map((v) => `${v.name}=${v.value}`).join("; ");

(async () => {
	const req0 = await axios("https://www.terabox.com/main", { headers: { cookie: cookie } });
	console.log(decodeURIComponent((req0.data as string).match(/"jsToken":"(.*?)"/)?.[1]!).match(/"(.*?)"/)?.[1]);
})();
