/**
 * v0 by Vercel.
 * @see https://v0.dev/t/SzicctxPeO8
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
'use client'

import { Button } from '@/components/ui/button'
import { ButtonLoading } from '@/components/ui/button-loading'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState } from 'react'
import { UploadProgress } from './upload-progress'

// Define the correct type for runData
interface RunData {
  id: string
  publicAccessToken: string
}

export default function UploadBooks({ userId }: { userId: number }) {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [runData, setRunData] = useState<RunData | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0])
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0])
      setFile(e.dataTransfer.files[0])
  }

  function handleDragOver(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!file) return
    setIsLoading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId.toString())

    try {
      const res = await fetch('/api/books/goodreads', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error?.error || 'Unknown error')
      }
      const data = await res.json()
      setIsLoading(false)
      console.log('Trigger response:', data)
      console.log('Run data:', data.id, data.publicAccessToken)
      setRunData(data)
    } catch (err) {
      console.error('Trigger error:', err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload a File</CardTitle>
        <CardDescription>
          Select a file to upload and click the submit button.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="grid gap-4"
          encType="multipart/form-data"
        >
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadIcon className="w-10 h-10 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <input type="hidden" name="userId" value={userId} />
            </label>
          </div>
          {file && (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              {isLoading ? (
                <ButtonLoading />
              ) : (
                <Button type="submit">Upload</Button>
              )}
            </div>
          )}
        </form>
        {runData && (
          <UploadProgress
            runId={runData.id}
            publicAccessToken={runData.publicAccessToken}
          />
        )}
      </CardContent>
    </Card>
  )
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}
