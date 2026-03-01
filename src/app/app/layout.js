// src/app/layout.js
import { UserProvider } from '@/context/UserContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
  title: 'NepStreams - Watch Anime Free | Sub & Dub',
  description: 'Watch your favorite anime with Japanese subtitles and English dub. Stream thousands of anime episodes for free on NepStreams.',
  keywords: 'anime, streaming, watch anime, sub, dub, nepstreams, free anime',
  openGraph: {
    title: 'NepStreams - Watch Anime Free',
    description: 'Stream thousands of anime episodes with sub and dub for free.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark-500 text-white antialiased">
        <UserProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
