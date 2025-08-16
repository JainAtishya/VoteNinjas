import './globals.css';
import NextAuthProvider from '../components/SessionProvider';
import { ConditionalFloatingDock } from '../components/ConditionalFloatingDock';
import { ConditionalHeader } from '../components/ConditionalHeader';
import { ThemeProvider } from "next-themes";
import { Footer } from '../components/Footer'; 

export const metadata = {
  title: 'VoteNinjas - Coding Ninja Voting Platform',
  description: 'The official voting platform for Coding Ninja club competitions, hackathons, and democratic processes.',
  keywords: 'voting, coding ninja, events, competitions, hackathons, programming',
  authors: [{ name: 'VoteNinjas Team' }],
  openGraph: {
    title: 'VoteNinjas - Coding Ninja Voting Platform',
    description: 'The official voting platform for Coding Ninja club competitions, hackathons, and democratic processes.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <ConditionalHeader />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <ConditionalFloatingDock />
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}