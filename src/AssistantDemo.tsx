import { useState } from 'react'
import { laptops, docks } from './engine/catalogue'
import {
  checkCompatibility,
  type Capability,
  type CompatibilityReport,
} from './engine/compatibility'

const requirements: { id: Capability; label: string }[] = [
  { id: 'charging', label: 'Charge my laptop through the dock' },
  { id: 'external-display', label: 'Connect an external display' },
  { id: 'multiple-displays', label: 'Connect multiple external displays' },
  { id: 'high-speed-data', label: 'High-speed USB data transfer' },
]

const verdictLabels: Record<string, string> = {
  compatible: 'Compatible for selected requirements',
  partially_compatible: 'Partially compatible',
  incompatible: 'Incompatible',
  needs_more_information: 'Needs more information',
}

type Step = 'laptop' | 'dock' | 'describe' | 'requirements' | 'results'

type Message = {
  speaker: 'assistant' | 'you'
  text: string
}

export default function AssistantDemo() {
  const [step, setStep] = useState<Step>('laptop')
  const [laptopId, setLaptopId] = useState('')
  const [dockId, setDockId] = useState('')
  const [userNeed, setUserNeed] = useState('')
  const [selectedRequirements, setSelectedRequirements] = useState<
    Capability[]
  >([])
  const [report, setReport] = useState<CompatibilityReport | null>(null)
  const [error, setError] = useState('')

  const [messages, setMessages] = useState<Message[]>([
    {
      speaker: 'assistant',
      text: "Hi! I'm FitsRight. I'll help you find out whether a docking station meets your needs. First, which laptop are you using?",
    },
  ])

  const selectedLaptop = laptops.find((item) => item.id === laptopId)
  const selectedDock = docks.find((item) => item.id === dockId)

  function addMessage(speaker: Message['speaker'], text: string) {
    setMessages((current) => [...current, { speaker, text }])
  }

  function continueFromLaptop() {
    if (!selectedLaptop) {
      setError('Please select your laptop first.')
      return
    }

    setError('')
    addMessage('you', selectedLaptop.name)
    addMessage(
      'assistant',
      'Got it! Which docking station or USB hub are you considering?',
    )
    setStep('dock')
  }

  function continueFromDock() {
    if (!selectedDock) {
      setError('Please select a dock from the catalogue.')
      return
    }

    setError('')
    addMessage('you', selectedDock.name)
    addMessage(
      'assistant',
      "Now tell me in your own words what you need your setup to do. I'll suggest the relevant requirements for you to confirm.",
    )
    setStep('describe')
  }

  function analyseRequest() {
    const text = userNeed.trim().toLowerCase()

    if (!text) {
      setError('Describe what you want your setup to do.')
      return
    }

    const detected = new Set<Capability>()

    if (
      /\b(charge|charging|charger|power delivery|battery)\b/.test(text) ||
      /\bpower my laptop\b/.test(text)
    ) {
      detected.add('charging')
    }

    const multipleDisplays =
      /\b(dual|two|2|three|3|multiple|several)\b.{0,45}\b(monitors?|displays?|screens?)\b/.test(
        text,
      ) ||
      /\b(second|third)\s+(monitor|display|screen)\b/.test(text) ||
      /\bmultiple\s+(external\s+)?(monitors?|displays?|screens?)\b/.test(
        text,
      )

    if (multipleDisplays) {
      detected.add('multiple-displays')
    } else if (
      /\b(monitor|display|screen|hdmi|displayport|projector)\b/.test(text) ||
      /\bexternal\s+video\b/.test(text)
    ) {
      detected.add('external-display')
    }

    if (
      /\b(data transfer|transfer files|copy files|high[- ]speed data|usb data|fast file|40\s*gbps)\b/.test(
        text,
      )
    ) {
      detected.add('high-speed-data')
    }

    if (detected.size === 0) {
      setError(
        "I couldn't identify a requirement confidently. Try mentioning charging, an external display, multiple monitors, or high-speed data transfer.",
      )
      return
    }

    const suggested = requirements
      .filter((item) => detected.has(item.id))
      .map((item) => item.id)

    setSelectedRequirements(suggested)
    setError('')

    addMessage('you', userNeed.trim())
    addMessage(
      'assistant',
      `I understood ${suggested.length} requirement${suggested.length === 1 ? '' : 's'}. Please review my suggestions below. You can change them before I run the compatibility check.`,
    )

    setStep('requirements')
  }

  function toggleRequirement(id: Capability) {
    setSelectedRequirements((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
    setError('')
  }

  function runCompatibilityCheck() {
    if (!selectedLaptop || !selectedDock) {
      setError('Please select both devices before continuing.')
      return
    }

    if (selectedRequirements.length === 0) {
      setError('Choose at least one must-have requirement.')
      return
    }

    const result = checkCompatibility({
      laptop: selectedLaptop,
      dock: selectedDock,
      mustHave: selectedRequirements,
      optional: [],
    })

    const selectedLabels = selectedRequirements
      .map((id) => requirements.find((item) => item.id === id)?.label)
      .filter(Boolean)
      .join('; ')

    setReport(result)

    addMessage(
      'you',
      `My confirmed must-haves are: ${selectedLabels}.`,
    )

    addMessage(
      'assistant',
      `${verdictLabels[result.verdict]}. ${result.summary}`,
    )

    setStep('results')
    setError('')
  }

  function startOver() {
    setStep('laptop')
    setLaptopId('')
    setDockId('')
    setUserNeed('')
    setSelectedRequirements([])
    setReport(null)
    setError('')

    setMessages([
      {
        speaker: 'assistant',
        text: "Let's check another setup! Which laptop are you using?",
      },
    ])
  }

  return (
    <section className="assistant-demo" id="fitsright-assistant">
      <div className="assistant-demo-heading">
        <p className="card-eyebrow">FITSRIGHT ASSISTANT</p>
        <h2>Let's talk compatibility.</h2>
        <p>
          Explain what you need, confirm the suggested requirements, and
          receive a compatibility report based on the current catalogue.
        </p>
      </div>

      <div className="assistant-chat-window" aria-live="polite">
        {messages.map((message, index) => (
          <div
            className={`assistant-message ${message.speaker}`}
            key={`${index}-${message.speaker}`}
          >
            <span className="assistant-speaker">
              {message.speaker === 'assistant' ? 'FitsRight' : 'You'}
            </span>
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <div className="assistant-controls">
        {step === 'laptop' && (
          <>
            <label htmlFor="assistant-laptop">Your laptop</label>

            <select
              id="assistant-laptop"
              value={laptopId}
              onChange={(event) => setLaptopId(event.target.value)}
            >
              <option value="">Choose a laptop...</option>

              {laptops.map((laptop) => (
                <option key={laptop.id} value={laptop.id}>
                  {laptop.name}
                </option>
              ))}
            </select>

            <button
              className="primary-button"
              type="button"
              onClick={continueFromLaptop}
            >
              Continue <span>→</span>
            </button>
          </>
        )}

        {step === 'dock' && (
          <>
            <label htmlFor="assistant-dock">
              Your docking station or USB hub
            </label>

            <select
              id="assistant-dock"
              value={dockId}
              onChange={(event) => setDockId(event.target.value)}
            >
              <option value="">Choose a dock...</option>

              {docks.map((dock) => (
                <option key={dock.id} value={dock.id}>
                  {dock.name}
                </option>
              ))}
            </select>

            <button
              className="primary-button"
              type="button"
              onClick={continueFromDock}
            >
              Continue <span>→</span>
            </button>
          </>
        )}

        {step === 'describe' && (
          <>
            <label htmlFor="assistant-needs">
              Describe what you need
            </label>

            <textarea
              id="assistant-needs"
              rows={4}
              value={userNeed}
              onChange={(event) => {
                setUserNeed(event.target.value)
                setError('')
              }}
              placeholder="Example: I need to charge my laptop and connect two external monitors."
            />

            <p className="assistant-disclaimer">
              Your description is analysed with local keyword rules in
              this prototype. Review the suggestions before checking.
            </p>

            <button
              className="primary-button"
              type="button"
              onClick={analyseRequest}
            >
              Understand my needs <span>→</span>
            </button>
          </>
        )}

        {step === 'requirements' && (
          <>
            <fieldset>
              <legend>Are these your must-have requirements?</legend>

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

            <button
              className="primary-button"
              type="button"
              onClick={runCompatibilityCheck}
            >
              Check my compatibility <span>→</span>
            </button>
          </>
        )}

        {error && (
          <p className="assistant-error" role="alert">
            {error}
          </p>
        )}
      </div>

      {report && selectedLaptop && selectedDock && (
        <div className="assistant-report">
          <p className="card-eyebrow">YOUR COMPATIBILITY REPORT</p>
          <h3>{verdictLabels[report.verdict]}</h3>
          <p>{report.summary}</p>

          <div className="notice-box">
            <strong>What this result means</strong>
            <p>
              This result applies only to your selected requirements and the
              evidence recorded in the catalogue. Check your exact monitor
              resolutions, refresh rates, cables, and charging requirements
              before purchasing. Unknown specifications are not proof of
              compatibility.
            </p>
          </div>

          <h4>Requirement-by-requirement results</h4>

          {report.requirements.map((item) => (
            <article
              className="assistant-requirement"
              key={`${item.capability}-${item.importance}`}
            >
              <h5>
                {requirements.find(
                  (requirement) => requirement.id === item.capability,
                )?.label ?? item.capability}
              </h5>

              <p>
                <strong>Importance:</strong> {item.importance}
              </p>

              <p>
                <strong>Status:</strong> {item.status}
              </p>

              <p>{item.explanation}</p>

              {item.evidence.length > 0 && (
                <ul>
                  {item.evidence.map((evidence, index) => (
                    <li key={`${evidence.url}-${index}`}>
                      <a
                        href={evidence.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {evidence.manufacturer}: {evidence.documentTitle}
                      </a>
                      <p>{evidence.detail}</p>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}

          {report.nextSteps.length > 0 && (
            <>
              <h4>Recommended next steps</h4>
              <ul>
                {report.nextSteps.map((item, index) => (
                  <li key={`${index}-${item}`}>{item}</li>
                ))}
              </ul>
            </>
          )}

          <button
            className="secondary-button"
            type="button"
            onClick={startOver}
          >
            Check another setup
          </button>
        </div>
      )}

      <p className="assistant-disclaimer">
        Prototype: this is a guided, rules-based assistant. It does not yet
        use a live AI model or connect directly to Alexa+.
      </p>
    </section>
  )
}