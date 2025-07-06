import { ref, computed, reactive } from 'vue';
import type { Manufacturer, Distributor, Interaction, Agreement, Invoice } from '../types';
import { mockManufacturers, mockDistributors, mockInteractions, mockAgreement, mockInvoices, locationMapping, cityToLocationMapping, industryToCategoryMapping } from '../data/mockData';

export const useBusinessLogic = () => {
  const selectedEntity = ref<'manufacturer' | 'distributor'>('manufacturer');
  const selectedManufacturer = ref<Manufacturer | null>(null);
  const selectedDistributor = ref<Distributor | null>(null);
  const selectedEntityId = ref<string>('');
  
  const filters = reactive({
    city: [] as string[],
    district: [] as string[],
    state: [] as string[],
    industry: [] as string[],
    category: [] as string[],
    status: [] as string[]
  });

  const associatedFilters = reactive({
    city: [] as string[],
    district: [] as string[],
    state: [] as string[],
    industry: [] as string[],
    category: [] as string[],
    status: [] as string[]
  });

  const manufacturers = ref<Manufacturer[]>(mockManufacturers);
  const distributors = ref<Distributor[]>(mockDistributors);
  const interactions = ref<Interaction[]>(mockInteractions);
  const agreement = ref<Agreement>(mockAgreement);
  const invoices = ref<Invoice[]>(mockInvoices);

  const filteredManufacturers = computed(() => {
    return manufacturers.value.filter(manufacturer => {
      return (!filters.city.length || filters.city.includes(manufacturer.city)) &&
             (!filters.district.length || filters.district.includes(manufacturer.district)) &&
             (!filters.state.length || filters.state.includes(manufacturer.state)) &&
             (!filters.industry.length || filters.industry.includes(manufacturer.industry)) &&
             (!filters.category.length || filters.category.includes(manufacturer.category)) &&
             (!filters.status.length || filters.status.includes(manufacturer.status));
    });
  });

  const filteredDistributors = computed(() => {
    return distributors.value.filter(distributor => {
      return (!filters.city.length || filters.city.includes(distributor.city)) &&
             (!filters.district.length || filters.district.includes(distributor.district)) &&
             (!filters.state.length || filters.state.includes(distributor.state)) &&
             (!filters.industry.length || filters.industry.includes(distributor.industry)) &&
             (!filters.category.length || filters.category.includes(distributor.category)) &&
             (!filters.status.length || filters.status.includes(distributor.status));
    });
  });

  const pairedList = computed(() => {
    if (selectedEntity.value === 'manufacturer' && selectedManufacturer.value) {
      return distributors.value.filter(d => 
        d.industry === selectedManufacturer.value?.industry &&
        d.category === selectedManufacturer.value?.category
      );
    }
    if (selectedEntity.value === 'distributor' && selectedDistributor.value) {
      return manufacturers.value.filter(m => 
        m.industry === selectedDistributor.value?.industry &&
        m.category === selectedDistributor.value?.category
      );
    }
    return [];
  });

  const addInteraction = (interaction: Omit<Interaction, 'id'>) => {
    const newInteraction = {
      ...interaction,
      id: `I${Date.now()}`
    };
    interactions.value.unshift(newInteraction);
  };

  const updateAgreement = (updatedAgreement: Agreement) => {
    agreement.value = updatedAgreement;
  };

  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newInvoice = {
      ...invoice,
      id: `INV${Date.now()}`
    };
    invoices.value.unshift(newInvoice);
  };

  const updateDistributorStatus = (distributorId: string, newStatus: Distributor['status']) => {
    const distributor = distributors.value.find(d => d.id === distributorId);
    if (distributor) {
      distributor.status = newStatus;
      distributor.daysSinceStatus = 0;
    }
  };

  const clearFilters = () => {
    Object.keys(filters).forEach(key => {
      filters[key as keyof typeof filters] = [];
    });
  };

  const clearAssociatedFilters = () => {
    Object.keys(associatedFilters).forEach(key => {
      associatedFilters[key as keyof typeof associatedFilters] = [];
    });
  };

  const updateLocationFilters = (type: 'city' | 'district' | 'state', values: string[], isAssociated = false) => {
    const targetFilters = isAssociated ? associatedFilters : filters;
    
    if (type === 'city') {
      targetFilters.city = values;
      // Auto-update state and district based on selected cities
      const relatedStates = new Set<string>();
      const relatedDistricts = new Set<string>();
      
      values.forEach(city => {
        const location = cityToLocationMapping[city];
        if (location) {
          relatedStates.add(location.state);
          relatedDistricts.add(location.district);
        }
      });
      
      if (values.length > 0) {
        targetFilters.state = Array.from(relatedStates);
        targetFilters.district = Array.from(relatedDistricts);
      }
    } else if (type === 'state') {
      targetFilters.state = values;
      // Auto-update cities and districts based on selected states
      const relatedCities = new Set<string>();
      const relatedDistricts = new Set<string>();
      
      values.forEach(state => {
        const mapping = locationMapping[state];
        if (mapping) {
          mapping.cities.forEach(city => relatedCities.add(city));
          mapping.districts.forEach(district => relatedDistricts.add(district));
        }
      });
      
      if (values.length > 0) {
        targetFilters.city = Array.from(relatedCities);
        targetFilters.district = Array.from(relatedDistricts);
      }
    } else if (type === 'district') {
      targetFilters.district = values;
      // Auto-update state and cities based on selected districts
      const relatedStates = new Set<string>();
      const relatedCities = new Set<string>();
      
      values.forEach(district => {
        Object.entries(locationMapping).forEach(([state, mapping]) => {
          if (mapping.districts.includes(district)) {
            relatedStates.add(state);
            mapping.cities.forEach(city => {
              const cityLocation = cityToLocationMapping[city];
              if (cityLocation && cityLocation.district === district) {
                relatedCities.add(city);
              }
            });
          }
        });
      });
      
      if (values.length > 0) {
        targetFilters.state = Array.from(relatedStates);
        targetFilters.city = Array.from(relatedCities);
      }
    }
  };

  const updateIndustryFilters = (type: 'industry' | 'category', values: string[], isAssociated = false) => {
    const targetFilters = isAssociated ? associatedFilters : filters;
    
    if (type === 'industry') {
      targetFilters.industry = values;
      // Auto-update categories based on selected industries
      const relatedCategories = new Set<string>();
      
      values.forEach(industry => {
        const categories = industryToCategoryMapping[industry];
        if (categories) {
          categories.forEach(category => relatedCategories.add(category));
        }
      });
      
      if (values.length > 0) {
        targetFilters.category = Array.from(relatedCategories);
      }
    } else if (type === 'category') {
      targetFilters.category = values;
      // Auto-update industries based on selected categories
      const relatedIndustries = new Set<string>();
      
      values.forEach(category => {
        Object.entries(industryToCategoryMapping).forEach(([industry, categories]) => {
          if (categories.includes(category)) {
            relatedIndustries.add(industry);
          }
        });
      });
      
      if (values.length > 0) {
        targetFilters.industry = Array.from(relatedIndustries);
      }
    }
  };

  return {
    selectedEntity,
    selectedManufacturer,
    selectedDistributor,
    selectedEntityId,
    filters,
    associatedFilters,
    manufacturers,
    distributors,
    interactions,
    agreement,
    invoices,
    filteredManufacturers,
    filteredDistributors,
    pairedList,
    addInteraction,
    updateAgreement,
    addInvoice,
    updateDistributorStatus,
    clearFilters,
    clearAssociatedFilters,
    updateLocationFilters,
    updateIndustryFilters,
    locationMapping,
    industryToCategoryMapping
  };
};