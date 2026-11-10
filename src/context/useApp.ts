import { useContext } from 'react'
import { AppContext, type AppContextType } from './appContextDef'

export const useApp = (): AppContextType => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp doit être utilisé au sein d’un AppProvider')
  }
  return context
}
