"use server"
import TokenGatedDemoPage from './asset2page'

interface Policy {
  id: string;
  policyID: string;
  createdAt: string;
  updatedAt: string;
}

export default async function Page() {

  const response = await fetch(`${process.env.ROOT_URL}/api/policy`);
  if (!response.ok) {
    throw new Error(`Failed to fetch policies: ${response.statusText}`);
  }
  const data: Policy[] = await response.json();
  const formattedData = data.map(policy => ({
    ...policy,
    createdAt: new Date(policy.createdAt),
    updatedAt: new Date(policy.updatedAt)
  }));

  return (
    <TokenGatedDemoPage policies={formattedData} />
  )
}
