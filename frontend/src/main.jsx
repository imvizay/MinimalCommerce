
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// user context
import { UserProvider } from './contexts/UserContext.jsx'
import { CartProvider } from './contexts/CartContext.jsx'

// router context 
import { BrowserRouter } from 'react-router-dom'

// tanstack query setup
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
  <UserProvider> {/* User context */}
  <CartProvider> {/* Cart context */}
 
    {/* Query context */}
    <BrowserRouter>                           {/* Browser Router context */}
      <App />
    </BrowserRouter>


  </CartProvider>
  </UserProvider>
  </QueryClientProvider>,
)
