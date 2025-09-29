import { useEffect, useState } from "react";

// Define a TypeScript interface for Employee
interface Employee {
	id: number;
	name: string;
	department: string;
}

const API_URL = "/portal/api/hr/employees";

const HrDashboard = () => {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const [form, setForm] = useState<Employee>({
		id: 0,
		name: "",
		department: "",
	});
	const [editingId, setEditingId] = useState<number | null>(null);

	const loadEmployees = () => {
		setLoading(true);
		fetch(API_URL)
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
				return res.json();
			})
			.then((data: Employee[]) => {
				setEmployees(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
				setError("Failed to load employees");
				setLoading(false);
			});
	};
	useEffect(() => {
		loadEmployees();
	}, []);
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const method = editingId ? "PUT" : "POST";
		const url = editingId ? `${API_URL}/${editingId}` : API_URL;

		fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(
				editingId
					? form
					: { name: form.name, department: form.department }
			),
		})
			.then((res) => {
				if (!res.ok) throw new Error("Error saving");
				return res.json();
			})
			.then(() => {
				setForm({ id: 0, name: "", department: "" });
				setEditingId(null);
				loadEmployees();
			})
			.catch(() => alert("Error saving employee"));
	};
	const handleEdit = (emp: Employee) => {
		setEditingId(emp.id);
		setForm({ id: emp.id, name: emp.name, department: emp.department });
	};
	const handleDelete = (id: number) => {
		if (!window.confirm("Delete this employee?")) return;
		fetch(`${API_URL}/${id}`, { method: "DELETE" })
			.then((res) => {
				if (!res.ok) throw new Error("Error Deleting");
				loadEmployees();
			})
			.catch(() => alert("Error deleting employees"));
	};

	if (loading)
		return (
			<div className="flex justify-center items-center w-full min-h-screen bg-blue-600">
				<p className="p-4 text-white font-bold text-2xl">Loading...</p>
			</div>
		);
	if (error)
		return (
			<div className="flex justify-center items-center w-full min-h-screen bg-red-600">
				<p className="p-4 text-whtie font-bold text-2xl">{error}</p>
			</div>
		);
	return (
		<div className="max-w-[800px] m-auto mt-12">
			<h2 className="text-4xl font-bold text-blue-500 text-center mb-12">
				HR Dashboard
			</h2>
			{employees.length === 0 && (
				<p className="text-3xl text-red-600 text-center">
					No employees found
				</p>
			)}

			{employees.length > 0 && (
				<div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-6">
					<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" className="px-6 py-3">
									Name
								</th>
								<th scope="col" className="px-6 py-3">
									Department
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-right"
								>
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{employees.map((emp) => (
								<tr
									key={emp.id}
									className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
								>
									<th
										scope="row"
										className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
									>
										{emp.name}
									</th>
									<td className="px-6 py-4">
										{emp.department}
									</td>
									<td className="px-6 py-4 text-right space-x-3">
										<button
											onClick={() => handleEdit(emp)}
											className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
										>
											Edit
										</button>
										<button
											onClick={() => handleDelete(emp.id)}
											className="font-medium text-red-600 dark:text-red-500 hover:underline"
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			<div className="flex flex-col justify-center items-center w-full gap-4 mt-10">
				<h3 className="text-2xl text-center font-semibold text-gray-800 mb-8">
					{editingId ? "Update Employee" : "Add New Employee"}
				</h3>
				<form onSubmit={handleSubmit} className="space-y-8 w-full">
					<div>
						<label className="block text-lg font-medium text-gray-700">
							Name
						</label>
						<input
							type="text"
							value={form.name}
							onChange={(e) =>
								setForm({ ...form, name: e.target.value })
							}
							required
							className="mt-4 px-6 py-3 block w-full border-gray-300 rounded-2xl shadow-sm   text-lg"
						/>
					</div>
					<div>
						<label className="block text-lg font-medium text-gray-700">
							Department
						</label>
						<input
							type="text"
							value={form.department}
							onChange={(e) =>
								setForm({ ...form, department: e.target.value })
							}
							required
							className="mt-4 block px-6 py-3  w-full border-gray-300 rounded-2xl shadow-sm   text-lg"
						/>
					</div>
					<div className="flex space-x-4 mt-14">
						<button
							type="submit"
							className="px-6 py-4 bg-blue-600 w-full text-white text-lg font-bold rounded-4xl hover:bg-blue-700"
						>
							{editingId ? "Update" : "Add"}
						</button>
						{editingId && (
							<button
								type="button"
								onClick={() => {
									setEditingId(null);
									setForm({
										id: 0,
										name: "",
										department: "",
									});
								}}
								className="px-6 py-4 w-full bg-gray-700 text-white text-lg font-bold rounded-4xl hover:bg-gray-700"
							>
								Cancel
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
};

export default HrDashboard;
