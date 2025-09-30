// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [
		react(),
		federation({
			name: "host",
			remotes: {
				hrApp: "./hrApp/remoteEntry.js",
				inventoryApp: "./inventoryApp/remoteEntry.js",
			},
			shared: ["react", "react-dom"],
		}),
		tailwindcss(),
	],
	build: {
		target: "esnext",
		assetsDir: "",
	},
	server: {
		port: 5173,
		cors: true,
	},
	base: "/portal/", // if your WAR is deployed as /portal
});
