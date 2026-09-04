import { useEffect, useState } from 'react'

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
  }
]

function ReadPage() {
  const [sightings, setSightings] = useState<Sighting[] | null>()
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const fetchSightings = async () => {
      try {
        const response = await fetch('http://localhost:3200/api')
        if (!response.ok) throw new Error('Failed to load sightings')

        const data: unknown = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          setSightings(data as Sighting[])
        }
      } catch (error) {
        console.error(error)
        setSightings(fallbackSightings)
      }
    }

    void fetchSightings()
  }, [])

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
        {sightings?.map((card, index) => {
          const isExpanded = Boolean(expandedCards[index])

          return (
            <article
              key={`${card.title}-${index}`}
              className="rounded-[18px] border border-white/10 bg-[#120f18]/80 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
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

export default ReadPage
