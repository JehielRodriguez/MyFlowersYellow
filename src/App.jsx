import { useMemo, useState } from 'react'
import './App.css'

const FLOWER_INTERVAL = 85
const CREATOR_NAME = 'Jehiel'

const FLOWER_RINGS = [
  { count: 1, radius: 0, size: 62 },
  { count: 7, radius: 9, size: 60 },
  { count: 12, radius: 17, size: 58 },
  { count: 18, radius: 25, size: 56 },
  { count: 22, radius: 32, size: 54 },
  { count: 26, radius: 39, size: 52 },
  { count: 28, radius: 45, size: 50 },
]

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function createFlowers() {
  const flowers = []
  let order = 0

  const centerX = 50
  const centerY = 40

  FLOWER_RINGS.forEach((ring, ringIndex) => {
    if (ring.count === 1) {
      flowers.push({
        id: `ring-${ringIndex}-0`,
        x: centerX,
        y: centerY,
        size: ring.size,
        delay: order * FLOWER_INTERVAL,
        rotation: 0,
        stemLength: 132,
        stemLean: 0,
        zIndex: 300,
        hasStem: false, // <- la flor principal NO tendrá tallo
      })
      order += 1
      return
    }

    const angleOffset =
      -Math.PI / 2 + (ringIndex % 2 === 0 ? 0 : 0.1)

    for (let i = 0; i < ring.count; i += 1) {
      const angle =
        angleOffset + (i / ring.count) * Math.PI * 2

      const jitterX =
        Math.sin((ringIndex + 1) * 1.17 + i * 0.81) * 0.65

      const jitterY =
        Math.cos((ringIndex + 1) * 0.88 + i * 0.67) * 0.55

      const x =
        centerX + Math.cos(angle) * ring.radius + jitterX

      const y =
        centerY + Math.sin(angle) * ring.radius + jitterY

      const size =
        ring.size + (((i + ringIndex) % 3) - 1) * 1.1

      const rotation =
        ((i * 11 + ringIndex * 9) % 20) - 10

      const stemLength = clamp(
        138 - (y - centerY) * 2.25,
        52,
        142,
      )

      const stemLean = clamp(
        (x - centerX) * 0.3,
        -12,
        12,
      )

      flowers.push({
        id: `ring-${ringIndex}-${i}`,
        x,
        y,
        size,
        delay: order * FLOWER_INTERVAL,
        rotation,
        stemLength,
        stemLean,
        zIndex: Math.round(100 + y * 3),
        hasStem: true, // <- todas las demás sí tendrán tallo
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
      {flower.hasStem && (
        <div className="stem-wrap">
          <span className="stem" />
          <span className="leaf leaf-left" />
          <span className="leaf leaf-right" />
        </div>
      )}

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
                Armando el ramo desde el centro...
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

                  <h3>Para {name},</h3>

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