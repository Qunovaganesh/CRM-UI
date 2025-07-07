<template>
  <div class="multi-select-dropdown" ref="dropdown">
    <div class="dropdown-header" @click="toggleDropdown">
      <span class="placeholder" v-if="selected.length === 0">Select options</span>
      <span class="selected-count" v-else>{{ selected.length }} selected</span>
      <span class="dropdown-arrow">▾</span>
    </div>
    <div class="dropdown-options" v-if="isOpen">
      <div class="search-box" v-if="searchable">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Search..." 
          @click.stop
        />
      </div>
      <div class="options-list">
        <label 
          v-for="option in filteredOptions" 
          :key="option" 
          class="option-item"
        >
          <input 
            type="checkbox" 
            :value="option" 
            v-model="localSelected" 
            @click.stop
          />
          <span>{{ option }}</span>
        </label>
      </div>
    </div>
    <div class="selected-tags" v-if="selected.length > 0 && !isOpen">
      <span 
        v-for="(item, index) in selected.slice(0, 2)" 
        :key="item" 
        class="tag"
      >
        {{ item }}
      </span>
      <span class="more-tag" v-if="selected.length > 2">
        +{{ selected.length - 2 }} more
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    selected: {
      type: Array,
      required: true
    },
    searchable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isOpen: false,
      searchTerm: '',
      localSelected: []
    }
  },
  computed: {
    filteredOptions() {
      if (!this.searchTerm) return this.options
      return this.options.filter(option =>
        option.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    }
  },
  watch: {
    selected: {
      handler(newVal) {
        this.localSelected = [...newVal]
      },
      immediate: true
    },
    localSelected(newVal) {
      this.$emit('update:selected', newVal)
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.searchTerm = ''
      }
    },
    handleClickOutside(event) {
      if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
        this.isOpen = false
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
.multi-select-dropdown {
  position: relative;
  width: 100%;
}

.dropdown-header {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.placeholder {
  color: #999;
}

.selected-count {
  font-weight: 500;
}

.dropdown-arrow {
  margin-left: 8px;
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 100;
  margin-top: 4px;
}

.search-box {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.search-box input {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.options-list {
  padding: 4px 0;
}

.option-item {
  display: block;
  padding: 8px 16px;
  cursor: pointer;
}

.option-item:hover {
  background: #f5f5f5;
}

.option-item input {
  margin-right: 8px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}

.tag {
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.more-tag {
  color: #6c757d;
  font-size: 12px;
}
</style>