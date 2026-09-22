import { useMemo, useState } from 'react'
import './App.css'

const FLOWER_INTERVAL = 95
const CREATOR_NAME = 'Jehiel'

const OVAL_ROWS = [
  { count: 6, width: 24, y: 17, size: 40, stem: 132 },
  { count: 8, width: 34, y: 22, size: 42, stem: 126 },
  { count: 10, width: 44, y: 28, size: 44, stem: 120 },
  { count: 12, width: 52, y: 35, size: 46, stem: 112 },
  { count: 13, width: 58, y: 42, size: 48, stem: 104 },
  { count: 13, width: 59, y: 49, size: 49, stem: 96 },
  { count: 12, width: 56, y: 56, size: 47, stem: 88 },
  { count: 10, width: 48, y: 63, size: 45, stem: 80 },
  { count: 8, width: 38, y: 69, size: 43, stem: 72 },
]

function createFlowers() {
  const flowers = []
  let order = 0

  OVAL_ROWS.forEach((row, rowIndex) => {
    const startX = 50 - row.width / 2
    const gap =
      row.count > 1 ? row.width / (row.count - 1) : 0

    for (let i = 0; i < row.count; i += 1) {
      const x = startX + gap * i

      const waveX =
        Math.sin((rowIndex + 1) * 0.8 + i * 0.7) * 0.75

      const waveY =
        Math.cos((rowIndex + 1) * 0.9 + i * 0.55) * 0.65

      const xFinal = x + waveX
      const yFinal = row.y + waveY

      const size =
        row.size + (((i + rowIndex) % 3) - 1) * 1.2

      const rotation =
        (((i * 11 + rowIndex * 7) % 18) - 9)

      const stemLean =
        (((i % 5) - 2) * 2.2)

      flowers.push({
        id: `${rowIndex}-${i}`,
        x: xFinal,
        y: yFinal,
        size,
        delay: order * FLOWER_INTERVAL,
        rotation,
        rowIndex,
        zIndex: 10 + rowIndex,
        stemLength: row.stem,
        stemLean,
      })

      order += 1
    }
  })

  return flowers
}

function Rose({ flower }) {
  return (
    <div
      className="rose"
      style={{
        '--x': flower.x,
        '--y': flower.y,
        '--size': `${flower.size}px`,
        '--delay': `${flower.delay}ms`,
        '--rotation': `${flower.rotation}deg`,
        '--stem-length': `${flower.stemLength}px`,
        '--stem-lean': `${flower.stemLean}deg`,
        zIndex: flower.zIndex,
      }}
    >
      <div className="stem-wrap">
        <span className="stem" />
        <span className="leaf leaf-left" />
        <span className="leaf leaf-right" />
      </div>

      <div className="rose-head">
        <span className="outer outer-1" />
        <span className="outer outer-2" />
        <span className="outer outer-3" />
        <span className="outer outer-4" />
        <span className="outer outer-5" />
        <span className="outer outer-6" />

        <span className="mid mid-1" />
        <span className="mid mid-2" />
        <span className="mid mid-3" />
        <span className="mid mid-4" />

        <span className="inner inner-1" />
        <span className="inner inner-2" />
        <span className="inner inner-3" />
        <span className="rose-core" />
      </div>
    </div>
  )
}

function App() {
  const [inputName, setInputName] = useState('')
  const [name, setName] = useState('')

  const [started, setStarted] = useState(false)
  const [ready, setReady] = useState(false)

  const [letterOpen, setLetterOpen] = useState(false)
  const [envelopeOpened, setEnvelopeOpened] = useState(false)

  const [isClosing, setIsClosing] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  const flowers = useMemo(() => createFlowers(), [])

  const createBouquet = (event) => {
    event.preventDefault()

    const cleanName = inputName.trim()

    if (!cleanName) return

    setName(cleanName)
    setStarted(true)
    setReady(false)

    setLetterOpen(false)
    setEnvelopeOpened(false)

    setIsClosing(false)
    setFadeOut(false)

    const animationTime =
      flowers.length * FLOWER_INTERVAL + 1000

    setTimeout(() => {
      setReady(true)
    }, animationTime)
  }

  const showEnvelope = () => {
    if (!ready) return

    setIsClosing(false)
    setFadeOut(false)

    setLetterOpen(true)
    setEnvelopeOpened(false)
  }

  const openEnvelope = (event) => {
    event.stopPropagation()

    if (envelopeOpened || isClosing) return

    setEnvelopeOpened(true)
  }

  const closeEnvelope = (event) => {
    event.stopPropagation()

    if (!envelopeOpened || isClosing) return

    setIsClosing(true)
    setEnvelopeOpened(false)

    setTimeout(() => {
      setFadeOut(true)
    }, 1650)

    setTimeout(() => {
      setLetterOpen(false)
      setEnvelopeOpened(false)
      setIsClosing(false)
      setFadeOut(false)
    }, 2200)
  }

  const returnToBouquet = (event) => {
    event.stopPropagation()

    if (isClosing) return

    setLetterOpen(false)
    setEnvelopeOpened(false)
    setIsClosing(false)
    setFadeOut(false)
  }

  const restart = (event) => {
    event.stopPropagation()

    setStarted(false)
    setReady(false)
    setLetterOpen(false)
    setEnvelopeOpened(false)
    setIsClosing(false)
    setFadeOut(false)
    setName('')
    setInputName('')
  }

  return (
    <main className="app">
      <div className="background-glow glow-1" />
      <div className="background-glow glow-2" />

      <div className="site-signature">
        <span>By</span>
        <strong>{CREATOR_NAME}</strong>
      </div>

      {!started && (
        <section className="welcome-screen">
          <div className="welcome-card">
            <div className="small-flower">🌼</div>

            <p className="welcome-small">
              21 • 09 • 2026
            </p>

            <h1>
              Un ramo especial
              <span>para ti</span>
            </h1>

            <p className="welcome-description">
              Escribe tu nombre y deja que las flores
              aparezcan una por una.
            </p>

            <form onSubmit={createBouquet}>
              <label htmlFor="name">
                ¿Cómo te llamas?
              </label>

              <input
                id="name"
                type="text"
                placeholder="Escribe tu nombre..."
                value={inputName}
                onChange={(event) =>
                  setInputName(event.target.value)
                }
                autoComplete="off"
                maxLength={40}
              />

              <button type="submit">
                Crear mi ramo
                <span>🌼</span>
              </button>
            </form>
          </div>
        </section>
      )}

      {started && (
        <section
          className={`bouquet-screen ${
            ready ? 'bouquet-ready' : ''
          }`}
          onClick={showEnvelope}
        >
          <div className="top-message">
            <span>Para</span>
            <h2>{name}</h2>
          </div>

          <div className="bouquet">
            <div className="paper paper-left" />
            <div className="paper paper-left-2" />
            <div className="paper paper-right" />
            <div className="paper paper-right-2" />
            <div className="paper paper-center" />

            <div className="flower-shadow" />
            <div className="stem-shadow" />

            <div className="flowers">
              {flowers.map((flower) => (
                <Rose
                  key={flower.id}
                  flower={flower}
                />
              ))}
            </div>

            <div className="bouquet-base">
              <div className="ribbon">
                <span>Para</span>
                <strong>{name}</strong>
                <small>21 · 09 · 2026</small>
              </div>
            </div>
          </div>

          {!ready && (
            <div className="creating-text">
              <span />
              <p>
                Armando el ramo flor por flor...
              </p>
            </div>
          )}

          {ready && (
            <div className="touch-message">
              <div className="touch-icon">☝🏻</div>

              <p>Toca la pantalla</p>

              <span>Hay algo más para ti</span>
            </div>
          )}

          <button
            className="restart-button"
            onClick={restart}
          >
            ↻ Empezar de nuevo
          </button>
        </section>
      )}

      {letterOpen && (
        <section
          className={`letter-overlay ${
            fadeOut ? 'closing' : ''
          }`}
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <div className="letter-background-light" />

          <header className="letter-title">
            <span>
              Tengo una pequeña carta para
            </span>
            <strong>{name}</strong>
          </header>

          <div className="envelope-area">
            <div className="envelope-scene">
              <div
                className={`envelope ${
                  envelopeOpened ? 'opened' : ''
                } ${
                  isClosing
                    ? 'closing-envelope'
                    : ''
                }`}
                onClick={openEnvelope}
              >
                <div className="envelope-back" />

                <article
                  className="letter-paper"
                  onClick={closeEnvelope}
                >
                  <div className="letter-decoration">
                    🌼
                  </div>

                  <p className="letter-date">
                    21 de septiembre de 2026
                  </p>

                  <h3>
                    Para {name},
                  </h3>

                  <p>
                    Hoy quiero regalarte este pequeño
                    ramo de flores amarillas, aunque
                    sea a través de una pantalla.
                  </p>

                  <p>
                    Que cada flor represente un bonito
                    deseo para ti: alegría,
                    tranquilidad, cariño, nuevos
                    sueños y muchísimas razones para
                    sonreír.
                  </p>

                  <p>
                    Espero que todo aquello que
                    anhelas siga creciendo y
                    floreciendo, y que nunca te
                    falten personas, momentos y
                    recuerdos que hagan tus días un
                    poquito más especiales.
                  </p>

                  <p className="special-message">
                    ¡Feliz día de las flores amarillas!
                    <br />
                    💛 Feliz 21-09-2026 💛
                  </p>

                  <p className="letter-ending">
                    Con mucho cariño 🌼
                  </p>

                  <div className="close-letter-hint">
                    Toca la carta para guardarla
                  </div>
                </article>

                <div className="envelope-front">
                  <div className="front-left" />
                  <div className="front-right" />
                  <div className="front-bottom" />
                </div>

                <div className="envelope-flap" />

                <div className="wax-seal">
                  <span>🌼</span>
                </div>
              </div>
            </div>
          </div>

          <div className="letter-controls">
            {!envelopeOpened &&
              !isClosing && (
                <div className="open-envelope-message">
                  <div className="envelope-touch-icon">
                    ☝🏻
                  </div>

                  <p>
                    Toca el sobre para abrirlo
                  </p>

                  <span>
                    Tu carta está esperando
                  </span>
                </div>
              )}

            {envelopeOpened &&
              !isClosing && (
                <div className="letter-opened-message">
                  <span>💛</span>
                  <p>
                    Toca la carta para guardarla
                  </p>
                </div>
              )}

            {isClosing &&
              !fadeOut && (
                <div className="closing-message">
                  <span>💛</span>
                  <p>
                    Guardando tu carta...
                  </p>
                </div>
              )}

            {!isClosing && (
              <button
                className="return-button"
                onClick={returnToBouquet}
              >
                ← Volver al ramo
              </button>
            )}
          </div>
        </section>
      )}
    </main>
  )
}

export default App