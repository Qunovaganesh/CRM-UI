<template>
  <div class="modern-multiselect" ref="dropdown">
    <div class="multiselect-trigger" @click="toggleDropdown" :class="{ open: isOpen, 'has-selections': selected.length > 0 }">
      <div class="trigger-content">
        <span v-if="selected.length === 0" class="placeholder">{{ placeholder }}</span>
        <div v-else class="selected-display">
          <span class="selected-count">{{ selected.length }} selected</span>
          <div class="selected-preview">
            <span v-for="(item, index) in selected.slice(0, 3)" :key="item" class="preview-tag">
              {{ item }}
            </span>
            <span v-if="selected.length > 3" class="more-count">+{{ selected.length - 3 }}</span>
          </div>
        </div>
      </div>
      <div class="trigger-icon" :class="{ rotated: isOpen }">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4.427 6.427a.75.75 0 011.06 0L8 8.94l2.513-2.513a.75.75 0 111.06 1.06l-3.043 3.044a.75.75 0 01-1.06 0L4.427 7.487a.75.75 0 010-1.06z"/>
        </svg>
      </div>
    </div>

    <transition name="dropdown">
      <div v-if="isOpen" class="dropdown-panel">
        <div class="search-container" v-if="searchable">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.742 10.344a6.5 6.5 0 10-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 001.415-1.414l-3.85-3.85a1.007 1.007 0 00-.115-.1zM12 6.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z"/>
            </svg>
            <input 
              type="text" 
              v-model="searchTerm" 
              placeholder="Search options..." 
              class="search-input"
              @click.stop
            />
          </div>
        </div>

        <div class="options-container">
          <div class="options-header" v-if="filteredOptions.length > 0">
            <button 
              class="select-all-btn" 
              @click="selectAll"
              v-if="filteredOptions.length > selected.length"
            >
              Select All ({{ filteredOptions.length }})
            </button>
            <button 
              class="clear-all-btn" 
              @click="clearAll"
              v-if="selected.length > 0"
            >
              Clear All
            </button>
          </div>

          <div class="options-list">
            <div 
              v-for="option in filteredOptions" 
              :key="option" 
              class="option-item"
              :class="{ selected: isSelected(option) }"
              @click="toggleOption(option)"
            >
              <div class="option-checkbox">
                <div class="checkbox-custom" :class="{ checked: isSelected(option) }">
                  <svg v-if="isSelected(option)" class="check-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <span class="option-text">{{ option }}</span>
            </div>
          </div>

          <div v-if="filteredOptions.length === 0" class="no-options">
            <div class="no-options-content">
              <svg class="no-options-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <p>No options found</p>
            </div>
          </div>
        </div>

        <div class="dropdown-footer" v-if="selected.length > 0">
          <div class="selected-summary">
            <span class="summary-text">{{ selected.length }} item{{ selected.length !== 1 ? 's' : '' }} selected</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  options: string[]
  selected: string[]
  placeholder?: string
  searchable?: boolean
}>()

const emit = defineEmits<{
  'update:selected': [value: string[]]
}>()

const dropdown = ref<HTMLElement>()
const isOpen = ref(false)
const searchTerm = ref('')
const localSelected = ref<string[]>([])

const filteredOptions = computed(() => {
  if (!searchTerm.value) return props.options
  return props.options.filter(option =>
    option.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const isSelected = (option: string) => {
  return localSelected.value.includes(option)
}

const toggleOption = (option: string) => {
  const index = localSelected.value.indexOf(option)
  if (index > -1) {
    // Remove option
    localSelected.value = localSelected.value.filter(item => item !== option)
  } else {
    // Add option
    localSelected.value = [...localSelected.value, option]
  }
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchTerm.value = ''
  }
}

const selectAll = () => {
  const newSelected = [...new Set([...localSelected.value, ...filteredOptions.value])]
  localSelected.value = newSelected
}

const clearAll = () => {
  localSelected.value = []
}

const handleClickOutside = (event: Event) => {
  if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

// Watch for prop changes
watch(() => props.selected, (newVal) => {
  localSelected.value = [...newVal]
}, { immediate: true })

// Emit changes
watch(localSelected, (newVal) => {
  emit('update:selected', newVal)
}, { deep: true })

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.modern-multiselect {
  position: relative;
  width: 100%;
}

.multiselect-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #d1d1d6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px;
}

.multiselect-trigger:hover {
  border-color: #8e8e93;
  background: #fafafa;
}

.multiselect-trigger.open {
  border-color: #1c1c1e;
  box-shadow: 0 0 0 3px rgba(28, 28, 30, 0.1);
  background: #ffffff;
}

.multiselect-trigger.has-selections {
  border-color: #1c1c1e;
  background: #f2f2f7;
}

.trigger-content {
  flex: 1;
  min-width: 0;
}

.placeholder {
  color: #8e8e93;
  font-size: 16px;
  font-weight: 400;
}

.selected-display {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.selected-count {
  font-size: 13px;
  font-weight: 600;
  color: #1c1c1e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.selected-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.preview-tag {
  background: #e5e5ea;
  color: #1c1c1e;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #d1d1d6;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.more-count {
  background: #f2f2f7;
  color: #8e8e93;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.trigger-icon {
  color: #8e8e93;
  transition: transform 0.2s ease;
  flex-shrink: 0;
  margin-left: 12px;
}

.trigger-icon.rotated {
  transform: rotate(180deg);
}

.dropdown-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #d1d1d6;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  z-index: 999999999;
  margin-top: 8px;
  max-height: 360px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(20px);
}

.search-container {
  padding: 16px;
  border-bottom: 1px solid #f2f2f7;
  background: #fafafa;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #8e8e93;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid #d1d1d6;
  border-radius: 8px;
  font-size: 16px;
  background: #ffffff;
  transition: all 0.2s ease;
  color: #1c1c1e;
}

.search-input:focus {
  outline: none;
  border-color: #1c1c1e;
  box-shadow: 0 0 0 3px rgba(28, 28, 30, 0.1);
}

.options-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.options-header {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fafafa;
  border-bottom: 1px solid #f2f2f7;
}

.select-all-btn,
.clear-all-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.select-all-btn {
  background: #f2f2f7;
  color: #1c1c1e;
  border: 1px solid #d1d1d6;
}

.select-all-btn:hover {
  background: #e5e5ea;
  transform: translateY(-1px);
}

.clear-all-btn {
  background: #f2f2f7;
  color: #8e8e93;
  border: 1px solid #d1d1d6;
}

.clear-all-btn:hover {
  background: #e5e5ea;
  color: #1c1c1e;
  transform: translateY(-1px);
}

.options-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  color: #1c1c1e;
}

.option-item:hover {
  background: #f9f9f9;
  border-left-color: #d1d1d6;
}

.option-item.selected {
  background: #f2f2f7;
  border-left-color: #1c1c1e;
}

.option-checkbox {
  position: relative;
  flex-shrink: 0;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d1d6;
  border-radius: 4px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
}

.checkbox-custom.checked {
  background: #1c1c1e;
  border-color: #1c1c1e;
  color: #ffffff;
}

.check-icon {
  color: #ffffff;
  opacity: 1;
  transform: scale(1);
  transition: all 0.2s ease;
}

.option-text {
  font-size: 16px;
  color: #1c1c1e;
  font-weight: 400;
  flex: 1;
  min-width: 0;
  word-break: break-word;
}

.no-options {
  padding: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-options-content {
  text-align: center;
  color: #8e8e93;
}

.no-options-icon {
  margin: 0 auto 12px;
  opacity: 0.5;
}

.no-options p {
  margin: 0;
  font-size: 16px;
  font-weight: 400;
}

.dropdown-footer {
  padding: 12px 16px;
  background: #fafafa;
  border-top: 1px solid #f2f2f7;
}

.selected-summary {
  text-align: center;
}

.summary-text {
  font-size: 13px;
  color: #8e8e93;
  font-weight: 500;
}

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.95);
}

/* Scrollbar styling */
.options-list::-webkit-scrollbar {
  width: 8px;
}

.options-list::-webkit-scrollbar-track {
  background: #f2f2f7;
}

.options-list::-webkit-scrollbar-thumb {
  background: #c7c7cc;
  border-radius: 4px;
}

.options-list::-webkit-scrollbar-thumb:hover {
  background: #aeaeb2;
}

@media (max-width: 768px) {
  .dropdown-panel {
    max-height: 280px;
    margin-top: 4px;
    border-radius: 8px;
    z-index: 999999999 !important;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  }
  
  .selected-preview {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .multiselect-trigger {
    padding: 10px 12px;
    min-height: 44px;
  }
  
  .search-input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  .option-item {
    padding: 14px 16px;
  }
  
  .option-text {
    font-size: 16px;
  }
  
  .preview-tag {
    max-width: 100px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .dropdown-panel {
    position: fixed !important;
    top: auto !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    margin: 0 !important;
    border-radius: 16px 16px 0 0 !important;
    max-height: 70vh !important;
    z-index: 999999999 !important;
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.3) !important;
  }
  
  .multiselect-trigger {
    padding: 8px 10px;
    min-height: 40px;
  }
  
  .selected-preview {
    gap: 3px;
  }
  
  .preview-tag {
    padding: 3px 6px;
    font-size: 11px;
    max-width: 80px;
  }
  
  .placeholder,
  .option-text {
    font-size: 14px;
  }
  
  .search-container {
    padding: 12px;
  }
  
  .options-header {
    padding: 8px 12px;
  }
  
  .option-item {
    padding: 12px;
  }
  
  .checkbox-custom {
    width: 18px;
    height: 18px;
  }
  
  .check-icon {
    width: 12px;
    height: 12px;
  }
}
</style>