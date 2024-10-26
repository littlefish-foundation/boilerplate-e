'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string;
  walletAddress: string;
  roles: string[];
  createdAt: Date;
  // Add other fields as needed
}

async function deleteUser(userId: string) {
    try {
        const response = await fetch("/api/users", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: userId }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete user");
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export default function DeleteUserButton({ user }: { user: User }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete user ${user.walletAddress}?`)) {
            setIsDeleting(true);
            const success = await deleteUser(user.id);
            if (success) {
                alert(`User ${user.walletAddress} deleted successfully`);
                router.push('/'); // Redirect to home page or refresh the current page
            } else {
                alert(`Failed to delete user ${user.walletAddress}`);
            }
            setIsDeleting(false);
        }
    }

    return (
        <div>
            <p>Wallet Address: {user.walletAddress}</p>
            <p>Roles: {user.roles.join(", ")}</p>
            <p>Created At: {new Date(user.createdAt).toLocaleString()}</p>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            >
                {isDeleting ? 'Deleting...' : 'Delete User'}
            </button>
        </div>
    )
}