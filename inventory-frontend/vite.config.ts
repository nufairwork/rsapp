import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		federation({
			name: "inventoryApp",
			filename: "remoteEntry.js",
			exposes: {
				// expose the mount function, not the App directly
				"./InventoryDashboard":
					"./src/components/InventoryDashboard.tsx",
			},
			shared: ["react", "react-dom"],
		}),
	],
	build: {
		target: "esnext",
		assetsDir: "", // <-- this puts JS files in the root instead of /assets
		outDir: "/home/nufair-subair/Downloads/RSApp/portal/src/main/resources/static/inventoryApp",
	},
	server: {
		port: 5002, // dev only
		cors: true,
	},
	base: "/portal/inventoryApp/", // IMPORTANT for Tomcat WAR deploy
});
