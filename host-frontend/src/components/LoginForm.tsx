import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const ok = await login(username, password);
		if (!ok) setError("Invalid credentials");
		else {
			// decide based on role:
			// fetch from context
			// can't directly use user becausee it updates after login,
			// after login, call /api/me again or navigate to a default
			// fetch user data
			const me = await fetch("/portal/api/me", {
				credentials: "include",
			}).then((r) => r.json());
			// redirect based on roles
			if (me.roles.includes("ROLE_HR")) {
				navigate("/hr");
			} else if (me.roles.includes("ROLE_INVENTORY")) {
				navigate("/inventory");
			} else if (me.roles.includes("ROLE_ADMIN")) {
				navigate("/admin");
			} else {
				// fallback
				navigate("/");
			}
		}
	};
	return (
		<form
			onSubmit={handleSubmit}
			className="max-w-lg mx-auto mt-10 gap-8 flex flex-col justify-center items-center"
		>
			<h1 className="text-2xl mb-8 font-bold text-center">Login</h1>
			{error && <p className="text-red-500 text-lg my-8">{error}</p>}
			<input
				type="text"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				placeholder="Username"
				className="shadow-md px-6 py-4 rounded-4xl text-lg w-full"
			/>
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
				className="shadow-md px-6 py-4 rounded-4xl text-lg w-full"
			/>
			<button className="mt-4 bg-blue-500 text-white font-bold text-xl px-6 py-4 rounded-4xl w-full">
				Login
			</button>
		</form>
	);
};

export default LoginPage;
