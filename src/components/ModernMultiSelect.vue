<template>
  <div class="modern-multiselect" ref="dropdown">
    <div 
      class="multiselect-trigger" 
      @click="toggleDropdown" 
      :class="{ 
        open: isOpen, 
        'has-selections': selected.length > 0,
        focused: isOpen 
      }"
    >
      <div class="trigger-content">
        <span v-if="selected.length === 0" class="placeholder">{{ placeholder }}</span>
        <div v-else class="selected-display">
          <span class="selected-count">{{ selected.length }} selected</span>
          <div class="selected-preview">
            <span v-for="(item, index) in selected.slice(0, 2)" :key="item" class="preview-tag">
              {{ item }}
            </span>
            <span v-if="selected.length > 2" class="more-count">+{{ selected.length - 2 }}</span>
          </div>
        </div>
      </div>
      <div class="trigger-icon" :class="{ rotated: isOpen }">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4.427 6.427a.75.75 0 011.06 0L8 8.94l2.513-2.513a.75.75 0 111.06 1.06l-3.043 3.044a.75.75 0 01-1.06 0L4.427 7.487a.75.75 0 010-1.06z"/>
        </svg>
      </div>
    </div>

    <!-- Backdrop for mobile -->
    <div v-if="isOpen && isMobile" class="dropdown-backdrop" @click="closeDropdown"></div>

    <transition name="dropdown">
      <div 
        v-if="isOpen" 
        class="dropdown-panel" 
        :class="{ 'mobile-panel': isMobile }"
        ref="panel"
        @click.stop
      >
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
              ref="searchInput"
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

          <div class="options-list" ref="optionsList">
            <div 
              v-for="option in filteredOptions" 
              :key="option" 
              class="option-item"
              :class="{ selected: isSelected(option) }"
              @click="toggleOption(option)"
            >
              <div class="option-checkbox">
                <div class="checkbox-custom" :class="{ checked: isSelected(option) }">
                  <transition name="check">
                    <svg v-if="isSelected(option)" class="check-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </transition>
                </div>
              </div>
              <span class="option-text">{{ option }}</span>
            </div>
          </div>

          <div v-if="filteredOptions.length === 0" class="no-options">
            <div class="no-options-content">
              <svg class="no-options-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <p>No options found</p>
              <span v-if="searchTerm">Try adjusting your search</span>
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
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  options: string[]
  selected: string[]
  placeholder?: string
  searchable?: boolean
}>(), {
  placeholder: 'Select options...',
  searchable: true
})

const emit = defineEmits<{
  'update:selected': [value: string[]]
}>()

const dropdown = ref<HTMLElement>()
const panel = ref<HTMLElement>()
const searchInput = ref<HTMLInputElement>()
const optionsList = ref<HTMLElement>()
const isOpen = ref(false)
const searchTerm = ref('')
const localSelected = ref<string[]>([])

const isMobile = computed(() => {
  return window.innerWidth <= 768
})

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
    localSelected.value = localSelected.value.filter(item => item !== option)
  } else {
    localSelected.value = [...localSelected.value, option]
  }
}

const toggleDropdown = () => {
  if (isOpen.value) {
    closeDropdown()
  } else {
    openDropdown()
  }
}

const openDropdown = () => {
  isOpen.value = true
  searchTerm.value = ''
  
  nextTick(() => {
    positionDropdown()
    if (props.searchable && searchInput.value) {
      searchInput.value.focus()
    }
  })
}

const closeDropdown = () => {
  isOpen.value = false
  searchTerm.value = ''
}

const positionDropdown = () => {
  if (!dropdown.value || !panel.value) return
  
  const triggerRect = dropdown.value.getBoundingClientRect()
  const panelElement = panel.value
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth
  
  if (isMobile.value) {
    // Mobile: position at bottom of screen
    panelElement.style.position = 'fixed'
    panelElement.style.bottom = '0'
    panelElement.style.left = '0'
    panelElement.style.right = '0'
    panelElement.style.top = 'auto'
    panelElement.style.width = '100%'
    panelElement.style.maxHeight = '70vh'
    panelElement.style.zIndex = '999999'
  } else {
    // Desktop: position relative to trigger
    const spaceBelow = viewportHeight - triggerRect.bottom
    const spaceAbove = triggerRect.top
    const panelHeight = Math.min(360, filteredOptions.value.length * 48 + 120)
    
    panelElement.style.position = 'fixed'
    panelElement.style.left = triggerRect.left + 'px'
    panelElement.style.width = triggerRect.width + 'px'
    panelElement.style.zIndex = '999999'
    
    if (spaceBelow >= panelHeight || spaceBelow >= spaceAbove) {
      // Position below
      panelElement.style.top = (triggerRect.bottom + 8) + 'px'
      panelElement.style.bottom = 'auto'
      panelElement.style.maxHeight = Math.min(panelHeight, spaceBelow - 16) + 'px'
    } else {
      // Position above
      panelElement.style.bottom = (viewportHeight - triggerRect.top + 8) + 'px'
      panelElement.style.top = 'auto'
      panelElement.style.maxHeight = Math.min(panelHeight, spaceAbove - 16) + 'px'
    }
    
    // Ensure panel doesn't go off screen horizontally
    const panelRect = panelElement.getBoundingClientRect()
    if (panelRect.right > viewportWidth) {
      panelElement.style.left = (viewportWidth - panelRect.width - 16) + 'px'
    }
    if (panelRect.left < 0) {
      panelElement.style.left = '16px'
    }
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
    closeDropdown()
  }
}

const handleResize = () => {
  if (isOpen.value) {
    nextTick(() => {
      positionDropdown()
    })
  }
}

const handleScroll = () => {
  if (isOpen.value && !isMobile.value) {
    positionDropdown()
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
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleScroll, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleScroll, true)
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
  border: 1.5px solid #d1d1d6;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 48px;
  user-select: none;
}

.multiselect-trigger:hover {
  border-color: #a1a1aa;
  background: #fafafa;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.multiselect-trigger.focused,
.multiselect-trigger.open {
  border-color: #007AFF;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.15);
  background: #ffffff;
  transform: translateY(0);
}

.multiselect-trigger.has-selections {
  border-color: #007AFF;
  background: #f0f8ff;
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
  font-size: 12px;
  font-weight: 600;
  color: #007AFF;
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
  background: #e3f2fd;
  color: #1976d2;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #bbdefb;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.more-count {
  background: #f5f5f5;
  color: #666;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.trigger-icon {
  color: #8e8e93;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  margin-left: 12px;
}

.trigger-icon.rotated {
  transform: rotate(180deg);
}

.dropdown-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999998;
  backdrop-filter: blur(4px);
}

.dropdown-panel {
  background: #ffffff;
  border: 1px solid #d1d1d6;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  z-index: 999999;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(20px);
  position: fixed;
}

.dropdown-panel.mobile-panel {
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.2);
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
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 1.5px solid #d1d1d6;
  border-radius: 10px;
  font-size: 16px;
  background: #ffffff;
  transition: all 0.2s ease;
  color: #1c1c1e;
}

.search-input:focus {
  outline: none;
  border-color: #007AFF;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.15);
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
  gap: 8px;
}

.select-all-btn,
.clear-all-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
}

.select-all-btn {
  background: #007AFF;
  color: white;
}

.select-all-btn:hover {
  background: #0056b3;
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
  overscroll-behavior: contain;
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
  position: relative;
}

.option-item:hover {
  background: #f9f9f9;
  border-left-color: #d1d1d6;
}

.option-item.selected {
  background: #f0f8ff;
  border-left-color: #007AFF;
}

.option-item:active {
  background: #e3f2fd;
  transform: scale(0.98);
}

.option-checkbox {
  position: relative;
  flex-shrink: 0;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d1d6;
  border-radius: 6px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.checkbox-custom.checked {
  background: #007AFF;
  border-color: #007AFF;
  color: #ffffff;
  transform: scale(1.1);
}

.check-icon {
  color: #ffffff;
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
  padding: 40px 20px;
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
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 500;
}

.no-options span {
  font-size: 14px;
  opacity: 0.7;
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

/* Animations */
.dropdown-enter-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.check-enter-active,
.check-leave-active {
  transition: all 0.2s ease;
}

.check-enter-from,
.check-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

/* Scrollbar styling */
.options-list::-webkit-scrollbar {
  width: 8px;
}

.options-list::-webkit-scrollbar-track {
  background: #f2f2f7;
  border-radius: 4px;
}

.options-list::-webkit-scrollbar-thumb {
  background: #c7c7cc;
  border-radius: 4px;
  border: 2px solid #f2f2f7;
}

.options-list::-webkit-scrollbar-thumb:hover {
  background: #aeaeb2;
}

@media (max-width: 768px) {
  .multiselect-trigger {
    padding: 10px 12px;
    min-height: 44px;
  }
  
  .selected-preview {
    gap: 4px;
  }
  
  .preview-tag {
    max-width: 100px;
    font-size: 12px;
    padding: 2px 6px;
  }
  
  .search-input {
    font-size: 16px; /* Prevents zoom on iOS */
    padding: 10px 16px 10px 36px;
  }
  
  .option-item {
    padding: 14px 16px;
    min-height: 48px;
  }
  
  .option-text {
    font-size: 16px;
  }
  
  .checkbox-custom {
    width: 22px;
    height: 22px;
  }
  
  .check-icon {
    width: 16px;
    height: 16px;
  }
  
  .options-header {
    padding: 16px;
  }
  
  .select-all-btn,
  .clear-all-btn {
    padding: 12px 16px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .multiselect-trigger {
    padding: 8px 10px;
    min-height: 40px;
  }
  
  .selected-preview {
    gap: 3px;
  }
  
  .preview-tag {
    padding: 2px 5px;
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
  
  .option-item {
    padding: 12px;
  }
  
  .checkbox-custom {
    width: 20px;
    height: 20px;
  }
  
  .check-icon {
    width: 14px;
    height: 14px;
  }
  
  .selected-count {
    font-size: 11px;
  }
  
  .more-count {
    font-size: 11px;
    padding: 2px 6px;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .multiselect-trigger {
    border-width: 2px;
  }
  
  .checkbox-custom {
    border-width: 2px;
  }
  
  .option-item.selected {
    background: #000;
    color: #fff;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>