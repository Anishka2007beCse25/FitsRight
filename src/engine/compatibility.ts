/**
 * FitsRight Compatibility Engine
 *
 * Compatibility is evaluated using explicit laptop/dock pairing
 * records. Device-level specifications alone are not sufficient.
 *
 * Rules:
 * - Unknown never means supported.
 * - Unverified catalogue entries cannot receive definitive verdicts.
 * - Pairing claims must contain manufacturer evidence.
 * - Missing or unknown pairing capabilities stay unknown.
 */

export type Verdict =
  | 'compatible'
  | 'partially_compatible'
  | 'incompatible'
  | 'needs_more_information'

export type Capability =
  | 'charging'
  | 'external-display'
  | 'multiple-displays'
  | 'high-speed-data'

export type SupportStatus =
  | 'supported'
  | 'unsupported'
  | 'unknown'

export interface Evidence {
  manufacturer: string
  documentTitle: string
  url: string
  detail: string
}

export interface CapabilityRecord {
  status: SupportStatus
  explanation: string
  evidence: Evidence[]
}

export interface DeviceRecord {
  id: string
  name: string
  manufacturer: string
  modelVerified: boolean
  capabilities: Partial<Record<Capability, CapabilityRecord>>
}

export interface CompatibilityRequest {
  laptop: DeviceRecord
  dock: DeviceRecord
  mustHave: Capability[]
  optional: Capability[]
}

export interface RequirementResult {
  capability: Capability
  importance: 'must-have' | 'optional'
  status: SupportStatus
  explanation: string
  evidence: Evidence[]
}

export interface CompatibilityReport {
  verdict: Verdict
  summary: string
  requirements: RequirementResult[]
  nextSteps: string[]
}

export interface PairVerification {
  laptopId: string
  dockId: string
  capabilities: Partial<Record<Capability, CapabilityRecord>>
}

function makeEvidence(
  manufacturer: string,
  documentTitle: string,
  url: string,
  detail: string,
): Evidence {
  return { manufacturer, documentTitle, url, detail }
}

function supported(
  explanation: string,
  ...evidence: Evidence[]
): CapabilityRecord {
  return {
    status: 'supported',
    explanation,
    evidence,
  }
}

/**
 * Evidence links.
 */
const xpsDockCompatibility = makeEvidence(
  'Dell',
  'XPS 13 9340 Re-imaging Guide — Dell Docking Stations',
  'https://www.dell.com/support/manuals/en-us/xps-13-9340-laptop/xps-13-9340_reimage_guide/dell-docking-stations?guid=guid-bf535b27-876d-4a28-9bd5-5f4c96ea1c08&lang=en-us',
  'Dell lists the WD22TB4 among the docking stations that can connect to the XPS 13 (9340).',
)

const xpsDisplayGuide = makeEvidence(
  'Dell',
  'XPS 13 9340 External Display Connection Guide',
  'https://www.dell.com/support/manuals/en-us/xps-13-9340-laptop/xps-13-9340_external_display_guide/integrated-graphics?guid=guid-cfa87f60-cc79-4e5e-b7cb-3ae2dbdab7b0&lang=en-us',
  'Consult the guide for supported external-display connection configurations.',
)

const xpsDisplayMatrix = makeEvidence(
  'Dell',
  'XPS 13 9340 Owner’s Manual — Multiple Display Support Matrix',
  'https://www.dell.com/support/manuals/en-in/xps-13-9340-laptop/xps-13-9340_owners_manual/multiple-display-support-matrix?guid=guid-e850a5d0-467b-492e-a4db-ea21a0d46361&lang=en-us',
  'Use the manufacturer matrix to check supported multi-display arrangements.',
)

const wd22Specs = makeEvidence(
  'Dell',
  'Dell Thunderbolt Dock WD22TB4 User Guide — Product Specifications',
  'https://www.dell.com/support/manuals/en-us/wd22tb4-dock/dell_wd22tb4_userguide/product-specifications?guid=guid-bb63fcdf-357e-408c-82f1-c7c56e8d5b4e&lang=en-us',
  'Dell documents the dock ports, data connectivity and power-delivery specifications.',
)

const wd22DisplayTable = makeEvidence(
  'Dell',
  'Dell Thunderbolt Dock WD22TB4 User Guide — Display Resolution Table',
  'https://www.dell.com/support/manuals/en-sg/wd22tb4-dock/dell_wd22tb4_userguide/display-resolution-table?guid=guid-fafc77a4-c95f-44df-92ad-608231d11cd9&lang=en-us',
  'Consult this table for supported resolutions and port combinations.',
)

const thirdPartyDockCompatibility = makeEvidence(
  'Dell',
  'Industry Standard Compatibility with Dell USB Type-C and Thunderbolt Docks',
  'https://www.dell.com/support/kbdoc/en-ap/000181877/industry-standard-compatibility-with-dell-usb-type-c-and-thunderbolt-docks-wd22tb4-wd19-wd19s-wd19tb-wd19tbs-docking-stations',
  'Dell documents industry-standard docking support for compatible non-Dell laptops. Some functions and power delivery can differ by host.',
)

const thinkPadSpecs = makeEvidence(
  'Lenovo',
  'ThinkPad T14 Gen 5 Intel Specifications',
  'https://psref.lenovo.com/Detail/ThinkPad_T14_Gen_5_Intel',
  'Lenovo documents the model’s Thunderbolt 4/USB4 connectivity and DisplayPort/USB Power Delivery capabilities.',
)

const macBookAirSpecs = makeEvidence(
  'Apple',
  'MacBook Air (13-inch, M4, 2025) — Tech Specs',
  'https://support.apple.com/en-in/122209',
  'Apple documents the MacBook Air’s Thunderbolt 4 USB-C ports and supported charging capabilities.',
)

/**
 * Explicit pairing records.
 *
 * Only requirements represented below can produce a definitive
 * compatibility result. Any omitted requirement remains unknown.
 *
 * Manufacturer documentation does not replace checking the user's
 * exact monitor, cable, resolution, refresh rate or power requirements.
 */
const pairVerifications: PairVerification[] = [
  {
    laptopId: 'dell-xps-13-9340',
    dockId: 'dell-wd22tb4',

    capabilities: {
      charging: supported(
        'Dell lists the WD22TB4 as connectable to the XPS 13 (9340) and documents Power Delivery. The amount of power actually delivered depends on the dock power adapter and laptop requirements.',
        xpsDockCompatibility,
        wd22Specs,
      ),

      'external-display': supported(
        'Dell documents the WD22TB4 as a compatible dock for the XPS 13 (9340) and provides external-display connection guidance. Exact monitor resolutions, refresh rates, cables and port arrangements still require checking.',
        xpsDockCompatibility,
        xpsDisplayGuide,
        wd22DisplayTable,
      ),

      'multiple-displays': supported(
        'Dell documents multi-display configurations for the XPS 13 (9340) and describes the WD22TB4 display limits. This is not a guarantee for every possible monitor or port arrangement.',
        xpsDockCompatibility,
        xpsDisplayMatrix,
        wd22DisplayTable,
      ),
    },
  },

  {
    laptopId: 'thinkpad-t14-gen5-intel',
    dockId: 'dell-wd22tb4',

    capabilities: {
      charging: supported(
        'The ThinkPad specifications document USB Power Delivery through its USB-C/Thunderbolt ports, while Dell documents the WD22TB4 for compatible non-Dell hosts. Actual charging power must be checked against the specific laptop configuration.',
        thinkPadSpecs,
        thirdPartyDockCompatibility,
      ),

      'external-display': supported(
        'Lenovo documents display-capable Thunderbolt connectivity, and Dell documents industry-standard docking support for compatible non-Dell laptops. Verify the intended monitor resolution, refresh rate, cable and ports.',
        thinkPadSpecs,
        thirdPartyDockCompatibility,
        wd22DisplayTable,
      ),

      'multiple-displays': supported(
        'The ThinkPad has documented Thunderbolt/DisplayPort connectivity, and Dell documents external-display operation with compatible non-Dell systems. Exact multi-monitor limits depend on the active port combination and display configuration.',
        thinkPadSpecs,
        thirdPartyDockCompatibility,
        wd22DisplayTable,
      ),

      'high-speed-data': supported(
        'Both product specifications document Thunderbolt 4 connectivity. The interface supports up to 40 Gbps, but actual throughput depends on the port, cable, storage device and workload.',
        thinkPadSpecs,
        wd22Specs,
      ),
    },
  },

  {
    laptopId: 'macbook-air-m4-2025',
    dockId: 'dell-wd22tb4',

    capabilities: {
      charging: supported(
        'Apple documents charging through the MacBook Air M4 USB-C Thunderbolt 4 ports, and Dell documents Power Delivery through the WD22TB4 family for compatible Apple USB-C hosts. This is documentation-based compatibility, not a physical test of your exact setup. Confirm the power requirements before purchase.',
        macBookAirSpecs,
        thirdPartyDockCompatibility,
        wd22Specs,
      ),
    },
  },
]

function uniqueEvidence(evidence: Evidence[]): Evidence[] {
  const seen = new Set<string>()

  return evidence.filter((item) => {
    const key =
      `${item.manufacturer}|${item.documentTitle}|${item.url}`

    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

function getDeviceEvidence(
  laptop: DeviceRecord,
  dock: DeviceRecord,
  capability: Capability,
): Evidence[] {
  return uniqueEvidence([
    ...(laptop.capabilities[capability]?.evidence ?? []),
    ...(dock.capabilities[capability]?.evidence ?? []),
  ])
}

function evaluateRequirement(
  laptop: DeviceRecord,
  dock: DeviceRecord,
  capability: Capability,
  importance: 'must-have' | 'optional',
): RequirementResult {
  const deviceEvidence = getDeviceEvidence(
    laptop,
    dock,
    capability,
  )

  if (!laptop.modelVerified || !dock.modelVerified) {
    const reasons: string[] = []

    if (!laptop.modelVerified) {
      reasons.push(
        `${laptop.name} has not been fully verified in the catalogue.`,
      )
    }

    if (!dock.modelVerified) {
      reasons.push(
        `${dock.name} has not been fully verified in the catalogue.`,
      )
    }

    return {
      capability,
      importance,
      status: 'unknown',
      explanation:
        `${reasons.join(' ')} A definitive verdict is not available.`,
      evidence: deviceEvidence,
    }
  }

  const pairing = pairVerifications.find(
    (item) =>
      item.laptopId === laptop.id &&
      item.dockId === dock.id,
  )

  if (!pairing) {
    return {
      capability,
      importance,
      status: 'unknown',
      explanation:
        `FitsRight has no explicit pairing record for ${capability} ` +
        `between ${laptop.name} and ${dock.name}. ` +
        'Individual device specifications do not establish this exact pairing.',
      evidence: deviceEvidence,
    }
  }

  const pairingCapability = pairing.capabilities[capability]

  if (
    !pairingCapability ||
    pairingCapability.status === 'unknown'
  ) {
    return {
      capability,
      importance,
      status: 'unknown',
      explanation:
        pairingCapability?.explanation ??
        `Pair-specific evidence for ${capability} has not been recorded.`,
      evidence: uniqueEvidence([
        ...(pairingCapability?.evidence ?? []),
        ...deviceEvidence,
      ]),
    }
  }

  if (pairingCapability.evidence.length === 0) {
    return {
      capability,
      importance,
      status: 'unknown',
      explanation:
        'The pairing record has no supporting evidence. ' +
        'FitsRight will not use this claim to determine compatibility.',
      evidence: deviceEvidence,
    }
  }

  return {
    capability,
    importance,
    status: pairingCapability.status,
    explanation: pairingCapability.explanation,
    evidence: uniqueEvidence(pairingCapability.evidence),
  }
}

export function checkCompatibility(
  request: CompatibilityRequest,
): CompatibilityReport {
  const { laptop, dock, mustHave, optional } = request

  const uniqueMustHave = [...new Set(mustHave)]

  const uniqueOptional = [...new Set(optional)].filter(
    (capability) => !uniqueMustHave.includes(capability),
  )

  if (uniqueMustHave.length === 0) {
    return {
      verdict: 'needs_more_information',
      summary:
        'Select at least one must-have requirement before checking compatibility.',
      requirements: [],
      nextSteps: [
        'Choose at least one essential capability.',
        'Verify the exact laptop and dock models.',
      ],
    }
  }

  const requirements: RequirementResult[] = [
    ...uniqueMustHave.map((capability) =>
      evaluateRequirement(
        laptop,
        dock,
        capability,
        'must-have',
      ),
    ),
    ...uniqueOptional.map((capability) =>
      evaluateRequirement(
        laptop,
        dock,
        capability,
        'optional',
      ),
    ),
  ]

  const essentialResults = requirements.filter(
    (result) => result.importance === 'must-have',
  )

  const optionalResults = requirements.filter(
    (result) => result.importance === 'optional',
  )

  const modelsVerified =
    laptop.modelVerified && dock.modelVerified

  const hasFailedEssential = essentialResults.some(
    (result) => result.status === 'unsupported',
  )

  const hasUnknownEssential = essentialResults.some(
    (result) => result.status === 'unknown',
  )

  const hasOptionalLimitation = optionalResults.some(
    (result) => result.status !== 'supported',
  )

  let verdict: Verdict
  let summary: string

  if (!modelsVerified) {
    verdict = 'needs_more_information'
    summary =
      'The exact device records are not yet verified. FitsRight needs more evidence before reaching a conclusion.'
  } else if (hasFailedEssential) {
    verdict = 'incompatible'
    summary =
      'At least one must-have is explicitly recorded as unsupported for this pairing. Review the evidence and consider an alternative.'
  } else if (hasUnknownEssential) {
    verdict = 'needs_more_information'
    summary =
      'Compatibility cannot yet be confirmed because one or more must-have requirements lack sufficient pairing evidence.'
  } else if (hasOptionalLimitation) {
    verdict = 'partially_compatible'
    summary =
      'All selected must-have requirements are supported by the pairing records, but an optional requirement is unsupported or unverified.'
  } else {
    verdict = 'compatible'
    summary =
      'Every selected must-have requirement is supported by an evidence-backed pairing record. This does not guarantee every hardware configuration or unselected feature.'
  }

  const nextSteps: string[] = []

  if (!laptop.modelVerified) {
    nextSteps.push(
      `Verify the exact ${laptop.name} catalogue record and configuration.`,
    )
  }

  if (!dock.modelVerified) {
    nextSteps.push(
      `Verify the exact ${dock.name} catalogue record and configuration.`,
    )
  }

  for (const result of requirements) {
    if (result.status === 'unsupported') {
      nextSteps.push(
        `Review the documented ${result.capability} limitation and consider an alternative.`,
      )
    } else if (result.status === 'unknown') {
      nextSteps.push(
        `Find manufacturer evidence for ${result.capability} on this exact laptop/dock pairing.`,
      )
    }
  }

  if (nextSteps.length === 0) {
    nextSteps.push(
      'Confirm that your cables, monitor arrangement and power setup match the documented configuration.',
    )
  }

  return {
    verdict,
    summary,
    requirements,
    nextSteps: [...new Set(nextSteps)],
  }
}