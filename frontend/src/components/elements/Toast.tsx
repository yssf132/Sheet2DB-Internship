import { Toaster } from 'react-hot-toast'

/**
 * Toast component that provides a consistent toast notification configuration
 * across the application.
 */
const Toast = () => {
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: { background: '#363636', color: '#fff' },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#4ade80',
            secondary: '#fff',
          },
          style: { background: '#4ade80', color: '#065f46' },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: { background: '#ef4444', color: '#7f1d1d' },
        },
      }}
    />
  )
}

export default Toast
