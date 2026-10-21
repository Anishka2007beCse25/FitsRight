export type Verdict =
  | 'compatible'
  | 'partially_compatible'
  | 'incompatible'
  | 'needs_more_information';

export type Capability =
  | 'charging'
  | 'external-display'
  | 'multiple-displays'
  | 'high-speed-data';

export type SupportStatus = 'supported' | 'unsupported' | 'unknown';

export interface Evidence {
  manufacturer: string;
  documentTitle: string;
  url: string;
  detail: string;
}

export interface CapabilityRecord {
  status: SupportStatus;
  explanation: string;
  evidence: Evidence[];
}

export interface DeviceRecord {
  id: string;
  name: string;
  manufacturer: string;
  modelVerified: boolean;
  capabilities: Partial<Record<Capability, CapabilityRecord>>;
}

export interface CompatibilityRequest {
  laptop: DeviceRecord;
  dock: DeviceRecord;
  mustHave: Capability[];
  optional: Capability[];
}

export interface RequirementResult {
  capability: Capability;
  importance: 'must-have' | 'optional';
  status: SupportStatus;
  explanation: string;
  evidence: Evidence[];
}

export interface CompatibilityReport {
  verdict: Verdict;
  summary: string;
  requirements: RequirementResult[];
  nextSteps: string[];
}