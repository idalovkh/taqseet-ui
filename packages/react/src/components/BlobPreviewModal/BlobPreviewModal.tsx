import { useEffect, useRef, useState } from 'react'
import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { downloadBlob } from '@/shared/utils/blobFile'
import './BlobPreviewModal.css'

export interface BlobPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  blob: Blob | null
  title?: string
  fileName?: string
}

export function BlobPreviewModal({
  isOpen,
  onClose,
  blob,
  title = 'Просмотр документа',
  fileName,
}: BlobPreviewModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !blob) {
      setObjectUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      return
    }

    const url = URL.createObjectURL(blob)
    setObjectUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [isOpen, blob])

  const handlePrint = () => {
    const win = iframeRef.current?.contentWindow
    if (!win) return
    win.focus()
    win.print()
  }

  const handleDownload = () => {
    if (!blob || !fileName) return
    downloadBlob(blob, fileName)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="large" fullScreenOnMobile>
      <div className="blob-preview-modal">
        {objectUrl ? (
          <iframe
            ref={iframeRef}
            className="blob-preview-modal__frame"
            src={objectUrl}
            title={title}
          />
        ) : null}
        <div className="blob-preview-modal__actions">
          {fileName ? (
            <Button type="button" variant="secondary" onClick={handleDownload}>
              Скачать
            </Button>
          ) : null}
          <Button type="button" variant="secondary" onClick={handlePrint}>
            Печать / PDF
          </Button>
          <Button type="button" variant="primary" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </Modal>
  )
}
