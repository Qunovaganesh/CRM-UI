<template>
  <div class="filter-controls">
    <!-- Geographic Filters -->
    <div class="filter-section">
      <h3>Geographic Filters</h3>
      <div class="filter-grid">
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
      </div>
    </div>

    <!-- Category Filters -->
    <div class="filter-section">
      <h3>Category Filters</h3>
      <div class="filter-grid">
        <div class="filter-group">
          <label>Category</label>
          <div class="multiselect-container">
            <select 
              multiple 
              :value="internalFilters.category" 
              @change="onCategoryFilterChange('category', Array.from($event.target.selectedOptions).map(option => option.value))"
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

        <div class="filter-group">
          <label>Sub Category</label>
          <div class="multiselect-container">
            <select 
              multiple 
              :value="internalFilters.subCategory" 
              @change="onCategoryFilterChange('subCategory', Array.from($event.target.selectedOptions).map(option => option.value))"
              class="multiselect"
            >
              <option v-for="subCategory in availableSubCategories" :key="subCategory" :value="subCategory">
                {{ subCategory }}
              </option>
            </select>
            <div class="selected-tags" v-if="internalFilters.subCategory.length">
              <span v-for="subCategory in internalFilters.subCategory" :key="subCategory" class="tag">
                {{ subCategory }}
                <button @click="removeFilter('subCategory', subCategory)" class="tag-remove">×</button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Filter -->
    <div class="filter-section">
      <h3>Status Filter</h3>
      <div class="filter-grid">
        <div class="filter-group">
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
    </div>

    <div class="filter-actions">
      <button type="button" class="btn-clear" @click="clearAllFilters">
        Clear All Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { filterOptions, locationMapping, categoryToSubCategoryMapping } from '../data/mockData';

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
  'category-filter-change': [type: 'category' | 'subCategory', values: string[]];
}>();

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

const availableCategories = computed(() => {
  if (internalFilters.value.subCategory.length > 0) {
    const relatedCategories = new Set<string>();
    (Array.isArray(internalFilters.value.subCategory) ? internalFilters.value.subCategory : []).forEach((subCategory: string) => {
      Object.entries(categoryToSubCategoryMapping).forEach(([category, subCategories]) => {
        if (subCategories.includes(subCategory)) {
          relatedCategories.add(category);
        }
      });
    });
    return Array.from(relatedCategories);
  }
  return filterOptions.categories;
});

const availableSubCategories = computed(() => {
  if (internalFilters.value.category.length > 0) {
    const relatedSubCategories = new Set<string>();
    (Array.isArray(internalFilters.value.category) ? internalFilters.value.category : []).forEach((category: string) => {
      const subCategories = categoryToSubCategoryMapping[category];
      if (subCategories) {
        subCategories.forEach(subCategory => relatedSubCategories.add(subCategory));
      }
    });
    return Array.from(relatedSubCategories);
  }
  return filterOptions.subCategories;
});

const onFilterChange = () => {
  emit('filter-change');
};

const onLocationFilterChange = (type: 'city' | 'district' | 'state', values: string[]) => {
  emit('location-filter-change', type, values);
  emit('filter-change');
};

const onCategoryFilterChange = (type: 'category' | 'subCategory', values: string[]) => {
  emit('category-filter-change', type, values);
  emit('filter-change');
};

const removeFilter = (type: string, value: string) => {
  const currentValues = internalFilters.value[type] as string[];
  const newValues = currentValues.filter(v => v !== value);
  
  if (type === 'city' || type === 'district' || type === 'state') {
    emit('location-filter-change', type as 'city' | 'district' | 'state', newValues);
  } else if (type === 'category' || type === 'subCategory') {
    emit('category-filter-change', type as 'category' | 'subCategory', newValues);
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
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.filter-section {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.filter-section:last-of-type {
  border-bottom: none;
}

.filter-section h3 {
  margin: 0 0 20px 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.025em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-section h3::before {
  content: '';
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 2px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  letter-spacing: -0.025em;
}

.multiselect-container {
  position: relative;
}

.multiselect {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background: white;
  font-size: 14px;
  width: 100%;
  min-height: 48px;
  max-height: 140px;
  overflow-y: auto;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.multiselect:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.multiselect option {
  padding: 10px;
  border-radius: 6px;
  margin: 2px 0;
  background: white;
  color: #374151;
}

.multiselect option:checked {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.tag {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #1e40af;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #bfdbfe;
  transition: all 0.2s ease;
}

.tag:hover {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  transform: translateY(-1px);
}

.tag-remove {
  background: none;
  border: none;
  color: #1e40af;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  padding: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.tag-remove:hover {
  background: #1e40af;
  color: white;
}

.filter-actions {
  padding: 24px;
  display: flex;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.btn-clear {
  padding: 12px 32px;
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.025em;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-clear:hover {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -1px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-section {
    padding: 20px;
  }
  
  .filter-actions {
    padding: 20px;
  }
}
</style>