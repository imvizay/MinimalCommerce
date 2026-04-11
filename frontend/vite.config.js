import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve:{
    alias:{
      "@":path.resolve(__dirname,'./src'),
      "assets":path.resolve(__dirname,'./src/assets'),
      "components":path.resolve(__dirname,'./src/components'),
      "services":path.resolve(__dirname,'./src/services'),
      "contexts":path.resolve(__dirname,'./src/contexts'),
      "utlis":path.resolve(__dirname,'./src/utlis'),
    }
  }
})
