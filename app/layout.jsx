import './globals.css';

export const metadata = {
  title: '786 AI Hub | Global AI Tools Directory',
  description: 'Discover, search, and launch top-rated AI tools worldwide for text, images, code, audio, and video.',
  manifest: '/manifest.json',
  themeColor: '#090d16',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#090d16" />
        <link rel="apple-touch-icon" href="https://cdn-icons-png.flaticon.com/512/2103/2103633.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
