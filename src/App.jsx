import { useMemo, useState } from 'react'
import './App.css'

const TOTAL_FLOWERS = 72
const FLOWER_INTERVAL = 85

// ======================================
// CREADOR DE LA PÁGINA
// ======================================
const CREATOR_NAME =
  'Jehiel Jeremias Rodriguez Sarmiento'

function createFlowers(total) {
  return Array.from({ length: total }, (_, index) => {
    const progress = (index + 0.5) / total

    const radius = Math.sqrt(progress) * 35
    const angle =
      index * 137.508 * (Math.PI / 180)

    const jitterX =
      Math.sin(index * 13.37) * 1.6

    const jitterY =
      Math.cos(index * 9.27) * 1.3

    const x =
      50 +
      Math.cos(angle) * radius +
      jitterX

    const y =
      41 +
      Math.sin(angle) * radius * 0.78 +
      jitterY

    const size =
      34 +
      ((index * 17) % 21) +
      Math.round((1 - progress) * 8)

    return {
      id: index,
      x,
      y,
      size,
      delay: index * FLOWER_INTERVAL,
      rotation: (index * 31) % 360,
    }
  })
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
      }}
    >
      <div className="rose-head">
        <span className="petal petal-1" />
        <span className="petal petal-2" />
        <span className="petal petal-3" />
        <span className="petal petal-4" />
        <span className="petal petal-5" />
        <span className="petal petal-6" />
        <span className="petal petal-7" />
        <span className="petal petal-8" />

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

  const [started, setStarted] =
    useState(false)

  const [ready, setReady] =
    useState(false)

  const [letterOpen, setLetterOpen] =
    useState(false)

  const [envelopeOpened, setEnvelopeOpened] =
    useState(false)

  const [isClosing, setIsClosing] =
    useState(false)

  const [fadeOut, setFadeOut] =
    useState(false)

  const flowers = useMemo(
    () => createFlowers(TOTAL_FLOWERS),
    []
  )

  const createBouquet = (event) => {
    event.preventDefault()

    const cleanName = inputName.trim()

    if (!cleanName) {
      return
    }

    setName(cleanName)

    setStarted(true)
    setReady(false)

    setLetterOpen(false)
    setEnvelopeOpened(false)

    setIsClosing(false)
    setFadeOut(false)

    const animationTime =
      TOTAL_FLOWERS * FLOWER_INTERVAL + 800

    setTimeout(() => {
      setReady(true)
    }, animationTime)
  }

  const showEnvelope = () => {
    if (!ready) {
      return
    }

    setIsClosing(false)
    setFadeOut(false)

    setLetterOpen(true)
    setEnvelopeOpened(false)
  }

  const openEnvelope = (event) => {
    event.stopPropagation()

    if (
      envelopeOpened ||
      isClosing
    ) {
      return
    }

    setEnvelopeOpened(true)
  }

  const closeEnvelope = (event) => {
    event.stopPropagation()

    if (
      !envelopeOpened ||
      isClosing
    ) {
      return
    }

    setIsClosing(true)

    // La hoja baja y el sobre
    // comienza a cerrarse.
    setEnvelopeOpened(false)

    // Después cerramos visualmente
    // toda la pantalla.
    setTimeout(() => {
      setFadeOut(true)
    }, 1650)

    // Finalmente regresamos al ramo.
    setTimeout(() => {
      setLetterOpen(false)
      setEnvelopeOpened(false)

      setIsClosing(false)
      setFadeOut(false)
    }, 2200)
  }

  const returnToBouquet = (event) => {
    event.stopPropagation()

    if (isClosing) {
      return
    }

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

      {/* =================================
          FIRMA DEL CREADOR
      ================================= */}

      <div className="site-signature">
        <span>By</span>

        <strong>
          {CREATOR_NAME}
        </strong>
      </div>

      {/* =================================
          PANTALLA PRINCIPAL
      ================================= */}

      {!started && (
        <section className="welcome-screen">
          <div className="welcome-card">
            <div className="small-flower">
              🌼
            </div>

            <p className="welcome-small">
              21 • 09 • 2026
            </p>

            <h1>
              Un ramo especial

              <span>
                para ti
              </span>
            </h1>

            <p className="welcome-description">
              Escribe tu nombre y deja que las
              flores aparezcan una por una.
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

                <span>
                  🌼
                </span>
              </button>
            </form>
          </div>
        </section>
      )}

      {/* =================================
          RAMO
      ================================= */}

      {started && (
        <section
          className={`bouquet-screen ${
            ready
              ? 'bouquet-ready'
              : ''
          }`}
          onClick={showEnvelope}
        >
          <div className="top-message">
            <span>
              Para
            </span>

            <h2>
              {name}
            </h2>
          </div>

          <div className="bouquet">
            <div className="paper paper-left" />
            <div className="paper paper-left-2" />

            <div className="paper paper-right" />
            <div className="paper paper-right-2" />

            <div className="paper paper-center" />

            <div className="flower-shadow" />

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
                <span>
                  Para
                </span>

                <strong>
                  {name}
                </strong>

                <small>
                  21 · 09 · 2026
                </small>
              </div>
            </div>
          </div>

          {!ready && (
            <div className="creating-text">
              <span />

              <p>
                Preparando algo especial para ti...
              </p>
            </div>
          )}

          {ready && (
            <div className="touch-message">
              <div className="touch-icon">
                ☝🏻
              </div>

              <p>
                Toca la pantalla
              </p>

              <span>
                Hay algo más para ti
              </span>
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

      {/* =================================
          SOBRE Y CARTA
      ================================= */}

      {letterOpen && (
        <section
          className={`letter-overlay ${
            fadeOut
              ? 'closing'
              : ''
          }`}
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <div className="letter-background-light" />

          {/* CABECERA INDEPENDIENTE
              Ya no queda encima de la carta */}

          <header className="letter-title">
            <span>
              Tengo una pequeña carta para
            </span>

            <strong>
              {name}
            </strong>
          </header>

          {/* ÁREA FLEXIBLE DEL SOBRE */}

          <div className="envelope-area">
            <div className="envelope-scene">
              <div
                className={`envelope ${
                  envelopeOpened
                    ? 'opened'
                    : ''
                } ${
                  isClosing
                    ? 'closing-envelope'
                    : ''
                }`}
                onClick={openEnvelope}
              >
                <div className="envelope-back" />

                {/* =========================
                    CARTA
                ========================== */}

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

                {/* PARTE FRONTAL */}

                <div className="envelope-front">
                  <div className="front-left" />
                  <div className="front-right" />
                  <div className="front-bottom" />
                </div>

                {/* SOLAPA */}

                <div className="envelope-flap" />

                {/* SELLO */}

                <div className="wax-seal">
                  <span>
                    🌼
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =================================
              CONTROLES INFERIORES
          ================================= */}

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
                  <span>
                    💛
                  </span>

                  <p>
                    Toca la carta para guardarla
                  </p>
                </div>
              )}

            {isClosing &&
              !fadeOut && (
                <div className="closing-message">
                  <span>
                    💛
                  </span>

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