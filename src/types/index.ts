export interface Manufacturer {
  id: string;
  name: string;
  city: string;
  district: string;
  state: string;
  industry: string;
  category: string;
  status: 'Lead' | 'Prospect' | 'Customer' | 'View';
  registrationDate: string;
  daysSinceStatus: number;
}

export interface Distributor {
  id: string;
  name: string;
  city: string;
  district: string;
  state: string;
  industry: string;
  category: string;
  status: 'Lead' | 'Prospect' | 'Customer' | 'View';
  registrationDate: string;
  daysSinceStatus: number;
}

export interface Interaction {
  id: string;
  interactedBy: string;
  dateInteracted: string;
  timeElapsed: string;
  notes: string;
  mode: 'Phone' | 'FtoF';
  hasReminder: boolean;
  reminderDate?: string;
  attachments?: string[];
}

export interface Agreement {
  id: string;
  version: number;
  terms: TermsCondition[];
  status: 'Draft' | 'Generated' | 'Signed';
  createdDate: string;
  signedDate?: string;
}

export interface TermsCondition {
  id: string;
  clause: string;
  response: string;
}

export interface Invoice {
  id: string;
  type: 'Proforma' | 'Tax';
  invoiceNo: string;
  amount: number;
  commissionPercent: number;
  commissionAmount: number;
  uploadedBy: string;
  uploadDate: string;
  durationBetween?: number;
}

export interface FilterOptions {
  cities: string[];
  districts: string[];
  states: string[];
  industries: string[];
  categories: string[];
  statuses: string[];
}

export interface TermsOptions {
  clauses: string[];
  responses: Record<string, string[]>;
}