import toast from 'react-hot-toast'

// Types d'emojis pour différents types de notifications
const emojiMap = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
  like: '❤️',
  delete: '🗑️',
  edit: '✏️',
  add: '➕',
  save: '💾',
  upload: '📤',
  download: '📥',
}

// Animation CSS pour les emojis
const emojiAnimation = `
  @keyframes bounce {
    0%, 100% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.2) rotate(-5deg); }
    50% { transform: scale(1.3) rotate(5deg); }
    75% { transform: scale(1.2) rotate(-3deg); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .toast-emoji {
    display: inline-block;
    animation: bounce 0.6s ease-in-out;
    font-size: 1.2em;
    margin-right: 8px;
  }
  
  .toast-emoji-like {
    animation: pulse 0.8s ease-in-out infinite;
  }
  
  .toast-emoji-delete {
    animation: spin 0.5s ease-in-out;
  }
`

// Injecter les styles si pas déjà fait
if (typeof document !== 'undefined') {
  const styleId = 'toast-emoji-styles'
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = emojiAnimation
    document.head.appendChild(style)
  }
}

// Fonction helper pour créer un toast avec emoji
function createToastWithEmoji(
  type: keyof typeof emojiMap,
  message: string,
  options?: any
) {
  const emoji = emojiMap[type]
  const emojiClass = type === 'like' ? 'toast-emoji toast-emoji-like' : 
                     type === 'delete' ? 'toast-emoji toast-emoji-delete' : 
                     'toast-emoji'
  
  const content = (
    <span>
      <span className={emojiClass}>{emoji}</span>
      <span>{message}</span>
    </span>
  )

  const defaultOptions = {
    duration: type === 'error' ? 4000 : 3000,
    style: {
      borderRadius: '10px',
      background: type === 'error' ? '#fee' : type === 'success' ? '#efe' : '#fff',
      color: '#333',
      padding: '16px 20px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    ...options,
  }

  return toast(content, defaultOptions)
}

// Exports des fonctions de toast améliorées
export const toastSuccess = (message: string, options?: any) => {
  return createToastWithEmoji('success', message, options)
}

export const toastError = (message: string, options?: any) => {
  return createToastWithEmoji('error', message, options)
}

export const toastInfo = (message: string, options?: any) => {
  return createToastWithEmoji('info', message, options)
}

export const toastWarning = (message: string, options?: any) => {
  return createToastWithEmoji('warning', message, options)
}

export const toastLike = (message: string = 'Ajouté aux favoris !', options?: any) => {
  return createToastWithEmoji('like', message, {
    duration: 2000,
    ...options,
  })
}

export const toastDelete = (message: string = 'Supprimé avec succès !', options?: any) => {
  return createToastWithEmoji('delete', message, options)
}

export const toastEdit = (message: string = 'Modifié avec succès !', options?: any) => {
  return createToastWithEmoji('edit', message, options)
}

export const toastAdd = (message: string = 'Ajouté avec succès !', options?: any) => {
  return createToastWithEmoji('add', message, options)
}

export const toastSave = (message: string = 'Sauvegardé avec succès !', options?: any) => {
  return createToastWithEmoji('save', message, options)
}

export const toastUpload = (message: string = 'Upload réussi !', options?: any) => {
  return createToastWithEmoji('upload', message, options)
}

export const toastDownload = (message: string = 'Téléchargement réussi !', options?: any) => {
  return createToastWithEmoji('download', message, options)
}

