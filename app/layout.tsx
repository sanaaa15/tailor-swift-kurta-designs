import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Logo from './components/Logo'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tailor Swift',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      <body className={inter.className} >
        {/* <Logo /> */}
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
        {children}
      </body>
    </html>
  )
}
