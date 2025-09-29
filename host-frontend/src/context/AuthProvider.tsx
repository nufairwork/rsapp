import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { ReactNode } from "react";
import type { User } from "./AuthContext";
interface Props {
	children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);

	// auto-load sesssion if already logged in
	useEffect(() => {
		(async () => {
			const meRes = await fetch("/portal/api/me", {
				credentials: "include",
			});
			if (meRes.ok) {
				const data: User = await meRes.json();
				setUser(data);
			}
		})();
	}, []);

	const login = useCallback(async (username: string, password: string) => {
		const res = await fetch("/portal/api/login", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({ username, password }),
			credentials: "include",
		});
		if (!res.ok) return false;

		//fetch who we are
		const me = await fetch("/portal/api/me", { credentials: "include" });
		if (me.ok) {
			const data: User = await me.json();
			setUser(data);
			return true;
		}
		return false;
	}, []);

	const logout = useCallback(async () => {
		await fetch("/portal/api/logout", {
			method: "POST",
			credentials: "include",
		});
		setUser(null);
	}, []);

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
