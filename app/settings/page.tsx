"use client";

import { useState, useEffect } from "react";

interface Policy {
    id: string;
    policyID: string;
    createdAt: string;
    updatedAt: string;
}

interface User {
    id: string;
    email: string;
    walletAddress: string;
    walletNetwork: number;
    createdAt: string;
    updatedAt: string;
    verifiedPolicy: string;
}

export default function SettingsPage() {
    const [policy, setPolicy] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [strictPolicy, setStrictPolicy] = useState<boolean>(false);

    async function getUsers() {
        const response = await fetch("/api/users");
        const data: User[] = await response.json();
        return data;
    }

    async function deleteUser(userId: string) {
        const response = await fetch("/api/users", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: userId }),
        });

        if (response.ok) {
            setMessage("User deleted successfully.");
            fetchUsers(); // Update the users list after deletion
        } else {
            const errorData = await response.json();
            setMessage(errorData.error || "Failed to delete user.");
        }
    }

    async function addAdmin(userId: string) {
        const response = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: userId }),
        });

        if (response.ok) {
            setMessage("User role updated successfully.");
            fetchUsers(); // Update the users list after role update
        } else {
            const errorData = await response.json();
            setMessage(errorData.error || "Failed to update user role.");
        }
    }

    async function SettingGet() {
        try {
            const response = await fetch("/api/setting");
            if (response.status !== 200) {
                throw new Error("Failed to fetch settings");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching settings:", error);
            return { strictPolicy: false }; // Return default settings
        }
    }

    async function SettingUpdate(strictPolicy: boolean) {
        const response = await fetch("/api/setting", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ strictPolicy }),
        });
        const data = await response.json();
        if (response.ok) {
            setMessage("Setting updated successfully.");
        } else {
            setMessage(data.error || "Failed to update setting.");
        }
    }

    async function PolicyRegister(policyID: string) {
        const response = await fetch("/api/policy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ policyID }),
        });

        const data = await response.json();
        if (response.ok) {
            setMessage("Policy registered successfully.");
            fetchPolicies(); // Update the policy list after registration
        } else {
            setMessage(data.error || "Failed to register policy.");
        }
    }

    async function PolicyList() {
        const response = await fetch("/api/policy");
        const data: Policy[] = await response.json();
        return data;
    }

    const fetchPolicies = async () => {
        const data = await PolicyList();
        setPolicies(data);
    };

    const fetchUsers = async () => {
        const data = await getUsers();
        setUsers(data);
    };

    useEffect(() => {
        fetchPolicies();
        fetchUsers();
        SettingGet().then((data) => {
            setStrictPolicy(data.strictPolicy);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await PolicyRegister(policy);
    };

    const handleCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStrictPolicy = e.target.checked;
        setStrictPolicy(newStrictPolicy);
        await SettingUpdate(newStrictPolicy);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="strictPolicy">
                    Strict Policy
                </label>
                <input
                    type="checkbox"
                    id="strictPolicy"
                    className="mr-2 leading-tight"
                    checked={strictPolicy}
                    onChange={handleCheckboxChange}
                />
            </div>
            {message && <p className="text-red-500 text-xs italic mb-4">{message}</p>}
            <h1 className="text-2xl font-bold mb-4">Register New Policy</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-lg">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="policyID">
                        Policy ID
                    </label>
                    <input
                        type="text"
                        id="policyID"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={policy || ""}
                        onChange={(e) => setPolicy(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Register
                    </button>
                </div>
            </form>
            <h2 className="text-xl font-bold mt-8">Policies List</h2>
            <ul>
                {policies.length > 0 ? (
                    policies.map((policy) => (
                        <li key={policy.id} className="border-b border-gray-200 py-2">
                            <p><strong>Policy ID:</strong> {policy.policyID}</p>
                            <p><strong>Created At:</strong> {new Date(policy.createdAt).toLocaleString()}</p>
                            <p><strong>Updated At:</strong> {new Date(policy.updatedAt).toLocaleString()}</p>
                        </li>
                    ))
                ) : (
                    <li>No policies found</li>
                )}
            </ul>
            <h2 className="text-xl font-bold mt-8">Users List</h2>
            <ul>
                {users.length > 0 ? (
                    users.map((user) => {
                        return (
                            <li key={user.id} className="border-b border-gray-200 py-2">
                                {user.email && <p><strong>Email:</strong> {user.email}</p>}
                                {user.walletAddress && <><p><strong>Wallet Address:</strong> {user.walletAddress}</p>
                                    <p><strong>Wallet Network:</strong> {user.walletNetwork}</p>
                                    <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                                    <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p></>}
                                <p><strong>Role:</strong> {user.verifiedPolicy}</p>
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Delete
                                </button>
                                {user.verifiedPolicy === "admin" ? (<button
                                    onClick={() => addAdmin(user.id)}
                                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Remove Admin Role
                                </button>) : (
                                    <button
                                        onClick={() => addAdmin(user.id)}
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Give Admin Role
                                    </button>
                                )}

                            </li>
                        );
                    })
                ) : (
                    <li>No users found</li>
                )}
            </ul>
        </div>
    );
}
