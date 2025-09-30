// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [
		react(),
		federation({
			name: "hrApp",
			filename: "remoteEntry.js",
			exposes: {
				"./HrDashboard": "./src/components/HrDashboard.tsx",
				"./HelloWorld": "./src/components/HelloWorld.tsx",
			},
			shared: ["react", "react-dom"],
		}),
		tailwindcss(),
	],
	build: {
		target: "esnext",
		assetsDir: "", // <-- this puts JS files in the root instead of /assets
		cssCodeSplit: false,
	},
	server: {
		port: 5001, // dev only
		cors: true, // dev only
	},
	base: "/portal/hrApp/", // IMPORTANT for Tomcat WAR deploy
});
