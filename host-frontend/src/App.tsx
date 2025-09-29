import * as React from "react";
import "./App.css";
import { useAuth } from "./context/AuthContext";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginForm";
import AdminDashboard from "./components/AdminDashboard";

const HrDashboard = React.lazy(() => import("hrApp/HrDashboard"));
const InventoryDashboard = React.lazy(
	() => import("inventoryApp/InventoryDashboard")
);

const ProtectedRoute: React.FC<{
	allowedRoles: string[];
	element: React.ReactElement;
}> = ({ allowedRoles, element }) => {
	const { user } = useAuth();
	if (!user) return <Navigate to={"/login"} replace />;
	if (!allowedRoles.some((role) => user?.roles.includes(role))) {
		return (
			<div className="min-h-screen w-full flex justify-center items-center">
				<p className="text-red-500 text-center mt-10 text-2xl font-bold">
					Access Denied
				</p>
			</div>
		);
	}
	return element;
};

function App() {
	return (
		// When you set the basename prop on BrowserRouter, all subsequent route paths defined within your application (e.g., using <Link to="/about"> or <Route path="/dashboard">) will automatically be prefixed with this basename when constructing the actual URLs.
		<BrowserRouter basename="/portal">
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route
					path="/hr"
					element={
						<ProtectedRoute
							allowedRoles={["ROLE_HR"]}
							element={
								<React.Suspense
									fallback={<div>Loading HR Dashboard…</div>}
								>
									<HrDashboard />
								</React.Suspense>
							}
						/>
					}
				/>
				<Route
					path="/inventory"
					element={
						<ProtectedRoute
							allowedRoles={["ROLE_INVENTORY"]}
							element={
								<React.Suspense
									fallback={
										<div>Loading Inventory Dashboard…</div>
									}
								>
									<InventoryDashboard />
								</React.Suspense>
							}
						/>
					}
				/>
				<Route
					path="/admin"
					element={
						<ProtectedRoute
							allowedRoles={["ROLE_ADMIN"]}
							element={<AdminDashboard />}
						/>
					}
				/>
				<Route path="/" element={<LoginPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
