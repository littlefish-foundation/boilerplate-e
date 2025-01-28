"use server"
import TokenGatedDemoPage from './asset2page'

interface Policy {
  id: string;
  policyID: string;
  createdAt: string;
  updatedAt: string;
}

export default async function Page() {
  console.log("ananskm")

  const response = await fetch(`${process.env.ROOT_URL}/api/policy`);
  if (!response.ok) {
    throw new Error(`Failed to fetch policies: ${response.statusText}`);
  }
  console.log("emircik", response)
  const data: Policy[] = await response.json();
  console.log("emircik", data)
  const formattedData = data.map(policy => ({
    ...policy,
    createdAt: new Date(policy.createdAt),
    updatedAt: new Date(policy.updatedAt)
  }));

  return (
    <TokenGatedDemoPage policies={formattedData} />
  )
}
