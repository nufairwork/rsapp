import { createRoot } from "react-dom/client";
import App from "./App";

// augment the Window interface so TS knows about our custom flag
declare global {
	interface Window {
		__HR_REMOTE__?: boolean;
	}
}

// let host app call this function and supply its own DOM element
export function mount(el?: HTMLElement | null) {
	// choose container: passed in, existing hr-root, or create new div
	const container =
		el ??
		document.getElementById("inventory-root") ??
		document.createElement("div");

	if (!container.id) container.id = "inventory-root";

	// if it’s a new element, append to body
	if (!document.getElementById(container.id))
		document.body.appendChild(container);

	// render App inside container
	const root = createRoot(container);
	root.render(<App />);
}

// if standalone dev, auto-mount into #root
if (!window.__HR_REMOTE__ && document.getElementById("root")) {
	mount(document.getElementById("root"));
}
