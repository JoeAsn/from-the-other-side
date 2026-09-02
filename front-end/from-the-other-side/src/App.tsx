import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react'
import './App.css'

type Page = 'home' | 'sightings' | 'upload' | '404'

type Sighting = {
  title: string
  text: string
  location: string
  timeStamp: string
}

const fallbackSightings: Sighting[] = [
  {
    title: 'The whispers behind the wardrobe',
    text:
      'At 2:14am, a cold draft swept through the bedroom and the wardrobe door clicked open on its own. I heard a child whisper my name, then a low laugh from the hallway. The room smelled of wet earth and old roses.',
    location: 'Bristol, UK',
    timeStamp: '18 October 2024, 02:14',
  },
  {
    title: 'Lantern in the churchyard',
    text:
      'A single lantern drifted between the graves without any visible source. It hovered just above the ground, then vanished into the ivy wall. The bell tower rang once though the clock was stopped.',
    location: 'Yorkshire, UK',
    timeStamp: '11 September 2024, 21:38',
  },
  {
    title: 'The woman in the station tunnel',
    text:
      'I was waiting for the last train when a woman in a long coat walked out of the tunnel and stopped at the far end of the platform. She never blinked and the train still arrived, but she was gone before the doors opened.',
    location: 'London, UK',
    timeStamp: '3 November 2024, 23:47',
  },
]

const navItems: Array<{ label: string; page: Page }> = [
  { label: 'Home', page: 'home' },
  { label: 'Read', page: 'sightings' },
  { label: 'Upload', page: 'upload' },
]

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [sightings, setSightings] = useState<Sighting[]>(fallbackSightings)

  useEffect(() => {
    if (currentPage !== 'sightings') return

    const fetchSightings = async () => {
      try {
        const response = await fetch('/api')
        if (!response.ok) throw new Error('Failed to load sightings')

        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          setSightings(data)
        }
      } catch (error) {
        console.log(error)
        setSightings(fallbackSightings)
      }
    }

    void fetchSightings()
  }, [currentPage])

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'sightings':
        return <SightingsPage data={sightings} />
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

function SightingsPage({ data }: { data: Sighting[] }) {
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({})

  const toggleCard = (index: number) => {
    setExpandedCards((current) => ({
      ...current,
      [index]: !current[index],
    }))
  }

  return (
    <main className="mx-auto w-[min(90vw,1100px)] pb-16 pt-4">
      <h1 className="mb-6 font-['Frijole'] text-[clamp(2rem,3vw,3rem)] text-[#fce9c5] drop-shadow-[0_0_20px_rgba(244,214,138,0.2)]">
        Sightings
      </h1>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
        {data.map((card, index) => {
          const isExpanded = Boolean(expandedCards[index])

          return (
            <article
              key={`${card.title}-${index}`}
              className={
                isExpanded
                  ? 'rounded-[18px] border border-white/10 bg-[#120f18]/80 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.22)]'
                  : 'rounded-[18px] border border-white/10 bg-[#120f18]/80 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.22)]'
              }
              aria-labelledby={`sighting-title-${index}`}
            >
              <p className="mb-2 text-sm tracking-[0.04em] text-violet-300">{card.timeStamp}, {card.location}</p>
              <h3 id={`sighting-title-${index}`} className="mb-3 text-2xl font-semibold text-violet-50">
                {card.title}
              </h3>
              <div className={isExpanded ? 'max-h-80 overflow-hidden transition-all duration-300' : 'max-h-[8.7rem] overflow-hidden transition-all duration-300'}>
                <p className="leading-7 text-violet-100/90">{card.text}</p>
              </div>
              <button
                type="button"
                className="mt-4 rounded-full bg-gradient-to-r from-[#b87cff] to-[#f2b865] px-4 py-3 text-xs font-bold uppercase tracking-[0.04em] text-[#170d21] transition hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(184,124,255,0.35)]"
                aria-expanded={isExpanded}
                onClick={() => toggleCard(index)}
              >
                {isExpanded ? 'Show less' : 'Read in full'}
              </button>
            </article>
          )
        })}
      </div>
    </main>
  )
}

function UploadPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [values, setValues] = useState({
    title: '',
    details: '',
    datetime: '',
    location: '',
  })
  const [message, setMessage] = useState<string>('')
  const [messageType, setMessageType] = useState<'error' | 'success' | 'info'>('info')

  const updateField = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { location, details, title, datetime } = values

    if (!location || !details || !title) {
      setMessageType('error')
      setMessage('Please complete all fields!')
      return
    }

    if (!datetime) {
      setMessageType('error')
      setMessage('Please select a date and time!')
      return
    }

    const date = new Date(datetime)
    const readableDate = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date)

    const formData = {
      location,
      timeStamp: readableDate,
      text: details,
      title,
    }

    try {
      setMessage('')
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Server response was not ok')
      }

      setMessageType('success')
      setMessage('Your sighting was uploaded.')
      setValues({ title: '', details: '', datetime: '', location: '' })
    } catch (error) {
      console.error(error)
      setMessageType('error')
      setMessage('Serious ghouls! Please try again.')
    }
  }

  return (
    <main className="mx-auto w-[min(90vw,1100px)] pb-16 pt-4" aria-labelledby="form-title">
      <h1 id="form-title" className="mb-6 font-['Frijole'] text-[clamp(2rem,3vw,3rem)] text-[#fce9c5] drop-shadow-[0_0_20px_rgba(244,214,138,0.2)]">
        Add Sighting
      </h1>

      <form id="eventForm" onSubmit={handleSubmit} className="grid max-w-[720px] gap-3 rounded-[22px] border border-white/10 bg-[#14101c]/80 p-5 shadow-[0_24px_50px_rgba(0,0,0,0.2)] sm:p-8">
        <label htmlFor="title" className="font-semibold text-[#f2dcb6]">
          Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="A ghostly encounter"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-violet-50 placeholder:text-violet-100/55 focus:border-violet-300/60 focus:outline-none"
          value={values.title}
          onChange={updateField}
        />

        <label htmlFor="details" className="font-semibold text-[#f2dcb6]">
          Details:
        </label>
        <textarea
          id="details"
          name="details"
          rows={5}
          placeholder="I was trying to get to sleep when..."
          className="w-full resize-y rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-violet-50 placeholder:text-violet-100/55 focus:border-violet-300/60 focus:outline-none"
          value={values.details}
          onChange={updateField}
        />

        <label htmlFor="datetime" className="font-semibold text-[#f2dcb6]">
          Time/Date:
        </label>
        <input
          type="datetime-local"
          id="datetime"
          name="datetime"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-violet-50 placeholder:text-violet-100/55 focus:border-violet-300/60 focus:outline-none"
          value={values.datetime}
          onChange={updateField}
        />

        <label htmlFor="location" className="font-semibold text-[#f2dcb6]">
          Location:
        </label>
        <input
          type="text"
          id="location"
          name="location"
          placeholder="London, UK"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-violet-50 placeholder:text-violet-100/55 focus:border-violet-300/60 focus:outline-none"
          value={values.location}
          onChange={updateField}
        />

        <button type="submit" className="mt-2 w-full rounded-full bg-gradient-to-r from-[#b87cff] to-[#f2b865] px-5 py-4 text-xs font-bold uppercase tracking-[0.04em] text-[#170d21] transition hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(184,124,255,0.35)]">
          submit
        </button>

        <div className="mt-1">
          {message ? (
            <p className={messageType === 'error' ? 'm-0 leading-6 text-[#ffb5b5]' : 'm-0 leading-6 text-violet-100'}>
              {message}
              {messageType === 'success' && (
                <>
                  {' '}View it{' '}
                  <button type="button" className="inline rounded-none border-0 bg-transparent p-0 font-semibold text-[#f2b865] underline" onClick={() => onNavigate('sightings')}>
                    here
                  </button>
                  .
                </>
              )}
            </p>
          ) : (
            <p className="m-0 leading-6 text-violet-100">
              All sightings will be published on our{' '}
              <button type="button" className="inline rounded-none border-0 bg-transparent p-0 font-semibold text-[#f2b865] underline" onClick={() => onNavigate('sightings')}>
                sightings
              </button>{' '}
              page.
            </p>
          )}
        </div>
      </form>
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
