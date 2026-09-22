import { useMemo, useState } from 'react'
import './App.css'

const FLOWER_INTERVAL = 70

const CREATOR_NAME = 'Jehiel'

const FLOWER_RINGS = [
  {
    count: 1,
    radius: 0,
    size: 64,
  },
  {
    count: 8,
    radius: 8.5,
    size: 60,
  },
  {
    count: 12,
    radius: 16,
    size: 56,
  },
  {
    count: 16,
    radius: 24,
    size: 52,
  },
  {
    count: 18,
    radius: 31.5,
    size: 48,
  },
  {
    count: 20,
    radius: 38,
    size: 44,
  },
]

function createFlowers() {
  const flowers = []

  let index = 0

  FLOWER_RINGS.forEach((ring, ringIndex) => {
    const angleOffset =
      (ringIndex % 2 === 0 ? 0 : 10) *
      (Math.PI / 180)

    for (
      let i = 0;
      i < ring.count;
      i += 1
    ) {
      const angle =
        angleOffset +
        (i / ring.count) *
          Math.PI *
          2

      const jitterX =
        Math.sin(
          (i + 1) * 1.73 +
            ringIndex
        ) * 0.9

      const jitterY =
        Math.cos(
          (i + 1) * 1.91 +
            ringIndex
        ) * 0.7

      const x =
        50 +
        Math.cos(angle) *
          ring.radius +
        jitterX

      const y =
        40.5 +
        Math.sin(angle) *
          ring.radius *
          0.78 +
        jitterY

      const size =
        ring.size +
        ((i % 3) - 1) *
          1.4

      flowers.push({
        id: `${ringIndex}-${i}`,
        x,
        y,
        size,

        delay:
          index *
          FLOWER_INTERVAL,

        rotation:
          ((i * 27 +
            ringIndex * 11) %
            26) -
          13,
      })

      index += 1
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
  const [inputName, setInputName] =
    useState('')

  const [name, setName] =
    useState('')

  const [started, setStarted] =
    useState(false)

  const [ready, setReady] =
    useState(false)

  const [letterOpen, setLetterOpen] =
    useState(false)

  const [
    envelopeOpened,
    setEnvelopeOpened,
  ] = useState(false)

  const [isClosing, setIsClosing] =
    useState(false)

  const [fadeOut, setFadeOut] =
    useState(false)

  const flowers = useMemo(
    () => createFlowers(),
    []
  )

  const createBouquet = (event) => {
    event.preventDefault()

    const cleanName =
      inputName.trim()

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
      flowers.length *
        FLOWER_INTERVAL +
      700

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

  const openEnvelope = (
    event
  ) => {
    event.stopPropagation()

    if (
      envelopeOpened ||
      isClosing
    ) {
      return
    }

    setEnvelopeOpened(true)
  }

  const closeEnvelope = (
    event
  ) => {
    event.stopPropagation()

    if (
      !envelopeOpened ||
      isClosing
    ) {
      return
    }

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

  const returnToBouquet = (
    event
  ) => {
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

      {/* =========================
          FIRMA DEL CREADOR
      ========================== */}

      <div className="site-signature">
        <span>
          By
        </span>

        <strong>
          {CREATOR_NAME}
        </strong>
      </div>

      {/* =========================
          PANTALLA INICIAL
      ========================== */}

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
              Escribe tu nombre y
              deja que las flores
              aparezcan una por una.
            </p>

            <form
              onSubmit={createBouquet}
            >
              <label htmlFor="name">
                ¿Cómo te llamas?
              </label>

              <input
                id="name"
                type="text"
                placeholder="Escribe tu nombre..."
                value={inputName}
                onChange={(event) =>
                  setInputName(
                    event.target.value
                  )
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

      {/* =========================
          RAMO
      ========================== */}

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
              {flowers.map(
                (flower) => (
                  <Rose
                    key={flower.id}
                    flower={flower}
                  />
                )
              )}
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
                Preparando algo
                especial para ti...
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

      {/* =========================
          CARTA
      ========================== */}

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

          <header className="letter-title">
            <span>
              Tengo una pequeña
              carta para
            </span>

            <strong>
              {name}
            </strong>
          </header>

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
                onClick={
                  openEnvelope
                }
              >
                <div className="envelope-back" />

                <article
                  className="letter-paper"
                  onClick={
                    closeEnvelope
                  }
                >
                  <div className="letter-decoration">
                    🌼
                  </div>

                  <p className="letter-date">
                    21 de septiembre
                    de 2026
                  </p>

                  <h3>
                    Para {name},
                  </h3>

                  <p>
                    Hoy quiero
                    regalarte este
                    pequeño ramo de
                    flores amarillas,
                    aunque sea a través
                    de una pantalla.
                  </p>

                  <p>
                    Que cada flor
                    represente un
                    bonito deseo para
                    ti: alegría,
                    tranquilidad,
                    cariño, nuevos
                    sueños y muchísimas
                    razones para
                    sonreír.
                  </p>

                  <p>
                    Espero que todo
                    aquello que anhelas
                    siga creciendo y
                    floreciendo, y que
                    nunca te falten
                    personas, momentos
                    y recuerdos que
                    hagan tus días un
                    poquito más
                    especiales.
                  </p>

                  <p className="special-message">
                    ¡Feliz día de las
                    flores amarillas!

                    <br />

                    💛 Feliz
                    21-09-2026 💛
                  </p>

                  <p className="letter-ending">
                    Con mucho cariño 🌼
                  </p>

                  <div className="close-letter-hint">
                    Toca la carta para
                    guardarla
                  </div>
                </article>

                <div className="envelope-front">
                  <div className="front-left" />

                  <div className="front-right" />

                  <div className="front-bottom" />
                </div>

                <div className="envelope-flap" />

                <div className="wax-seal">
                  <span>
                    🌼
                  </span>
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
                    Toca el sobre
                    para abrirlo
                  </p>

                  <span>
                    Tu carta está
                    esperando
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
                    Toca la carta
                    para guardarla
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
                    Guardando tu
                    carta...
                  </p>
                </div>
              )}

            {!isClosing && (
              <button
                className="return-button"
                onClick={
                  returnToBouquet
                }
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