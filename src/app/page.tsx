'use client'

import { useState } from 'react'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [imageURL, setImageURL] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')

  // File selection handler
  //new
  // DO801F2LAVFV32YQJ3WG
  // LpaLSnl4HcKobjtsy+2Tl9wmyH3Oi8sL7MNtIcIDrPM

  //old
  // DO00TH6WGBAHN67G7QMJ
  // 0ud3fioyrjwi6mXXFoyNdWDiIuY0/lv7B6SDB9AN9ak
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setFileName(selectedFile?.name || '')
  }

  // Upload the selected file to DigitalOcean Spaces
  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadError(null)

    const s3 = new S3Client({
      region: 'ams3',  // Correct region for Amsterdam
      endpoint: 'https://ams3.digitaloceanspaces.com',  // Correct endpoint without bucket name
      credentials: {
        accessKeyId: 'DO801F2LAVFV32YQJ3WG',  // Your access key
        secretAccessKey: 'LpaLSnl4HcKobjtsy+2Tl9wmyH3Oi8sL7MNtIcIDrPM',  // Your secret key
      },
    })

    try {
      const target = {
        Bucket: 'new-dev-community-bucket',  // Your bucket name
        Key: `images/one/${file.name}`,  // Path and file name inside the bucket
        Body: file,
        ContentType: file.type,  // Set Content-Type correctly here
        ACL: 'public-read' as const,  // Public-read ACL for public access
      }

      const upload = new Upload({
        client: s3,
        params: target,  // Pass the target params directly here
      })

      await upload.done()  // Upload the file to S3/Spaces

      alert('✅ Upload successful!')  // Notify the user of success
    } catch (error: any) {
      console.error('Upload error:', error)
      setUploadError(error.message)  // Set the error message for display
    } finally {
      setUploading(false)  // Stop the loading state
    }
  }

  // Fetch image from DigitalOcean Spaces
  const handleGetImage = () => {
    if (!fileName) {
      alert('Please enter a file name to retrieve.')
      return
    }

    // Construct the URL for the image in the bucket
    const url = `https://new-dev-community-bucket.ams3.digitaloceanspaces.com/images/one/${fileName}`
    console.log('Fetched image URL:', url)
    setImageURL(url)  // Set the URL to display the image
  }

  return (
    <div className="min-h-screen p-8 space-y-6 font-sans">
      <h1 className="text-xl font-bold">S3 Upload & Fetch Image (Testing Only)</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="border p-2"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!file || uploading}  // Disable button if no file or uploading in progress
      >
        {uploading ? 'Uploading...' : 'Upload to S3'}
      </button>

      {uploadError && <p className="text-red-600">Error: {uploadError}</p>}  {/* Display upload error */} 

      <div className="mt-6">
        <input
          type="text"
          placeholder="Enter file name to fetch (e.g., image.png)"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}  // Set file name to retrieve
          className="border p-2 mr-2"
        />
        <button
          onClick={handleGetImage}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Get Image
        </button>
      </div>

      {imageURL && (
        <div className="mt-4">
          <p className="font-semibold">Fetched Image:</p>
          <img src={imageURL} alt="From S3" className="mt-2 max-w-md" />
        </div>
      )}
    </div>
  )
}
