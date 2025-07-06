import { ref, computed, reactive } from 'vue';
import type { Manufacturer, Distributor, Interaction, Agreement, Invoice } from '../types';
import { mockManufacturers, mockDistributors, mockInteractions, mockAgreement, mockInvoices } from '../data/mockData';

export const useBusinessLogic = () => {
  const selectedEntity = ref<'manufacturer' | 'distributor'>('manufacturer');
  const selectedManufacturer = ref<Manufacturer | null>(null);
  const selectedDistributor = ref<Distributor | null>(null);
  
  const filters = reactive({
    city: '',
    district: '',
    state: '',
    industry: '',
    category: '',
    status: ''
  });

  const manufacturers = ref<Manufacturer[]>(mockManufacturers);
  const distributors = ref<Distributor[]>(mockDistributors);
  const interactions = ref<Interaction[]>(mockInteractions);
  const agreement = ref<Agreement>(mockAgreement);
  const invoices = ref<Invoice[]>(mockInvoices);

  const filteredManufacturers = computed(() => {
    return manufacturers.value.filter(manufacturer => {
      return (!filters.city || manufacturer.city === filters.city) &&
             (!filters.district || manufacturer.district === filters.district) &&
             (!filters.state || manufacturer.state === filters.state) &&
             (!filters.industry || manufacturer.industry === filters.industry) &&
             (!filters.category || manufacturer.category === filters.category);
    });
  });

  const filteredDistributors = computed(() => {
    return distributors.value.filter(distributor => {
      return (!filters.city || distributor.city === filters.city) &&
             (!filters.district || distributor.district === filters.district) &&
             (!filters.state || distributor.state === filters.state) &&
             (!filters.industry || distributor.industry === filters.industry) &&
             (!filters.category || distributor.category === filters.category) &&
             (!filters.status || distributor.status === filters.status);
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
      filters[key as keyof typeof filters] = '';
    });
  };

  return {
    selectedEntity,
    selectedManufacturer,
    selectedDistributor,
    filters,
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
    clearFilters
  };
};