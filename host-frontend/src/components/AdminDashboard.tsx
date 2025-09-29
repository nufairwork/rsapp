import React from "react";
import { useState, Suspense } from "react";

const HrDashboard = React.lazy(() => import("hrApp/HrDashboard"));
const InventoryDashboard = React.lazy(
	() => import("inventoryApp/InventoryDashboard")
);
const AdminDashboard = () => {
	const [active, setActive] = useState("hr"); // which view is active?

	return (
		<div>
			<nav className="flex gap-4 p-4 bg-gray-300 border border-gray-400 rounded-4xl text-white">
				<button
					className={`px-4 py-3 border rounded-2xl cursor-pointer ${
						active === "hr"
							? "bg-[#007bff] border-[#007bff]"
							: "bg-gray-600 border-gray-600"
					}`}
					onClick={() => setActive("hr")}
				>
					HR Dashboard
				</button>
				<button
					className={`px-4 py-3 border rounded-2xl cursor-pointer ${
						active === "inventory"
							? "bg-[#007bff] border-[#007bff]"
							: "bg-gray-600 border-gray-600"
					}`}
					onClick={() => setActive("inventory")}
				>
					Inventory Dashboard
				</button>
			</nav>
			<h1 className=" font-bold text-4xl my-10">Admin Shell</h1>
			<div className="mt-10">
				{active === "hr" && (
					<Suspense fallback={<div>Loading...</div>}>
						<HrDashboard />
					</Suspense>
				)}
				{active === "inventory" && (
					<Suspense fallback={<div>Loading...</div>}>
						<InventoryDashboard />
					</Suspense>
				)}
			</div>
		</div>
	);
};

export default AdminDashboard;
