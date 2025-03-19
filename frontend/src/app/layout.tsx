import './globals.css'
import { Inter } from 'next/font/google'
import ThemeRegistry from '@/components/ThemeRegistry'
import ReduxProvider from '@/components/ReduxProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import AuthInitializer from '@/components/AuthInitializer'

// Use Inter font
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'E-Learning Platform',
  description: 'Learn anywhere, anytime with our comprehensive online courses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <AuthProvider>
            <AuthInitializer />
            <ThemeRegistry>
              <main style={{ 
                minHeight: '100vh', 
                background: 'white',
                color: 'black',
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                {children}
              </main>
            </ThemeRegistry>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
} 