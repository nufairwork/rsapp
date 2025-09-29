import { createContext, useContext } from "react";

export interface User {
	uesrname: string;
	roles: string[];
}

export interface AuthContextType {
	user: User | null;
	login: (username: string, password: string) => Promise<boolean>;
	logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
	user: null,
	login: async () => false,
	logout: async () => {},
});

export function useAuth(): AuthContextType {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
	return ctx;
}
