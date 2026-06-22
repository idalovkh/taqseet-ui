import { Modal } from '../Modal/Modal'
import { Button } from '../Button/Button'
import './ConfirmDialog.css'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText: string
  cancelText?: string
  confirmVariant?: 'primary' | 'secondary' | 'danger'
  variant?: 'primary' | 'secondary' | 'danger' // Alias for confirmVariant
  onConfirm: () => void
  onCancel?: () => void
  onClose?: () => void // Alias for onCancel
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText = 'Отмена',
  confirmVariant,
  variant,
  onConfirm,
  onCancel,
  onClose,
}) => {
  const handleClose = onClose || onCancel || (() => {})
  const buttonVariant = confirmVariant || variant || 'primary'

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="small" mobileMode="centered">
      <div className="confirm-dialog">
        <div className="confirm-dialog-message">
          {message.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <div className="confirm-dialog-actions">
          <Button variant="secondary" onClick={handleClose}>
            {cancelText}
          </Button>
          <Button variant={buttonVariant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
