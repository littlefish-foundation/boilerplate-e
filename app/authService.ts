interface User {
  id: string;
  email?: string;
  name?: string;
  walletAddress?: string;
  walletNetwork?: number;
}

export function logout() {
    // Remove the token from localStorage
    localStorage.removeItem('token');
}

// Function to get user details
export async function getUserDetails(): Promise<User> {
  const token = localStorage.getItem("Authorization");
  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch("/api/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user details");
  }

  return await response.json();
}
