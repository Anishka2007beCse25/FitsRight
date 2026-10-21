
import { useState, type FormEvent } from 'react'
import './App.css'
import AssistantDemo from './AssistantDemo'
import { laptops, docks } from './engine/catalogue'
import {
  checkCompatibility,
  type Capability,
  type Verdict,
} from './engine/compatibility'



const requirements: {
  id: Capability
  label: string
}[] = [
  { id: 'charging', label: 'Charge my laptop through the dock' },
  { id: 'external-display', label: 'Connect an external display' },
  { id: 'multiple-displays', label: 'Connect multiple external displays' },
  { id: 'high-speed-data', label: 'High-speed USB data transfer' },
]

const verdictLabels: Record<Verdict, string> = {
  compatible: 'Compatible for selected requirements',
  partially_compatible: 'Partially compatible',
  incompatible: 'Incompatible',
  needs_more_information: 'Needs more information',
}

function App() {
  const [laptopId, setLaptopId] = useState('')
  const [dockName, setDockName] = useState('')
  const [selectedRequirements, setSelectedRequirements] = useState<
    Capability[]
  >([])
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const laptop = laptops.find((item) => item.id === laptopId)

  const selectedDock = docks.find(
    (item) =>
      item.name.trim().toLowerCase() === dockName.trim().toLowerCase() ||
      item.id.trim().toLowerCase() === dockName.trim().toLowerCase(),
  )

  function toggleRequirement(id: Capability) {
    setSubmitted(false)
    setError('')

    setSelectedRequirements((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(false)
    setError('')

    if (!laptop) {
      setError('Please select your laptop.')
      return
    }

    if (selectedRequirements.length === 0) {
      setError('Please select at least one must-have requirement.')
      return
    }

    if (!selectedDock) {
      setError(
        'This dock is not yet in the verified catalogue. Try Dell Thunderbolt Dock WD22TB4. Unknown models cannot receive a definitive compatibility verdict.',
      )
      return
    }

    setSubmitted(true)
  }

  function resetForm() {
    setLaptopId('')
    setDockName('')
    setSelectedRequirements([])
    setSubmitted(false)
    setError('')
  }

  let report: ReturnType<typeof checkCompatibility> | null = null

  if (submitted && laptop && selectedDock) {
    report = checkCompatibility({
      laptop,
      dock: selectedDock,
      mustHave: selectedRequirements,
      optional: [],
    })
  }

  return (
    <div className="app-shell" id="home">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="FitsRight home">
          <span className="brand-icon">F</span>
          <span>FitsRight</span>
        </a>

        <nav aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#compatibility">Compatibility</a>
          <a className="signin-button" href="#compatibility">
            Get started
          </a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-badge">
            <span className="status-dot" />
            Evidence-backed compatibility
          </div>

          <h1>
            The right dock.
            <br />
            <span>The right connection.</span>
          </h1>

          <p className="hero-description">
            Stop guessing whether a USB hub or docking station will work with
            your laptop. Get a compatibility report grounded in manufacturer
            specifications.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#compatibility">
              Check compatibility <span>→</span>
            </a>

            <a className="secondary-button" href="#how-it-works">
              How it works
            </a>
          </div>

          <div className="trust-note">
            <span>✓</span>
            No guessing. No invented specifications.
          </div>
        </section>

        <section className="feature-grid" id="how-it-works">
          <article className="feature-card">
            <div className="feature-icon lavender">⌕</div>
            <p className="card-eyebrow">01 / IDENTIFY</p>
            <h2>Your exact laptop</h2>
            <p>
              Identify your laptop model and configuration before checking
              ports, displays, and charging requirements.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon blue">↔</div>
            <p className="card-eyebrow">02 / VERIFY</p>
            <h2>Check every requirement</h2>
            <p>
              Evaluate essential features using explicit compatibility rules
              and official manufacturer evidence.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon green">✓</div>
            <p className="card-eyebrow">03 / DECIDE</p>
            <h2>Buy with confidence</h2>
            <p>
              Understand supported features, known limitations, missing
              details, and the evidence needed to make a decision.
            </p>
          </article>
        </section>

        <section className="checker-panel">
          <div className="checker-copy">
            <p className="card-eyebrow">YOUR NEXT STEP</p>
            <h2>Let's find your perfect match.</h2>
            <p>
              Choose your laptop, identify your dock, and tell us which
              capabilities are essential.
            </p>
          </div>

          <a className="primary-button" href="#compatibility">
            Start a compatibility check <span>→</span>
          </a>
        </section>
        <AssistantDemo />

        <section className="device-checker" id="compatibility">
          <div className="checker-heading">
            <p className="card-eyebrow">FITSRIGHT COMPATIBILITY ENGINE</p>
            <h2>Let's check your setup.</h2>
            <p>
              Your results are based on catalogue evidence and deterministic
              rules. Missing specifications remain unknown.
            </p>
          </div>

          <form className="device-form" onSubmit={handleSubmit}>
            <label htmlFor="laptop">Your laptop</label>

            <select
              id="laptop"
              name="laptop"
              required
              value={laptopId}
              onChange={(event) => {
                setLaptopId(event.target.value)
                setSubmitted(false)
                setError('')
              }}
            >
              <option value="" disabled>
                Select your exact laptop
              </option>

              {laptops.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            {laptop && (
              <p className="verification-note">
                Catalogue note:{' '}
                {laptop.modelVerified
                  ? 'The catalogue record is marked verified. Check the exact configuration and selected requirements in the report below.'
                  : 'This model has not yet been fully verified.'}
              </p>
            )}

            <label htmlFor="dock">Docking station or USB hub</label>

            <input
              id="dock"
              name="dock"
              type="text"
              placeholder="e.g. Dell Thunderbolt Dock WD22TB4"
              value={dockName}
              onChange={(event) => {
                setDockName(event.target.value)
                setSubmitted(false)
                setError('')
              }}
              required
              list="available-docks"
            />

            <datalist id="available-docks">
              {docks.map((dock) => (
                <option key={dock.id} value={dock.name} />
              ))}
            </datalist>

            <fieldset>
              <legend>What must your setup support?</legend>

              {requirements.map((item) => (
                <label className="checkbox-label" key={item.id}>
                  <input
                    type="checkbox"
                    checked={selectedRequirements.includes(item.id)}
                    onChange={() => toggleRequirement(item.id)}
                  />

                  <span>{item.label}</span>
                </label>
              ))}
            </fieldset>

            <p className="form-note">
              Select every essential capability. At least one must-have is
              required before FitsRight can evaluate the setup.
            </p>

            {error && (
              <div className="notice-box" role="alert">
                <strong>Cannot complete this check yet.</strong>
                <p>{error}</p>
              </div>
            )}

            <button className="primary-button" type="submit">
              Check compatibility <span>→</span>
            </button>
          </form>

          {report && laptop && selectedDock && (
            <section className="review-panel" aria-live="polite">
              <p className="card-eyebrow">COMPATIBILITY REPORT</p>

              <h3>{verdictLabels[report.verdict]}</h3>

              <p>{report.summary}</p>

              <div className="notice-box">
                <strong>Scope of this result</strong>
                <p>
                  This verdict applies only to the requirements selected for
                  this check and the evidence currently recorded for these
                  catalogue entries. It does not certify unselected features,
                  every monitor resolution or refresh rate, or every possible
                  charging setup. Confirm your exact configuration, cable, and
                  power-adapter needs before buying.
                </p>
              </div>

              <dl className="review-details">
                <div>
                  <dt>Laptop</dt>
                  <dd>{laptop.name}</dd>
                </div>

                <div>
                  <dt>Dock or hub</dt>
                  <dd>{selectedDock.name}</dd>
                </div>

                <div>
                  <dt>Catalogue model status</dt>
                  <dd>
                    Laptop:{' '}
                    {laptop.modelVerified
                      ? 'marked verified'
                      : 'not yet verified'}
                    ; dock:{' '}
                    {selectedDock.modelVerified
                      ? 'marked verified'
                      : 'not yet verified'}
                  </dd>
                </div>

                <div>
                  <dt>Must-have requirements</dt>
                  <dd>
                    {selectedRequirements
                      .map(
                        (id) =>
                          requirements.find((item) => item.id === id)?.label,
                      )
                      .filter(Boolean)
                      .join(', ')}
                  </dd>
                </div>
              </dl>

              <h4>Requirement-by-requirement results</h4>

              {report.requirements.map((item) => (
                <article
                  className="feature-card"
                  key={`${item.capability}-${item.importance}`}
                >
                  <h4>
                    {requirements.find(
                      (requirement) => requirement.id === item.capability,
                    )?.label ?? item.capability}
                  </h4>

                  <p>
                    <strong>Importance:</strong>{' '}
                    {item.importance === 'must-have' ? 'Must-have' : 'Optional'}
                  </p>

                  <p>
                    <strong>Status:</strong>{' '}
                    {item.status === 'supported'
                      ? 'Supported'
                      : item.status === 'unsupported'
                        ? 'Not supported'
                        : 'Unknown — verification required'}
                  </p>

                  <p>{item.explanation}</p>

                  {item.evidence.length > 0 ? (
                    <div>
                      <strong>Manufacturer evidence recorded in the catalogue</strong>

                      <ul>
                        {item.evidence.map((evidence, index) => (
                          <li
                            key={`${evidence.url}-${index}`}
                            className="evidence-item"
                          >
                            <a
                              href={evidence.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {evidence.manufacturer}:{' '}
                              {evidence.documentTitle}
                            </a>

                            <p>{evidence.detail}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>
                      No manufacturer evidence is attached to this requirement
                      in the current catalogue. Do not treat this as
                      independently verified until a source is added.
                    </p>
                  )}
                </article>
              ))}

              {report.nextSteps.length > 0 && (
                <>
                  <h4>Next steps</h4>

                  <ul>
                    {report.nextSteps.map((step, index) => (
                      <li key={`${index}-${step}`}>{step}</li>
                    ))}
                  </ul>
                </>
              )}

              <div className="notice-box">
                <strong>Evidence matters.</strong>
                <p>
                  “Needs more information” means at least one essential detail
                  is unverified. More generally, a result is only as reliable
                  as the catalogue evidence behind it. Unknown specifications
                  are not proof of compatibility, and a compatible result
                  covers only the requirements shown in this report.
                </p>
              </div>

              <button
                className="secondary-button reset-button"
                type="button"
                onClick={resetForm}
              >
                Check another setup
              </button>
            </section>
          )}
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#home">
          <span className="brand-icon">F</span>
          <span>FitsRight</span>
        </a>

        <p>Compatibility you can verify.</p>
      </footer>
    </div>
  )
}

export default App