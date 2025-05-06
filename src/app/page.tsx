'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Home() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('Fetching from API...')
    axios
      .get('https://explorerbe.pwrlabs.io/explorerInfo/')
      .then(response => {
        console.log('API response:', response.data)
        setData(response.data)
      })
      .catch(err => {
        console.error('API error:', err)
        setError(err.message)
      })
  }, [])

  return (
    <div className="min-h-screen p-8 text-sm font-mono whitespace-pre-wrap">
      <h1 className="text-lg font-bold mb-4">Explorer Info</h1>
      {error && <p className="text-red-500">Error: {error}</p>}
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}
