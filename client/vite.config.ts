import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api/terabox": "https://3000-ozan68255-untitled-9w9wkjq6ptc.ws-us110.gitpod.io",
		},
	},
});
