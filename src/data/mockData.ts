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
    status: 'Customer',
    registrationDate: '2023-01-15',
    daysSinceStatus: 180
  },
  {
    id: 'M002',
    name: 'Global Industries Inc',
    city: 'Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    industry: 'Automotive',
    category: 'Heavy Machinery',
    status: 'Prospect',
    registrationDate: '2023-02-20',
    daysSinceStatus: 150
  },
  {
    id: 'M003',
    name: 'Green Energy Corp',
    city: 'Bangalore',
    district: 'Bangalore Urban',
    state: 'Karnataka',
    industry: 'Renewable Energy',
    category: 'Solar Panels',
    status: 'Lead',
    registrationDate: '2023-03-10',
    daysSinceStatus: 135
  },
  {
    id: 'M004',
    name: 'Pharma Solutions Ltd',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    industry: 'Pharmaceuticals',
    category: 'Manufacturing',
    status: 'Customer',
    registrationDate: '2023-04-05',
    daysSinceStatus: 110
  },
  {
    id: 'M005',
    name: 'Textile Mills Co',
    city: 'Kolkata',
    district: 'Kolkata',
    state: 'West Bengal',
    industry: 'Textiles',
    category: 'Manufacturing',
    status: 'View',
    registrationDate: '2023-05-12',
    daysSinceStatus: 75
  },
  {
    id: 'M006',
    name: 'Auto Parts Manufacturing',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    industry: 'Automotive',
    category: 'Heavy Machinery',
    status: 'Lead',
    registrationDate: '2023-06-18',
    daysSinceStatus: 40
  },
  {
    id: 'M007',
    name: 'Electronics Hub Ltd',
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    industry: 'Electronics',
    category: 'Manufacturing',
    status: 'Prospect',
    registrationDate: '2023-07-22',
    daysSinceStatus: 15
  },
  // Additional manufacturers for better distributor associations
  {
    id: 'M008',
    name: 'Advanced Electronics Corp',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    industry: 'Electronics',
    category: 'Manufacturing',
    status: 'Customer',
    registrationDate: '2023-03-25',
    daysSinceStatus: 80
  },
  {
    id: 'M009',
    name: 'Solar Tech Industries',
    city: 'Mumbai',
    district: 'Mumbai',
    state: 'Maharashtra',
    industry: 'Renewable Energy',
    category: 'Solar Panels',
    status: 'Prospect',
    registrationDate: '2023-05-30',
    daysSinceStatus: 40
  },
  {
    id: 'M010',
    name: 'Medical Device Manufacturing',
    city: 'Bangalore',
    district: 'Bangalore Urban',
    state: 'Karnataka',
    industry: 'Pharmaceuticals',
    category: 'Manufacturing',
    status: 'Lead',
    registrationDate: '2023-07-01',
    daysSinceStatus: 20
  },
  {
    id: 'M011',
    name: 'Premium Textiles Ltd',
    city: 'Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    industry: 'Textiles',
    category: 'Manufacturing',
    status: 'View',
    registrationDate: '2023-04-15',
    daysSinceStatus: 100
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
  cities: [
    'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', // Maharashtra
    'Delhi', 'New Delhi', 'Gurgaon', 'Noida', 'Faridabad', // Delhi NCR
    'Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', // Karnataka
    'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', // Tamil Nadu
    'Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', // West Bengal
    'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', // Telangana
    'Kanpur', 'Lucknow', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', // Uttar Pradesh
    'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Udaipur', // Rajasthan
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar' // Gujarat
  ],
  districts: [
    'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', // Maharashtra
    'New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', // Delhi
    'Bangalore Urban', 'Mysore', 'Hubli-Dharwad', 'Dakshina Kannada', 'Belgaum', // Karnataka
    'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', // Tamil Nadu
    'Kolkata', 'Howrah', 'Burdwan', 'Asansol', 'Darjeeling', // West Bengal
    'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', // Telangana
    'Kanpur Nagar', 'Lucknow', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', // Uttar Pradesh
    'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Udaipur', // Rajasthan
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar' // Gujarat
  ],
  states: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Telangana', 'Uttar Pradesh', 'Rajasthan', 'Gujarat'],
  industries: ['F&B', 'Personal Care', 'Home Care', 'Health & Wellness', 'Baby Care'],
  categories: [
    // F&B subcategories
    'Beverages', 'Snacks & Confectionery', 'Dairy Products', 'Packaged Foods', 'Frozen Foods', 'Bakery Products',
    // Personal Care subcategories
    'Skincare', 'Haircare', 'Oral Care', 'Fragrances', 'Color Cosmetics', 'Men\'s Grooming',
    // Home Care subcategories
    'Laundry Care', 'Dishwashing', 'Surface Cleaners', 'Air Care', 'Fabric Care', 'Kitchen Care',
    // Health & Wellness subcategories
    'Vitamins & Supplements', 'Health Drinks', 'Protein Products', 'Ayurvedic Products', 'First Aid',
    // Baby Care subcategories
    'Baby Food', 'Diapers', 'Baby Skincare', 'Baby Bath', 'Feeding Accessories'
  ],
  statuses: ['Lead', 'Prospect', 'Customer', 'View']
};

// Location mapping for dependent multiselect
export const locationMapping = {
  'Maharashtra': {
    districts: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad']
  },
  'Delhi': {
    districts: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    cities: ['Delhi', 'New Delhi', 'Gurgaon', 'Noida', 'Faridabad']
  },
  'Karnataka': {
    districts: ['Bangalore Urban', 'Mysore', 'Hubli-Dharwad', 'Dakshina Kannada', 'Belgaum'],
    cities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum']
  },
  'Tamil Nadu': {
    districts: ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
    cities: ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli']
  },
  'West Bengal': {
    districts: ['Kolkata', 'Howrah', 'Burdwan', 'Asansol', 'Darjeeling'],
    cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri']
  },
  'Telangana': {
    districts: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
    cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam']
  },
  'Uttar Pradesh': {
    districts: ['Kanpur Nagar', 'Lucknow', 'Agra', 'Varanasi', 'Meerut', 'Allahabad'],
    cities: ['Kanpur', 'Lucknow', 'Agra', 'Varanasi', 'Meerut', 'Allahabad']
  },
  'Rajasthan': {
    districts: ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Udaipur'],
    cities: ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Udaipur']
  },
  'Gujarat': {
    districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar']
  }
};

// City to state/district mapping
export const cityToLocationMapping: Record<string, { state: string; district: string }> = {
  // Maharashtra
  'Mumbai': { state: 'Maharashtra', district: 'Mumbai' },
  'Pune': { state: 'Maharashtra', district: 'Pune' },
  'Nagpur': { state: 'Maharashtra', district: 'Nagpur' },
  'Nashik': { state: 'Maharashtra', district: 'Nashik' },
  'Aurangabad': { state: 'Maharashtra', district: 'Aurangabad' },
  
  // Delhi NCR
  'Delhi': { state: 'Delhi', district: 'New Delhi' },
  'New Delhi': { state: 'Delhi', district: 'New Delhi' },
  'Gurgaon': { state: 'Delhi', district: 'South Delhi' },
  'Noida': { state: 'Delhi', district: 'East Delhi' },
  'Faridabad': { state: 'Delhi', district: 'South Delhi' },
  
  // Karnataka
  'Bangalore': { state: 'Karnataka', district: 'Bangalore Urban' },
  'Mysore': { state: 'Karnataka', district: 'Mysore' },
  'Hubli': { state: 'Karnataka', district: 'Hubli-Dharwad' },
  'Mangalore': { state: 'Karnataka', district: 'Dakshina Kannada' },
  'Belgaum': { state: 'Karnataka', district: 'Belgaum' },
  
  // Tamil Nadu
  'Chennai': { state: 'Tamil Nadu', district: 'Chennai' },
  'Coimbatore': { state: 'Tamil Nadu', district: 'Coimbatore' },
  'Madurai': { state: 'Tamil Nadu', district: 'Madurai' },
  'Salem': { state: 'Tamil Nadu', district: 'Salem' },
  'Tiruchirappalli': { state: 'Tamil Nadu', district: 'Tiruchirappalli' },
  
  // West Bengal
  'Kolkata': { state: 'West Bengal', district: 'Kolkata' },
  'Howrah': { state: 'West Bengal', district: 'Howrah' },
  'Durgapur': { state: 'West Bengal', district: 'Burdwan' },
  'Asansol': { state: 'West Bengal', district: 'Asansol' },
  'Siliguri': { state: 'West Bengal', district: 'Darjeeling' },
  
  // Telangana
  'Hyderabad': { state: 'Telangana', district: 'Hyderabad' },
  'Warangal': { state: 'Telangana', district: 'Warangal' },
  'Nizamabad': { state: 'Telangana', district: 'Nizamabad' },
  'Karimnagar': { state: 'Telangana', district: 'Karimnagar' },
  'Khammam': { state: 'Telangana', district: 'Khammam' },
  
  // Uttar Pradesh
  'Kanpur': { state: 'Uttar Pradesh', district: 'Kanpur Nagar' },
  'Lucknow': { state: 'Uttar Pradesh', district: 'Lucknow' },
  'Agra': { state: 'Uttar Pradesh', district: 'Agra' },
  'Varanasi': { state: 'Uttar Pradesh', district: 'Varanasi' },
  'Meerut': { state: 'Uttar Pradesh', district: 'Meerut' },
  'Allahabad': { state: 'Uttar Pradesh', district: 'Allahabad' },
  
  // Rajasthan
  'Jaipur': { state: 'Rajasthan', district: 'Jaipur' },
  'Jodhpur': { state: 'Rajasthan', district: 'Jodhpur' },
  'Kota': { state: 'Rajasthan', district: 'Kota' },
  'Bikaner': { state: 'Rajasthan', district: 'Bikaner' },
  'Udaipur': { state: 'Rajasthan', district: 'Udaipur' },
  
  // Gujarat
  'Ahmedabad': { state: 'Gujarat', district: 'Ahmedabad' },
  'Surat': { state: 'Gujarat', district: 'Surat' },
  'Vadodara': { state: 'Gujarat', district: 'Vadodara' },
  'Rajkot': { state: 'Gujarat', district: 'Rajkot' },
  'Bhavnagar': { state: 'Gujarat', district: 'Bhavnagar' }
};

// Industry to category mapping for FMCG
export const industryToCategoryMapping: Record<string, string[]> = {
  'F&B': ['Beverages', 'Snacks & Confectionery', 'Dairy Products', 'Packaged Foods', 'Frozen Foods', 'Bakery Products'],
  'Personal Care': ['Skincare', 'Haircare', 'Oral Care', 'Fragrances', 'Color Cosmetics', 'Men\'s Grooming'],
  'Home Care': ['Laundry Care', 'Dishwashing', 'Surface Cleaners', 'Air Care', 'Fabric Care', 'Kitchen Care'],
  'Health & Wellness': ['Vitamins & Supplements', 'Health Drinks', 'Protein Products', 'Ayurvedic Products', 'First Aid'],
  'Baby Care': ['Baby Food', 'Diapers', 'Baby Skincare', 'Baby Bath', 'Feeding Accessories']
};

export const termsOptions = {
  clauses: [
    'Payment Terms',
    'Delivery Terms',
    'Commission Rate',
    'Territory Rights',
    'Minimum Order Quantity',
    'Credit Terms',
    'Return Policy',
    'Marketing Support',
    'Training Requirements',
    'Performance Targets',
    'Exclusivity Agreement',
    'Contract Duration',
    'Termination Clause',
    'Dispute Resolution',
    'Force Majeure',
    'Intellectual Property Rights',
    'Quality Standards',
    'Warranty Terms',
    'Insurance Requirements',
    'Compliance Standards'
  ],
  responses: {
    'Payment Terms': [
      'Net 30 days',
      'Net 45 days',
      'Net 60 days',
      'Advance Payment',
      '50% Advance, 50% on Delivery',
      'Letter of Credit',
      'Cash on Delivery'
    ],
    'Delivery Terms': [
      'FOB Origin',
      'FOB Destination',
      'CIF (Cost, Insurance, Freight)',
      'DDP (Delivered Duty Paid)',
      'EXW (Ex Works)',
      'FCA (Free Carrier)',
      'CPT (Carriage Paid To)'
    ],
    'Commission Rate': [
      '10%',
      '12%',
      '15%',
      '18%',
      '20%',
      '25%',
      'Tiered: 15-20%',
      'Volume Based'
    ],
    'Territory Rights': [
      'Exclusive - State Level',
      'Exclusive - District Level',
      'Exclusive - City Level',
      'Non-Exclusive',
      'Regional Exclusive',
      'National Non-Exclusive'
    ],
    'Minimum Order Quantity': [
      '100 units per month',
      '500 units per month',
      '1000 units per month',
      '₹1,00,000 per month',
      '₹5,00,000 per month',
      '₹10,00,000 per month',
      'No minimum requirement'
    ],
    'Credit Terms': [
      'No Credit Facility',
      '₹1,00,000 Credit Limit',
      '₹5,00,000 Credit Limit',
      '₹10,00,000 Credit Limit',
      'Based on Bank Guarantee',
      'Security Deposit Required'
    ],
    'Return Policy': [
      'No Returns',
      '7 Days Return',
      '15 Days Return',
      '30 Days Return',
      'Defective Items Only',
      'Mutual Agreement'
    ],
    'Marketing Support': [
      'No Support',
      'Marketing Materials Provided',
      '50% Co-op Advertising',
      'Full Marketing Support',
      'Digital Marketing Support',
      'Trade Show Support'
    ],
    'Training Requirements': [
      'No Training Required',
      'Initial Training Provided',
      'Quarterly Training',
      'Annual Training',
      'Online Training Modules',
      'Certification Required'
    ],
    'Performance Targets': [
      'No Targets',
      'Monthly Sales Target',
      'Quarterly Growth Target',
      'Annual Revenue Target',
      'Market Share Target',
      'Customer Acquisition Target'
    ],
    'Exclusivity Agreement': [
      'Non-Exclusive',
      'Exclusive for Territory',
      'Exclusive for Product Line',
      'Conditional Exclusivity',
      'Performance Based Exclusivity'
    ],
    'Contract Duration': [
      '1 Year',
      '2 Years',
      '3 Years',
      '5 Years',
      'Renewable Annually',
      'Indefinite with Notice Period'
    ],
    'Termination Clause': [
      '30 Days Notice',
      '60 Days Notice',
      '90 Days Notice',
      'Immediate for Breach',
      'Mutual Agreement',
      'Performance Based'
    ],
    'Dispute Resolution': [
      'Mutual Discussion',
      'Mediation',
      'Arbitration',
      'Court Jurisdiction - Mumbai',
      'Court Jurisdiction - Delhi',
      'Industry Association'
    ],
    'Force Majeure': [
      'Standard Force Majeure',
      'Extended Force Majeure',
      'No Force Majeure Clause',
      'Limited Force Majeure',
      'Pandemic Specific Clause'
    ],
    'Intellectual Property Rights': [
      'Manufacturer Retains All Rights',
      'Limited Usage Rights',
      'Shared IP Rights',
      'No IP Transfer',
      'Trademark Usage Permitted'
    ],
    'Quality Standards': [
      'ISO 9001 Compliance',
      'Industry Standard',
      'Manufacturer Standards',
      'Custom Quality Metrics',
      'Third Party Certification'
    ],
    'Warranty Terms': [
      'Manufacturer Warranty',
      'Extended Warranty',
      'No Warranty',
      'Limited Warranty',
      'Distributor Warranty'
    ],
    'Insurance Requirements': [
      'No Insurance Required',
      'Product Liability Insurance',
      'General Liability Insurance',
      'Comprehensive Coverage',
      'Minimum Coverage Amount'
    ],
    'Compliance Standards': [
      'Local Regulations',
      'National Standards',
      'International Standards',
      'Industry Specific',
      'Environmental Compliance'
    ]
  }
};