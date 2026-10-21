import { FileUp } from 'lucide-react'
import { useRef } from 'react'

interface FileDropZoneProps {
  accept: string
  label: string
  onFileSelected: (file: File) => void
}

export function FileDropZone({ accept, label, onFileSelected }: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <button
      type="button"
      className="glass-card w-full border border-dashed border-sky-400/50 px-4 py-10 text-center transition hover:border-sky-300 hover:bg-slate-900/50"
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        const droppedFile = event.dataTransfer.files.item(0)
        if (droppedFile) {
          onFileSelected(droppedFile)
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.item(0)
          if (selected) {
            onFileSelected(selected)
          }
        }}
      />
      <FileUp className="mx-auto mb-3 h-8 w-8 text-sky-300" />
      <p className="text-sm text-slate-200">{label}</p>
    </button>
  )
}
