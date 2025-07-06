<template>
  <div class="filter-controls">
    <div class="entity-toggle">
      <h3>Select Entity Type</h3>
      <div class="radio-group">
        <label>
          <input 
            type="radio" 
            :value="'manufacturer'" 
            v-model="internalSelectedEntity"
          >
          Manufacturer
        </label>
        <label>
          <input 
            type="radio" 
            :value="'distributor'" 
            v-model="internalSelectedEntity"
          >
          Distributor
        </label>
      </div>
    </div>

    <div class="filters-grid">
      <div class="filter-group">
        <label>State</label>
        <div class="multiselect-container">
          <select 
            multiple 
            :value="internalFilters.state" 
            @change="onLocationFilterChange('state', Array.from($event.target.selectedOptions).map(option => option.value))"
            class="multiselect"
          >
            <option v-for="state in availableStates" :key="state" :value="state">
              {{ state }}
            </option>
          </select>
          <div class="selected-tags" v-if="internalFilters.state.length">
            <span v-for="state in internalFilters.state" :key="state" class="tag">
              {{ state }}
              <button @click="removeFilter('state', state)" class="tag-remove">×</button>
            </span>
          </div>
        </div>
      </div>

      <div class="filter-group">
        <label>District</label>
        <div class="multiselect-container">
          <select 
            multiple 
            :value="internalFilters.district" 
            @change="onLocationFilterChange('district', Array.from($event.target.selectedOptions).map(option => option.value))"
            class="multiselect"
          >
            <option v-for="district in availableDistricts" :key="district" :value="district">
              {{ district }}
            </option>
          </select>
          <div class="selected-tags" v-if="internalFilters.district.length">
            <span v-for="district in internalFilters.district" :key="district" class="tag">
              {{ district }}
              <button @click="removeFilter('district', district)" class="tag-remove">×</button>
            </span>
          </div>
        </div>
      </div>

      <div class="filter-group">
        <label>City</label>
        <div class="multiselect-container">
          <select 
            multiple 
            :value="internalFilters.city" 
            @change="onLocationFilterChange('city', Array.from($event.target.selectedOptions).map(option => option.value))"
            class="multiselect"
          >
            <option v-for="city in availableCities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
          <div class="selected-tags" v-if="internalFilters.city.length">
            <span v-for="city in internalFilters.city" :key="city" class="tag">
              {{ city }}
              <button @click="removeFilter('city', city)" class="tag-remove">×</button>
            </span>
          </div>
        </div>
      </div>

      <div class="filter-group">
        <label>Industry</label>
        <div class="multiselect-container">
          <select 
            multiple 
            :value="internalFilters.industry" 
            @change="onIndustryFilterChange('industry', Array.from($event.target.selectedOptions).map(option => option.value))"
            class="multiselect"
          >
            <option v-for="industry in availableIndustries" :key="industry" :value="industry">
              {{ industry }}
            </option>
          </select>
          <div class="selected-tags" v-if="internalFilters.industry.length">
            <span v-for="industry in internalFilters.industry" :key="industry" class="tag">
              {{ industry }}
              <button @click="removeFilter('industry', industry)" class="tag-remove">×</button>
            </span>
          </div>
        </div>
      </div>

      <div class="filter-group">
        <label>Category</label>
        <div class="multiselect-container">
          <select 
            multiple 
            :value="internalFilters.category" 
            @change="onIndustryFilterChange('category', Array.from($event.target.selectedOptions).map(option => option.value))"
            class="multiselect"
          >
            <option v-for="category in availableCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <div class="selected-tags" v-if="internalFilters.category.length">
            <span v-for="category in internalFilters.category" :key="category" class="tag">
              {{ category }}
              <button @click="removeFilter('category', category)" class="tag-remove">×</button>
            </span>
          </div>
        </div>
      </div>

      <div class="filter-group" v-if="selectedEntity === 'distributor'">
        <label>Status</label>
        <div class="multiselect-container">
          <select 
            multiple 
            :value="internalFilters.status" 
            @change="internalFilters.status = Array.from($event.target.selectedOptions).map(option => option.value); onFilterChange()"
            class="multiselect"
          >
            <option v-for="status in filterOptions.statuses" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
          <div class="selected-tags" v-if="internalFilters.status.length">
            <span v-for="status in internalFilters.status" :key="status" class="tag">
              {{ status }}
              <button @click="removeFilter('status', status)" class="tag-remove">×</button>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="filter-actions">
      <button type="button" class="btn-secondary" @click="clearAllFilters">
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { filterOptions, locationMapping, industryToCategoryMapping } from '../data/mockData';

const props = defineProps<{
  selectedEntity: 'manufacturer' | 'distributor';
  filters: any;
}>();

const emit = defineEmits<{
  'update:selectedEntity': [value: 'manufacturer' | 'distributor'];
  'update:filters': [filters: any];
  'entity-change': [];
  'filter-change': [];
  'clear-filters': [];
  'location-filter-change': [type: 'city' | 'district' | 'state', values: string[]];
  'industry-filter-change': [type: 'industry' | 'category', values: string[]];
}>();

const internalSelectedEntity = computed({
  get() {
    return props.selectedEntity;
  },
  set(value: 'manufacturer' | 'distributor') {
    emit('update:selectedEntity', value);
    emit('entity-change');
  }
});

const internalFilters = computed({
  get() {
    return props.filters;
  },
  set(value: any) {
    emit('update:filters', value);
  }
});

const availableStates = computed(() => {
  if (internalFilters.value.city.length > 0 || internalFilters.value.district.length > 0) {
    // If cities or districts are selected, show only related states
    const relatedStates = new Set<string>();
    
    if (internalFilters.value.city.length > 0) {
      Object.entries(locationMapping).forEach(([state, mapping]) => {
        if (mapping.cities.some(city => internalFilters.value.city.includes(city))) {
          relatedStates.add(state);
        }
      });
    }
    
    if (internalFilters.value.district.length > 0) {
      Object.entries(locationMapping).forEach(([state, mapping]) => {
        if (mapping.districts.some(district => internalFilters.value.district.includes(district))) {
          relatedStates.add(state);
        }
      });
    }
    
    return Array.from(relatedStates);
  }
  return filterOptions.states;
});

const availableDistricts = computed(() => {
  if (internalFilters.value.state.length > 0) {
    const relatedDistricts = new Set<string>();
    (Array.isArray(internalFilters.value.state) ? internalFilters.value.state : []).forEach((state: string) => {
      const mapping = locationMapping[state];
      if (mapping) {
        mapping.districts.forEach(district => relatedDistricts.add(district));
      }
    });
    return Array.from(relatedDistricts);
  }
  return filterOptions.districts;
});

const availableCities = computed(() => {
  if (internalFilters.value.state.length > 0) {
    const relatedCities = new Set<string>();
    (Array.isArray(internalFilters.value.state) ? internalFilters.value.state : []).forEach((state: string) => {
      const mapping = locationMapping[state];
      if (mapping) {
        mapping.cities.forEach(city => relatedCities.add(city));
      }
    });
    return Array.from(relatedCities);
  }
  return filterOptions.cities;
});

const availableIndustries = computed(() => {
  if (internalFilters.value.category.length > 0) {
    const relatedIndustries = new Set<string>();
    (Array.isArray(internalFilters.value.category) ? internalFilters.value.category : []).forEach((category: string) => {
      Object.entries(industryToCategoryMapping).forEach(([industry, categories]) => {
        if (categories.includes(category)) {
          relatedIndustries.add(industry);
        }
      });
    });
    return Array.from(relatedIndustries);
  }
  return filterOptions.industries;
});

const availableCategories = computed(() => {
  if (internalFilters.value.industry.length > 0) {
    const relatedCategories = new Set<string>();
    (Array.isArray(internalFilters.value.industry) ? internalFilters.value.industry : []).forEach((industry: string) => {
      const categories = industryToCategoryMapping[industry];
      if (categories) {
        categories.forEach(category => relatedCategories.add(category));
      }
    });
    return Array.from(relatedCategories);
  }
  return filterOptions.categories;
});

const onFilterChange = () => {
  emit('filter-change');
};

const onLocationFilterChange = (type: 'city' | 'district' | 'state', values: string[]) => {
  emit('location-filter-change', type, values);
  emit('filter-change');
};

const onIndustryFilterChange = (type: 'industry' | 'category', values: string[]) => {
  emit('industry-filter-change', type, values);
  emit('filter-change');
};

const removeFilter = (type: string, value: string) => {
  const currentValues = internalFilters.value[type] as string[];
  const newValues = currentValues.filter(v => v !== value);
  
  if (type === 'city' || type === 'district' || type === 'state') {
    emit('location-filter-change', type as 'city' | 'district' | 'state', newValues);
  } else if (type === 'industry' || type === 'category') {
    emit('industry-filter-change', type as 'industry' | 'category', newValues);
  } else {
    internalFilters.value[type] = newValues;
  }
  
  emit('filter-change');
};

const clearAllFilters = () => {
  emit('clear-filters');
};
</script>

<style scoped>
.filter-controls {
  background: #f8f9fa;
  padding: 20px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  margin-bottom: 20px;
}

.entity-toggle {
  margin-bottom: 20px;
}

.entity-toggle h3 {
  margin: 0 0 10px 0;
  color: #374151;
  font-size: 16px;
  font-weight: 600;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #374151;
  font-weight: 500;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.multiselect-container {
  position: relative;
}

.multiselect {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  width: 100%;
  min-height: 40px;
  max-height: 120px;
  overflow-y: auto;
}

.multiselect:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}

.tag {
  background: #e5e7eb;
  color: #374151;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tag-remove {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.tag-remove:hover {
  background: #d1d5db;
  color: #374151;
}

.filter-actions {
  display: flex;
  gap: 10px;
}

.btn-secondary {
  padding: 8px 16px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn-secondary:hover {
  background: #4b5563;
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 10px;
  }
}
</style>