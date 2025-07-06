import type { Manufacturer, Distributor, Interaction, Agreement, Invoice, FilterOptions } from '../types';

export const mockManufacturers: Manufacturer[] = [
  {
    id: 'M001',
    name: 'Tech Solutions Pvt Ltd',
    city: 'Mumbai',
    district: 'Mumbai',
    state: 'Maharashtra',
    industry: 'Electronics',
    category: 'Manufacturing',
    registrationDate: '2023-01-15'
  },
  {
    id: 'M002',
    name: 'Global Industries Inc',
    city: 'Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    industry: 'Automotive',
    category: 'Heavy Machinery',
    registrationDate: '2023-02-20'
  },
  {
    id: 'M003',
    name: 'Green Energy Corp',
    city: 'Bangalore',
    district: 'Bangalore Urban',
    state: 'Karnataka',
    industry: 'Renewable Energy',
    category: 'Solar Panels',
    registrationDate: '2023-03-10'
  },
  {
    id: 'M004',
    name: 'Pharma Solutions Ltd',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    industry: 'Pharmaceuticals',
    category: 'Manufacturing',
    registrationDate: '2023-04-05'
  },
  {
    id: 'M005',
    name: 'Textile Mills Co',
    city: 'Kolkata',
    district: 'Kolkata',
    state: 'West Bengal',
    industry: 'Textiles',
    category: 'Manufacturing',
    registrationDate: '2023-05-12'
  },
  {
    id: 'M006',
    name: 'Auto Parts Manufacturing',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    industry: 'Automotive',
    category: 'Heavy Machinery',
    registrationDate: '2023-06-18'
  },
  {
    id: 'M007',
    name: 'Electronics Hub Ltd',
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    industry: 'Electronics',
    category: 'Manufacturing',
    registrationDate: '2023-07-22'
  }
];

export const mockDistributors: Distributor[] = [
  {
    id: 'D001',
    name: 'Metro Distributors',
    city: 'Mumbai',
    district: 'Mumbai',
    state: 'Maharashtra',
    industry: 'Electronics',
    category: 'Retail',
    status: 'Lead',
    registrationDate: '2023-04-01',
    daysSinceStatus: 25
  },
  {
    id: 'D002',
    name: 'Swift Logistics',
    city: 'Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    industry: 'Automotive',
    category: 'Distribution',
    status: 'Prospect',
    registrationDate: '2023-03-15',
    daysSinceStatus: 45
  },
  {
    id: 'D003',
    name: 'Eco Distributors',
    city: 'Bangalore',
    district: 'Bangalore Urban',
    state: 'Karnataka',
    industry: 'Renewable Energy',
    category: 'Installation',
    status: 'Customer',
    registrationDate: '2023-02-10',
    daysSinceStatus: 75
  },
  {
    id: 'D004',
    name: 'Electronics Retail Chain',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    industry: 'Electronics',
    category: 'Retail',
    status: 'Lead',
    registrationDate: '2023-05-20',
    daysSinceStatus: 15
  },
  {
    id: 'D005',
    name: 'Auto Parts Dealers',
    city: 'Kolkata',
    district: 'Kolkata',
    state: 'West Bengal',
    industry: 'Automotive',
    category: 'Distribution',
    status: 'Prospect',
    registrationDate: '2023-06-10',
    daysSinceStatus: 30
  },
  {
    id: 'D006',
    name: 'Pharma Distribution Network',
    city: 'Mumbai',
    district: 'Mumbai',
    state: 'Maharashtra',
    industry: 'Pharmaceuticals',
    category: 'Distribution',
    status: 'Customer',
    registrationDate: '2023-01-25',
    daysSinceStatus: 90
  },
  {
    id: 'D007',
    name: 'Textile Wholesale Hub',
    city: 'Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    industry: 'Textiles',
    category: 'Retail',
    status: 'View',
    registrationDate: '2022-12-15',
    daysSinceStatus: 120
  },
  {
    id: 'D008',
    name: 'Green Energy Solutions',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    industry: 'Renewable Energy',
    category: 'Installation',
    status: 'Lead',
    registrationDate: '2023-07-05',
    daysSinceStatus: 10
  },
  {
    id: 'D009',
    name: 'Electronics Mega Store',
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    industry: 'Electronics',
    category: 'Retail',
    status: 'Prospect',
    registrationDate: '2023-06-25',
    daysSinceStatus: 20
  },
  {
    id: 'D010',
    name: 'Auto Components Ltd',
    city: 'Bangalore',
    district: 'Bangalore Urban',
    state: 'Karnataka',
    industry: 'Automotive',
    category: 'Distribution',
    status: 'Customer',
    registrationDate: '2023-04-12',
    daysSinceStatus: 60
  },
  {
    id: 'D011',
    name: 'Medical Equipment Distributors',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    industry: 'Pharmaceuticals',
    category: 'Distribution',
    status: 'Lead',
    registrationDate: '2023-07-15',
    daysSinceStatus: 8
  },
  {
    id: 'D012',
    name: 'Fashion Retail Network',
    city: 'Kolkata',
    district: 'Kolkata',
    state: 'West Bengal',
    industry: 'Textiles',
    category: 'Retail',
    status: 'Prospect',
    registrationDate: '2023-05-30',
    daysSinceStatus: 35
  },
  // Additional Automotive distributors for Global Industries Inc
  {
    id: 'D013',
    name: 'Heavy Machinery Distributors',
    city: 'Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    industry: 'Automotive',
    category: 'Heavy Machinery',
    status: 'Lead',
    registrationDate: '2023-07-01',
    daysSinceStatus: 12
  },
  {
    id: 'D014',
    name: 'Industrial Equipment Solutions',
    city: 'Mumbai',
    district: 'Mumbai',
    state: 'Maharashtra',
    industry: 'Automotive',
    category: 'Heavy Machinery',
    status: 'Prospect',
    registrationDate: '2023-06-15',
    daysSinceStatus: 28
  },
  {
    id: 'D015',
    name: 'Machinery Sales Corp',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    industry: 'Automotive',
    category: 'Heavy Machinery',
    status: 'Customer',
    registrationDate: '2023-05-10',
    daysSinceStatus: 55
  },
  {
    id: 'D016',
    name: 'Auto Equipment Dealers',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    industry: 'Automotive',
    category: 'Heavy Machinery',
    status: 'View',
    registrationDate: '2023-03-20',
    daysSinceStatus: 85
  },
  // Additional Electronics distributors for Tech Solutions Pvt Ltd
  {
    id: 'D017',
    name: 'Electronics Distribution Hub',
    city: 'Mumbai',
    district: 'Mumbai',
    state: 'Maharashtra',
    industry: 'Electronics',
    category: 'Manufacturing',
    status: 'Lead',
    registrationDate: '2023-07-20',
    daysSinceStatus: 5
  },
  {
    id: 'D018',
    name: 'Tech Retail Network',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    industry: 'Electronics',
    category: 'Manufacturing',
    status: 'Prospect',
    registrationDate: '2023-06-30',
    daysSinceStatus: 25
  },
  {
    id: 'D019',
    name: 'Digital Solutions Distributors',
    city: 'Bangalore',
    district: 'Bangalore Urban',
    state: 'Karnataka',
    industry: 'Electronics',
    category: 'Manufacturing',
    status: 'Customer',
    registrationDate: '2023-05-15',
    daysSinceStatus: 50
  },
  // Additional Renewable Energy distributors for Green Energy Corp
  {
    id: 'D020',
    name: 'Solar Panel Distributors',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    industry: 'Renewable Energy',
    category: 'Solar Panels',
    status: 'Lead',
    registrationDate: '2023-07-10',
    daysSinceStatus: 15
  },
  {
    id: 'D021',
    name: 'Renewable Energy Solutions',
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    industry: 'Renewable Energy',
    category: 'Solar Panels',
    status: 'Prospect',
    registrationDate: '2023-06-20',
    daysSinceStatus: 35
  },
  // Additional Pharmaceutical distributors for Pharma Solutions Ltd
  {
    id: 'D022',
    name: 'Medical Supply Chain',
    city: 'Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    industry: 'Pharmaceuticals',
    category: 'Manufacturing',
    status: 'Customer',
    registrationDate: '2023-04-25',
    daysSinceStatus: 70
  },
  {
    id: 'D023',
    name: 'Healthcare Distribution Network',
    city: 'Kolkata',
    district: 'Kolkata',
    state: 'West Bengal',
    industry: 'Pharmaceuticals',
    category: 'Manufacturing',
    status: 'View',
    registrationDate: '2023-03-30',
    daysSinceStatus: 95
  },
  // Additional Textile distributors for Textile Mills Co
  {
    id: 'D024',
    name: 'Fabric Distribution Center',
    city: 'Mumbai',
    district: 'Mumbai',
    state: 'Maharashtra',
    industry: 'Textiles',
    category: 'Manufacturing',
    status: 'Lead',
    registrationDate: '2023-07-25',
    daysSinceStatus: 8
  },
  {
    id: 'D025',
    name: 'Textile Wholesale Network',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    industry: 'Textiles',
    category: 'Manufacturing',
    status: 'Prospect',
    registrationDate: '2023-06-05',
    daysSinceStatus: 40
  }
];

export const mockInteractions: Interaction[] = [
  {
    id: 'I001',
    interactedBy: 'John Doe',
    dateInteracted: '2024-01-15',
    timeElapsed: '2 months',
    notes: 'Initial contact made, discussed product requirements',
    mode: 'Phone',
    hasReminder: true,
    reminderDate: '2024-02-15'
  },
  {
    id: 'I002',
    interactedBy: 'Jane Smith',
    dateInteracted: '2024-02-20',
    timeElapsed: '1 month',
    notes: 'Follow-up meeting scheduled, pricing discussed',
    mode: 'FtoF',
    hasReminder: false
  }
];

export const mockAgreement: Agreement = {
  id: 'A001',
  version: 1,
  terms: [
    { id: 'T001', clause: 'Payment Terms', response: 'Net 30 days' },
    { id: 'T002', clause: 'Delivery Terms', response: 'FOB Origin' },
    { id: 'T003', clause: 'Commission Rate', response: '15%' }
  ],
  status: 'Draft',
  createdDate: '2024-01-20'
};

export const mockInvoices: Invoice[] = [
  {
    id: 'INV001',
    type: 'Proforma',
    invoiceNo: 'PRO-2024-001',
    amount: 100000,
    commissionPercent: 15,
    commissionAmount: 15000,
    uploadedBy: 'System Admin',
    uploadDate: '2024-01-25'
  },
  {
    id: 'INV002',
    type: 'Tax',
    invoiceNo: 'TAX-2024-001',
    amount: 100000,
    commissionPercent: 15,
    commissionAmount: 15000,
    uploadedBy: 'System Admin',
    uploadDate: '2024-02-05',
    durationBetween: 11
  }
];

export const filterOptions: FilterOptions = {
  cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad'],
  districts: ['Mumbai', 'New Delhi', 'Bangalore Urban', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad'],
  states: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Telangana'],
  industries: ['Electronics', 'Automotive', 'Renewable Energy', 'Pharmaceuticals', 'Textiles'],
  categories: ['Manufacturing', 'Heavy Machinery', 'Solar Panels', 'Retail', 'Distribution', 'Installation'],
  statuses: ['Lead', 'Prospect', 'Customer', 'View']
};