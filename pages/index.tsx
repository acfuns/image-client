import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import Image from 'next/image'

function UploadImage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isDisableRun, setIsDisableRun] = useState(false)
  const [isDisableRes, setIsDisableRes] = useState(false)
  const [isLoad, setIsLoad] = useState(false)

  useEffect(() => {
    if (selectedFiles.length > 1) {
      setIsDisableRun(true)
    }
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    files.map((file) => {
      const reader = new FileReader()
      reader.onload = async () => {
        const data = reader.result as ArrayBuffer
        const fileName = file.name
        await invoke('save_file', { fileData: Array.from(new Uint8Array(data)), fileName })
      }
      reader.readAsArrayBuffer(file)
    })
    setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...files])
  }

  const runProgram = async () => {
    setIsLoad(true)
    await invoke('run_bat')
    setIsLoad(false)
    setIsDisableRes(true)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-center">
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100"
        />
      </div>
      <div className="flex gap-6 overflow-x-auto snap-x">
        {selectedFiles.map((file) => (
          <div key={file.name} className="snap-center shrink-0">
            <img src={URL.createObjectURL(file)} alt={file.name} />
            <p>{file.name}</p>
          </div>
        ))}
      </div>
      {isDisableRun && (
        <button
          className="px-6 py-2 rounded inline-block bg-white text-[#363636] hover:text-white cursor-pointer hover:bg-[#363636] disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50 border border-black"
          onClick={() => runProgram()}
        >
          Run
        </button>
      )}
      {isLoad && (
        <div className="bg-blue-400 flex justify-center py-4">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      )}
      <div className="flex justify-center"> {isDisableRes && <Image alt="res" src={require('../src-tauri/APAP-Image-Stitching/images/demo1/results/out_00000.jpg')}></Image>}</div>
    </div>
  )
}

function Index() {
  return (
    <main className="mt-20 max-w-7xl mx-auto">
      <UploadImage></UploadImage>
    </main>
  )
}

export default Index
