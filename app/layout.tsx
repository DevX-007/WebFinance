import './globals.css'

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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#85756E20] font-['Inter',sans-serif]">
        {children}
      </body>
    </html>
  )
}
