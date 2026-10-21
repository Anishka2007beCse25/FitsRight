import type {
  Capability,
  CapabilityRecord,
  DeviceRecord,
  Evidence,
} from './types'

/**
 * FitsRight Device Catalogue
 *
 * Device-level specifications and pairing-specific compatibility
 * are deliberately kept separate.
 *
 * "unknown" does not mean incompatible. It means the complete
 * laptop + dock requirement has not yet been established.
 */

const capabilities: Capability[] = [
  'charging',
  'external-display',
  'multiple-displays',
  'high-speed-data',
]

type CapabilityNote = {
  explanation: string
  evidence?: Evidence[]
}

function makeEvidence(
  manufacturer: string,
  documentTitle: string,
  url: string,
  detail: string,
): Evidence {
  return { manufacturer, documentTitle, url, detail }
}

const defaultExplanations: Record<Capability, string> = {
  charging:
    'Charging has not been verified for the selected laptop and dock combination.',

  'external-display':
    'External-display compatibility has not been verified for the selected laptop and dock combination.',

  'multiple-displays':
    'Multiple-display compatibility has not been verified for the selected laptop and dock combination.',

  'high-speed-data':
    'High-speed data compatibility has not been verified for the selected laptop and dock combination.',
}

function createUnknownCapabilities(
  notes: Partial<Record<Capability, CapabilityNote>> = {},
): Record<Capability, CapabilityRecord> {
  return Object.fromEntries(
    capabilities.map((capability) => {
      const note = notes[capability]

      return [
        capability,
        {
          status: 'unknown',
          explanation:
            note?.explanation ?? defaultExplanations[capability],
          evidence: note?.evidence ?? [],
        },
      ]
    }),
  ) as Record<Capability, CapabilityRecord>
}

/* ---------------------------------------------------------
   LAPTOP EVIDENCE
   These records provide context. Pair verification is still
   required before the engine can return a definitive verdict.
--------------------------------------------------------- */

const xpsOwnerManual = makeEvidence(
  'Dell',
  'XPS 13 9340 Owner’s Manual — Left View',
  'https://www.dell.com/support/manuals/en-us/xps-13-9340-laptop/xps-13-9340_owners_manual/left?guid=guid-e94d0ace-22f5-4f89-a8ec-0b9e27e601ce&lang=en-us',
  'Consult the manual for the laptop port layout and documented specifications.',
)

const xpsDisplayGuide = makeEvidence(
  'Dell',
  'XPS 13 9340 External Display Connection Guide',
  'https://www.dell.com/support/manuals/en-us/xps-13-9340-laptop/xps-13-9340_external_display_guide/integrated-graphics?guid=guid-cfa87f60-cc79-4e5e-b7cb-3ae2dbdab7b0&lang=en-us',
  'Use the guide to investigate display connection options and limitations.',
)

const xpsDisplayMatrix = makeEvidence(
  'Dell',
  'XPS 13 9340 Owner’s Manual — Multiple Display Support Matrix',
  'https://www.dell.com/support/manuals/en-in/xps-13-9340-laptop/xps-13-9340_owners_manual/multiple-display-support-matrix?guid=guid-e850a5d0-467b-492e-a4db-ea21a0d46361&lang=en-us',
  'Consult the documented display matrix for multi-monitor configuration limits.',
)

const macBookAirSpecs = makeEvidence(
  'Apple',
  'MacBook Air (13-inch, M4, 2025) — Tech Specs',
  'https://support.apple.com/en-in/122209',
  'Apple documents this model’s Thunderbolt 4 ports and charging capabilities.',
)

const thinkPadSpecs = makeEvidence(
  'Lenovo',
  'ThinkPad T14 Gen 5 Intel Specifications',
  'https://psref.lenovo.com/Detail/ThinkPad_T14_Gen_5_Intel',
  'Consult Lenovo’s specification sheet for ports, data capabilities, charging and display output.',
)

/* ---------------------------------------------------------
   DOCK EVIDENCE
--------------------------------------------------------- */

const wd22Specs = makeEvidence(
  'Dell',
  'Dell Thunderbolt Dock WD22TB4 User Guide — Product Specifications',
  'https://www.dell.com/support/manuals/en-us/wd22tb4-dock/dell_wd22tb4_userguide/product-specifications?guid=guid-bb63fcdf-357e-408c-82f1-c7c56e8d5b4e&lang=en-us',
  'Consult Dell’s dock specifications for video connections, data ports and power delivery.',
)

const wd22DisplayTable = makeEvidence(
  'Dell',
  'Dell Thunderbolt Dock WD22TB4 User Guide — Display Resolution Table',
  'https://www.dell.com/support/manuals/en-sg/wd22tb4-dock/dell_wd22tb4_userguide/display-resolution-table?guid=guid-fafc77a4-c95f-44df-92ad-608231d11cd9&lang=en-us',
  'Check the documented resolution limits for the ports used simultaneously.',
)

const ud22Guide = makeEvidence(
  'Dell',
  'Dell Universal Dock UD22 User Guide',
  'https://www.dell.com/support/product-details/en-in/product/dell-universal-dock-ud22/resources/manuals',
  'Consult the official user guide for the dock’s port and operating requirements.',
)

const ud22DisplayNote = makeEvidence(
  'Dell',
  'Dell Universal Dock UD22 — Multi-Monitor Troubleshooting',
  'https://www.dell.com/support/kbdoc/en-in/000202555/only-two-monitors-display-on-dell-universal-dock-ud22',
  'Dell documents the DisplayLink driver requirement for three- and four-monitor configurations.',
)

const ankerSpecs = makeEvidence(
  'Anker',
  'Anker 555 USB-C Hub (8-in-1) — Specifications',
  'https://www.anker.com/products/a8383',
  'Consult Anker’s official specifications for laptop power delivery, HDMI output and USB data ports.',
)

/* ---------------------------------------------------------
   LAPTOP CATALOGUE
--------------------------------------------------------- */

export const laptops: DeviceRecord[] = [
  {
    id: 'dell-xps-13-9340',
    name: 'Dell XPS 13 (9340)',
    manufacturer: 'Dell',
    modelVerified: true,
    capabilities: createUnknownCapabilities({
      charging: {
        explanation:
          'Dell documents Power Delivery support on the XPS 13 (9340). Dock-to-laptop charging still needs pairing-specific verification.',
        evidence: [xpsOwnerManual],
      },
      'external-display': {
        explanation:
          'Dell documents external-display connectivity. The selected dock and monitor configuration must still be checked.',
        evidence: [xpsDisplayGuide],
      },
      'multiple-displays': {
        explanation:
          'Dell documents multi-display configurations subject to documented connection limits.',
        evidence: [xpsDisplayMatrix, xpsDisplayGuide],
      },
      'high-speed-data': {
        explanation:
          'Dell documents USB4 and Thunderbolt 4 data capabilities. End-to-end speed depends on the full connection.',
        evidence: [xpsOwnerManual],
      },
    }),
  },

  {
    id: 'macbook-air-m4-2025',
    name: 'Apple MacBook Air 13-inch (M4, 2025)',
    manufacturer: 'Apple',
    modelVerified: true,
    capabilities: createUnknownCapabilities({
      charging: {
        explanation:
          'Apple documents charging through the MacBook Air M4 Thunderbolt 4 USB-C ports. Dock pairing and actual power delivery must still be considered.',
        evidence: [macBookAirSpecs],
      },
      'external-display': {
        explanation:
          'Apple documents external-display support. The number of displays and supported resolutions depend on the Mac model and connection arrangement.',
        evidence: [macBookAirSpecs],
      },
      'multiple-displays': {
        explanation:
          'Apple documents display support for this MacBook model. Verify the intended monitor arrangement and docking-station behaviour before drawing a conclusion.',
        evidence: [macBookAirSpecs],
      },
      'high-speed-data': {
        explanation:
          'Apple documents Thunderbolt 4 and USB4 data capabilities. Actual throughput depends on the connected devices and complete connection.',
        evidence: [macBookAirSpecs],
      },
    }),
  },

  {
    id: 'thinkpad-t14-gen5-intel',
    name: 'Lenovo ThinkPad T14 Gen 5 (Intel)',
    manufacturer: 'Lenovo',
    modelVerified: true,
    capabilities: createUnknownCapabilities({
      charging: {
        explanation:
          'Lenovo documents USB Power Delivery capabilities. The charging result for a selected dock depends on the complete power arrangement.',
        evidence: [thinkPadSpecs],
      },
      'external-display': {
        explanation:
          'Lenovo documents display-capable Thunderbolt/USB-C connectivity. The complete laptop-and-dock arrangement still requires checking.',
        evidence: [thinkPadSpecs],
      },
      'multiple-displays': {
        explanation:
          'Lenovo documents display output capabilities. Maximum monitor count, resolution and refresh rate depend on the full setup.',
        evidence: [thinkPadSpecs],
      },
      'high-speed-data': {
        explanation:
          'Lenovo documents Thunderbolt/USB4 data connectivity. Actual data speed depends on the connected device and connection.',
        evidence: [thinkPadSpecs],
      },
    }),
  },

  {
    id: 'asus-zenbook-14-oled-ux3405',
    name: 'ASUS Zenbook 14 OLED (UX3405)',
    manufacturer: 'ASUS',
    modelVerified: false,
    capabilities: createUnknownCapabilities(),
  },

  {
    id: 'macbook-pro-14-m4-2024',
    name: 'Apple MacBook Pro 14-inch (M4, 2024)',
    manufacturer: 'Apple',
    modelVerified: false,
    capabilities: createUnknownCapabilities(),
  },

  {
    id: 'surface-laptop-7-138-snapdragon',
    name: 'Microsoft Surface Laptop 7th Edition 13.8-inch (Snapdragon X)',
    manufacturer: 'Microsoft',
    modelVerified: false,
    capabilities: createUnknownCapabilities(),
  },

  {
    id: 'hp-spectre-x360-14-eu0000',
    name: 'HP Spectre x360 14 (14-eu0000 series)',
    manufacturer: 'HP',
    modelVerified: false,
    capabilities: createUnknownCapabilities(),
  },

  {
    id: 'acer-swift-go-14-sfg14-73',
    name: 'Acer Swift Go 14 (SFG14-73)',
    manufacturer: 'Acer',
    modelVerified: false,
    capabilities: createUnknownCapabilities(),
  },
]

/* ---------------------------------------------------------
   DOCK CATALOGUE
   All component capabilities remain unknown here.
   The compatibility engine uses its explicit pairing records
   to determine which claims can be returned as supported.
--------------------------------------------------------- */

export const docks: DeviceRecord[] = [
  {
    id: 'dell-wd22tb4',
    name: 'Dell Thunderbolt Dock WD22TB4',
    manufacturer: 'Dell',
    modelVerified: true,
    capabilities: createUnknownCapabilities({
      charging: {
        explanation:
          'Dell documents the dock power-delivery specifications. The power accepted by the connected laptop must be considered.',
        evidence: [wd22Specs],
      },
      'external-display': {
        explanation:
          'The dock has documented display connections. Supported resolutions and refresh rates depend on the host and port arrangement.',
        evidence: [wd22Specs, wd22DisplayTable],
      },
      'multiple-displays': {
        explanation:
          'The dock supports documented multi-display configurations. Exact limits depend on the host and ports used simultaneously.',
        evidence: [wd22Specs, wd22DisplayTable],
      },
      'high-speed-data': {
        explanation:
          'The dock documents Thunderbolt and USB data ports. End-to-end data speed depends on the host, cable and connected device.',
        evidence: [wd22Specs],
      },
    }),
  },

  {
    id: 'dell-ud22',
    name: 'Dell Universal Dock UD22',
    manufacturer: 'Dell',
    modelVerified: true,
    capabilities: createUnknownCapabilities({
      charging: {
        explanation:
          'Dell documents USB-C laptop charging. Compatibility with a specific laptop and its power requirements remains unverified.',
        evidence: [ud22Guide],
      },
      'external-display': {
        explanation:
          'Dell documents display connectivity on this dock. Host video capabilities and required software must be checked.',
        evidence: [ud22Guide],
      },
      'multiple-displays': {
        explanation:
          'The dock supports documented multi-display configurations. Three- and four-monitor configurations have DisplayLink driver requirements.',
        evidence: [ud22Guide, ud22DisplayNote],
      },
      'high-speed-data': {
        explanation:
          'Dell documents USB data connectivity. Confirm the relevant port specifications for the intended setup.',
        evidence: [ud22Guide],
      },
    }),
  },

  {
    id: 'anker-555-a8383',
    name: 'Anker 555 USB-C Hub (8-in-1)',
    manufacturer: 'Anker',
    modelVerified: true,
    capabilities: createUnknownCapabilities({
      charging: {
        explanation:
          'Anker documents up to 85 W laptop power delivery through this hub. The actual power received by the laptop depends on the complete connection.',
        evidence: [ankerSpecs],
      },
      'external-display': {
        explanation:
          'Anker documents HDMI display output. The connected laptop and monitor must be checked for compatibility.',
        evidence: [ankerSpecs],
      },
      'multiple-displays': {
        explanation:
          'Anker documents support for multiple displays. The exact number of displays and their configurations depend on the host and connected devices.',
        evidence: [ankerSpecs],
      },
      'high-speed-data': {
        explanation:
          'Anker documents USB data connectivity. Confirm the relevant port specifications for the intended setup.',
        evidence: [ankerSpecs],
      },
    }),
  },
]