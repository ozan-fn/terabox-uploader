import axios from "axios";
import cookies from "../cookies/terabox.json";
import qs from "qs";
import FormData from "form-data";
import fs from "fs";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const cookie = cookies.map((v) => `${v.name}=${v.value}`).join("; ");

async function list(path: string = "/") {
	const req0 = await axios("https://www.terabox.com/main", { headers: { cookie: cookie } });
	const jsToken = decodeURIComponent((req0.data as string).match(/"jsToken":"(.*?)"/)?.[1]!).match(/"(.*?)"/)?.[1];

	const res = await axios("https://www.terabox.com/api/list", {
		params: {
			app_id: 250528,
			web: 1,
			channel: "dubox",
			clienttype: 0,
			jsToken: jsToken,
			order: "name",
			desc: 0,
			dir: path,
			num: 100,
			page: 1,
			showempty: 0,
		},
		headers: {
			Accept: "application/json, text/plain, */*",
			"Accept-Language": "en-US,en;q=0.9,id;q=0.8",
			Connection: "keep-alive",
			"Content-Type": "application/x-www-form-urlencoded",
			Cookie: cookie,
			Referer: "https://www.terabox.com/main?category=all",
			"Sec-Fetch-Dest": "empty",
			"Sec-Fetch-Mode": "cors",
			"Sec-Fetch-Site": "same-origin",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
			"X-Requested-With": "XMLHttpRequest",
			"sec-ch-ua": '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99"',
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": '"Windows"',
		},
	});

	return res.data;
}

async function upload(path: string = "/", buffer: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>, io?: Server) {
	const req0 = await axios("https://www.terabox.com/main", { headers: { cookie: cookie } });
	const jsToken = decodeURIComponent((req0.data as string).match(/"jsToken":"(.*?)"/)?.[1]!).match(/"(.*?)"/)?.[1];
	const id = uuidv4();
	const fileName = path.split("/")[path.split("/").length - 1];

	const req1 = await axios("https://www.terabox.com/api/precreate", {
		method: "post",
		params: {
			app_id: "250528",
			web: "1",
			channel: "dubox",
			clienttype: "0",
			jsToken: jsToken,
		},
		headers: {
			Accept: "application/json, text/plain, */*",
			"Accept-Language": "en-US,en;q=0.9,id;q=0.8",
			Connection: "keep-alive",
			"Content-Type": "application/x-www-form-urlencoded",
			Cookie: "csrfToken=hghng4NF9999756UFeyMSBmX; browserid=NdDg4pMyTllTl2ETJ3Bp4NmxEzOSMMh3oXh5vXM36tn_EXiubts8FHOxbJE=; __bid_n=18d07f83ede1bb246c4207; __stripe_mid=121f5556-fce9-4c12-a0f4-a022f6685d91d6a5af; lang=en; PANWEB=1; TSID=KSADeW5bLEKsjVU19rMXDZeAjAfaax4g; ndus=YTwUjKEteHuibMt_zgKLHMvgvvmoQWp4CyqCVdCa; ndut_fmt=E00450CFE05B00E00E44FE91AD4A8BA025ED5A414E80D0B945E7E614DA15B240",
			Origin: "https://www.terabox.com",
			Referer: "https://www.terabox.com/main?category=all&path=%2F",
			"Sec-Fetch-Dest": "empty",
			"Sec-Fetch-Mode": "cors",
			"Sec-Fetch-Site": "same-origin",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
			"X-Requested-With": "XMLHttpRequest",
			"sec-ch-ua": '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99"',
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": '"Windows"',
		},
		data: qs.stringify({
			path: path,
			autoinit: "1",
			block_list: '["5910a591dd8fc18c32a8f3df4fdc1761"]',
			local_mtime: "1713831796",
		}),
	});

	const form = new FormData();
	form.append("file", buffer, { filename: "blob" });

	const req2 = await axios("https://c-jp.terabox.com/rest/2.0/pcs/superfile2", {
		method: "post",
		params: {
			method: "upload",
			app_id: "250528",
			channel: "dubox",
			clienttype: "0",
			web: "1",
			logid: "MTcxNDIxMzIyMjgyMDAuMDUwMDkxNDg4OTI1MDk5MTg=",
			path: req1.data.path,
			uploadid: req1.data.uploadid,
			uploadsign: "0",
			partseq: "0",
		},
		headers: {
			Accept: "*/*",
			"Accept-Language": "en-US,en;q=0.9,id;q=0.8",
			Connection: "keep-alive",
			Cookie: cookie,
			Origin: "https://www.terabox.com",
			Referer: "https://www.terabox.com/",
			"Sec-Fetch-Dest": "empty",
			"Sec-Fetch-Mode": "cors",
			"Sec-Fetch-Site": "same-site",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
			"sec-ch-ua": '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99"',
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": '"Windows"',
			...form.getHeaders(),
		},
		data: form,
		onUploadProgress(progressEvent) {
			if (io) io.send({ id: id, fileName, ...progressEvent });
		},
	});

	const req3 = await axios("https://www.terabox.com/api/create", {
		method: "post",
		params: {
			isdir: "0",
			rtype: "1",
			bdstoken: "d19ceff098763ab16de685c4a8dc0eea",
			app_id: "250528",
			web: "1",
			channel: "dubox",
			clienttype: "0",
			jsToken: jsToken,
		},
		headers: {
			Accept: "application/json, text/plain, */*",
			"Accept-Language": "en-US,en;q=0.9,id;q=0.8",
			Connection: "keep-alive",
			"Content-Type": "application/x-www-form-urlencoded",
			Cookie: cookie,
			Origin: "https://www.terabox.com",
			Referer: "https://www.terabox.com/main?category=all&path=%2Fasd",
			"Sec-Fetch-Dest": "empty",
			"Sec-Fetch-Mode": "cors",
			"Sec-Fetch-Site": "same-origin",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
			"X-Requested-With": "XMLHttpRequest",
			"sec-ch-ua": '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99"',
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": '"Windows"',
		},
		data: qs.stringify({
			path: req1.data.path,
			size: Buffer.from(buffer).byteLength,
			uploadid: req2.data.uploadid,
			block_list: `["${req2.data.md5}"]`,
		}),
	});

	return req3.data;
}

const terabox = {
	list: list,
	upload: upload,
};

export default terabox;
