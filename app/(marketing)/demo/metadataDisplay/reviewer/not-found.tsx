import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
      <p className="mb-4">You don't have permission to view this page.</p>
      <Link 
        href="/demo/metadataDisplay" 
        className="text-primary hover:underline"
      >
        Return to demo page
      </Link>
    </div>
  )
} 