
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// user context
import { UserProvider } from './contexts/UserContext.jsx'

// router context 
import { BrowserRouter } from 'react-router-dom'

// tanstack query setup
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <UserProvider>
  <QueryClientProvider client={queryClient}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </QueryClientProvider>
  </UserProvider>,
)
