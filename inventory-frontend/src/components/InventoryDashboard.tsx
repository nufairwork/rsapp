import { useEffect, useState } from "react";

// Define a TypeScript interface for InventoryItem
interface Item {
	id: number;
	name: string;
	quantity: number;
}

const API_URL = "/portal/api/inventory/items";

const InventoryDashboard = () => {
	const [items, setItems] = useState<Item[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const [form, setForm] = useState<Item>({
		id: 0,
		name: "",
		quantity: 0,
	});
	const [editingId, setEditingId] = useState<number | null>(null);

	const loadItems = () => {
		setLoading(true);
		fetch(API_URL)
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
				return res.json();
			})
			.then((data: Item[]) => {
				setItems(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
				setError("Failed to load Items");
				setLoading(false);
			});
	};
	useEffect(() => {
		loadItems();
	}, []);
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const method = editingId ? "PUT" : "POST";
		const url = editingId ? `${API_URL}/${editingId}` : API_URL;

		fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(
				editingId ? form : { name: form.name, quantity: form.quantity }
			),
		})
			.then((res) => {
				if (!res.ok) throw new Error("Error saving");
				return res.json();
			})
			.then(() => {
				setForm({ id: 0, name: "", quantity: 0 });
				setEditingId(null);
				loadItems();
			})
			.catch(() => alert("Error saving Item"));
	};
	const handleEdit = (emp: Item) => {
		setEditingId(emp.id);
		setForm({ id: emp.id, name: emp.name, quantity: emp.quantity });
	};
	const handleDelete = (id: number) => {
		if (!window.confirm("Delete this Item?")) return;
		fetch(`${API_URL}/${id}`, { method: "DELETE" })
			.then((res) => {
				if (!res.ok) throw new Error("Error Deleting");
				loadItems();
			})
			.catch(() => alert("Error deleting Items"));
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
				Inventory Dashboard
			</h2>
			{items.length === 0 && (
				<p className="text-3xl text-red-600 text-center">
					No Items found
				</p>
			)}

			{items.length > 0 && (
				<div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-6">
					<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" className="px-6 py-3">
									Name
								</th>
								<th scope="col" className="px-6 py-3">
									quantity
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
							{items.map((itm) => (
								<tr
									key={itm.id}
									className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
								>
									<th
										scope="row"
										className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
									>
										{itm.name}
									</th>
									<td className="px-6 py-4">
										{itm.quantity}
									</td>
									<td className="px-6 py-4 text-right space-x-3">
										<button
											onClick={() => handleEdit(itm)}
											className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
										>
											Edit
										</button>
										<button
											onClick={() => handleDelete(itm.id)}
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
					{editingId ? "Update Item" : "Add New Item"}
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
							quantity
						</label>
						<input
							type="number"
							value={form.quantity}
							onChange={(e) =>
								setForm({ ...form, quantity: +e.target.value })
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
										quantity: 0,
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

	// useEffect(() => {
	// 	// Fetch inventory items from the API
	// 	fetch("/portal/api/inventory/items") // adjust base path if your WAR context is /portal
	// 		.then((response) => {
	// 			if (!response.ok) {
	// 				throw new Error(`HTTP error! status: ${response.status}`);
	// 			}
	// 			return response.json();
	// 		})
	// 		.then((data: InventoryItem[]) => {
	// 			setItems(data);
	// 			setLoading(false);
	// 		})
	// 		.catch((err) => {
	// 			console.error("Error fetching inventory:", err);
	// 			setError("Failed to load inventory items");
	// 			setLoading(false);
	// 		});
	// }, []);

	// if (loading) return <p>Loading inventory...</p>;
	// if (error) return <p>{error}</p>;

	// return (
	// 	<div>
	// 		<h2>Inventory Dashboard</h2>
	// 		{items.length === 0 ? (
	// 			<p>No items available</p>
	// 		) : (
	// 			<ul>
	// 				{items.map((item) => (
	// 					<li key={item.id}>
	// 						{item.name} - Quantity: {item.quantity}
	// 					</li>
	// 				))}
	// 			</ul>
	// 		)}
	// 	</div>
	// );
};

export default InventoryDashboard;
