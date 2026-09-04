import { useState } from 'react'
import './App.css'
import ReadPage from './ReadPage'
import UploadPage from './UploadPage'

type Page = 'home' | 'sightings' | 'upload' | '404'

const navItems: Array<{ label: string; page: Page }> = [
  { label: 'Home', page: 'home' },
  { label: 'Read', page: 'sightings' },
  { label: 'Upload', page: 'upload' },
]

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'sightings':
        return <ReadPage />
      case 'upload':
        return <UploadPage onNavigate={setCurrentPage} />
      default:
        return <NotFoundPage />
    }
  }

  return (
    <div className="min-h-screen flex flex-col text-violet-50">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
      <Footer />
    </div>
  )
}

function Header({ currentPage, onNavigate }: { currentPage: Page; onNavigate: (page: Page) => void }) {
  return (
    <header className="border-b border-white/10 bg-[#120b1c]/90 backdrop-blur-sm">
      <div className="mx-auto flex w-[min(90vw,1200px)] items-center justify-between py-4">
        <div
          aria-label="site logo"
          className="grid h-14 w-14 place-items-center rounded-full bg-[radial-gradient(circle_at_50%_30%,_#f4ddb8_0%,_#d7b279_32%,_#8b4a31_100%)] shadow-[0_0_20px_rgba(244,221,184,0.4)]"
        >
          <span className="text-2xl text-[#fff9f0] drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">✦</span>
        </div>

        <nav id="main-navigation" aria-label="Main navigation">
          <ul role="list" className="flex list-none items-center gap-8 p-0">
            {navItems.map(({ label, page }) => (
              <li key={page} role="listitem">
                <button
                  type="button"
                  className={
                    currentPage === page
                      ? 'rounded-full border border-violet-300/50 bg-violet-400/10 px-4 py-2 text-sm font-medium text-violet-50 transition hover:opacity-100'
                      : 'rounded-full px-4 py-2 text-sm font-medium text-violet-50/90 transition hover:opacity-100'
                  }
                  onClick={() => onNavigate(page)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex justify-center pb-4 pt-2">
        <button
          type="button"
          className="font-['Frijole'] text-[clamp(2rem,4vw,3.25rem)] tracking-[0.04em] text-[#f5e0c0] drop-shadow-[0_0_20px_rgba(234,214,173,0.35)]"
          onClick={() => onNavigate('home')}
        >
          From the Other Side
        </button>
      </div>
    </header>
  )
}

function HomePage() {
  return (
    <main className="mx-auto grid min-h-[42vh] w-[min(90vw,1200px)] place-items-center text-center">
      <h1 className="max-w-[780px] font-['Frijole'] text-[clamp(2.2rem,5vw,4.5rem)] leading-none text-violet-50 drop-shadow-[0_0_22px_rgba(196,154,252,0.3)]">
        The online home of paranormal sightings
      </h1>
    </main>
  )
}

function NotFoundPage() {
  return (
    <main className="mx-auto grid min-h-[42vh] w-[min(90vw,1200px)] place-items-center text-center">
      <h1 className="font-['Frijole'] text-[clamp(2.2rem,5vw,4.5rem)] leading-none text-violet-50 drop-shadow-[0_0_22px_rgba(196,154,252,0.3)]">
        404 - You've been ghosted 👻
      </h1>
    </main>
  )
}

function Footer() {
  return (
    <footer className="pb-8 pt-5 text-center text-sm text-violet-100/75">
      <p>&copy; From The Other Side. All rights reserved.</p>
    </footer>
  )
}

export default App
