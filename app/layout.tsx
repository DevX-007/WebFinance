import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>WebFinance - Personal Finance Tracker</title>
        <meta name="description" content="A beautiful and intuitive personal finance tracking application" />
      </head>
      <body className={`bg-[#85756E20] ${inter.className}`}>
        {children}
      </body>
    </html>
  )
}
