import { type ChangeEvent, type FormEvent, useState } from 'react'

type Page = 'home' | 'sightings' | 'upload' | '404'

type UploadPageProps = {
  onNavigate: (page: Page) => void
}

function UploadPage({ onNavigate }: UploadPageProps) {
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

export default UploadPage
