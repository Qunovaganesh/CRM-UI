<template>
  <div class="registration-page">
    <div class="page-header">
      <h1>New Lead Registration</h1>
      <p>Register a new lead in the system</p>
    </div>

    <!-- Lead Category Toggle -->
    <div class="lead-category-section">
      <h2>Lead Category</h2>
      <div class="category-toggle">
        <button 
          class="category-btn"
          :class="{ active: leadCategory === 'manufacturer' }"
          @click="leadCategory = 'manufacturer'"
        >
          <span class="category-icon">🏭</span>
          <span>Manufacturer</span>
        </button>
        <button 
          class="category-btn"
          :class="{ active: leadCategory === 'super-stockist' }"
          @click="leadCategory = 'super-stockist'"
        >
          <span class="category-icon">📦</span>
          <span>Super Stockist</span>
        </button>
        <button 
          class="category-btn"
          :class="{ active: leadCategory === 'distributor' }"
          @click="leadCategory = 'distributor'"
        >
          <span class="category-icon">🏪</span>
          <span>Distributor</span>
        </button>
      </div>
    </div>

    <!-- Registration Form -->
    <form @submit.prevent="submitForm" class="registration-form">
      
      <!-- Manufacturer Form -->
      <div v-if="leadCategory === 'manufacturer'" class="form-section manufacturer-form">
        
        <!-- Contact Info -->
        <div class="section-card">
          <h3>Contact Information</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Salutation</label>
              <input 
                type="text" 
                v-model="manufacturerForm.salutation" 
                placeholder="Enter salutation"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Designation</label>
              <input 
                type="text" 
                v-model="manufacturerForm.designation" 
                placeholder="Enter designation"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Phone 2</label>
              <input 
                type="tel" 
                v-model="manufacturerForm.phone2" 
                placeholder="Enter phone number"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Name *</label>
              <input 
                type="text" 
                v-model="manufacturerForm.name" 
                placeholder="Enter name"
                class="form-input"
                required
              />
            </div>
            <div class="form-group">
              <label>Mobile No.</label>
              <input 
                type="tel" 
                v-model="manufacturerForm.mobile" 
                placeholder="Enter mobile number"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input 
                type="email" 
                v-model="manufacturerForm.email" 
                placeholder="Enter email"
                class="form-input"
              />
            </div>
          </div>
        </div>

        <!-- Company Profile -->
        <div class="section-card">
          <h3>Company Profile</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Company Name *</label>
              <input 
                type="text" 
                v-model="manufacturerForm.companyName" 
                placeholder="Enter company name as per GST"
                class="form-input"
                required
              />
            </div>
            <div class="form-group">
              <label>Staff Strength</label>
              <select v-model="manufacturerForm.staffStrength" class="form-select">
                <option value="">Select</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-100">51-100</option>
                <option value="100+">100+</option>
              </select>
            </div>
            <div class="form-group">
              <label>Brand Name</label>
              <input 
                type="text" 
                v-model="manufacturerForm.brandName1" 
                placeholder="Enter Brand Name"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Inspirational</label>
              <textarea 
                v-model="manufacturerForm.inspirational" 
                placeholder="Anything unique or interesting about this company"
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>
            <div class="form-group">
              <label>Brand Name 2</label>
              <input 
                type="text" 
                v-model="manufacturerForm.brandName2" 
                placeholder="Enter Brand Name"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Brand Name 3</label>
              <input 
                type="text" 
                v-model="manufacturerForm.brandName3" 
                placeholder="Enter Brand Name"
                class="form-input"
              />
            </div>
          </div>
        </div>

        <!-- Address Section -->
        <div class="section-card">
          <h3>Address</h3>
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Address</label>
              <textarea 
                v-model="addressForm.streetAddress" 
                placeholder="Enter Door No. and Area Name"
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>
            <div class="form-group">
              <label>Pincode *</label>
              <input 
                type="text" 
                v-model="addressForm.pincode" 
                @blur="fetchLocationData"
                placeholder="Enter Pincode"
                class="form-input"
                maxlength="6"
                required
              />
            </div>
            <div class="form-group">
              <label>City</label>
              <input 
                type="text" 
                v-model="addressForm.city" 
                placeholder="Enter City"
                class="form-input"
                :readonly="isLocationAutoFilled"
              />
            </div>
            <div class="form-group">
              <label>District</label>
              <input 
                type="text" 
                v-model="addressForm.district" 
                placeholder="Enter District"
                class="form-input"
                :readonly="isLocationAutoFilled"
              />
            </div>
            <div class="form-group">
              <label>State</label>
              <input 
                type="text" 
                v-model="addressForm.state" 
                placeholder="Enter State"
                class="form-input"
                :readonly="isLocationAutoFilled"
              />
            </div>
          </div>
        </div>

        <!-- Presence -->
        <div class="section-card">
          <h3>Presence</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Category</label>
              <ModernMultiSelect 
                :options="filterOptions.categories"
                :selected="manufacturerForm.categories"
                placeholder="Select categories..."
                @update:selected="(val) => updateManufacturerCategories(val)"
              />
            </div>
            <div class="form-group">
              <label>Sub Category</label>
              <ModernMultiSelect 
                :options="availableManufacturerSubCategories"
                :selected="manufacturerForm.subCategories"
                placeholder="Select sub-categories..."
                @update:selected="(val) => manufacturerForm.subCategories = val"
              />
            </div>
            <div class="form-group">
              <label>Exporting?</label>
              <select v-model="manufacturerForm.exporting" class="form-select">
                <option value="">Select Yes or No</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div class="form-group">
              <label>Catalogue</label>
              <input 
                type="file" 
                @change="handleFileUpload"
                class="form-file"
                accept=".pdf,.doc,.docx"
              />
            </div>
            <div class="form-group">
              <label>No. of current distributors</label>
              <input 
                type="number" 
                v-model="manufacturerForm.currentDistributors" 
                placeholder="Enter the number of distributors"
                class="form-input"
              />
            </div>
            <div class="form-group full-width">
              <label>Presence in states</label>
              <textarea 
                v-model="manufacturerForm.presenceStates" 
                placeholder="Enter states"
                class="form-textarea"
                rows="2"
              ></textarea>
            </div>
            <div class="form-group full-width">
              <label>Presence in districts</label>
              <textarea 
                v-model="manufacturerForm.presenceDistricts" 
                placeholder="Enter districts"
                class="form-textarea"
                rows="2"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Financial Stance -->
        <div class="section-card">
          <h3>Financial Stance</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Annual Revenue</label>
              <input 
                type="text" 
                v-model="manufacturerForm.annualRevenue" 
                placeholder="Figures in Lakhs"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Listed?</label>
              <select v-model="manufacturerForm.listed" class="form-select">
                <option value="">Select Yes or No</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Expansion Appetite -->
        <div class="section-card">
          <h3>Expansion Appetite</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>No. of distributors needed</label>
              <select v-model="manufacturerForm.distributorsNeeded" class="form-select">
                <option value="">Select</option>
                <option value="1-5">1-5</option>
                <option value="6-10">6-10</option>
                <option value="11-20">11-20</option>
                <option value="20+">20+</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label>Distributor needed in districts</label>
              <textarea 
                v-model="manufacturerForm.distributorNeededDistricts" 
                placeholder="Enter districts"
                class="form-textarea"
                rows="2"
              ></textarea>
            </div>
            <div class="form-group full-width">
              <label>Distributor needed in states</label>
              <ModernMultiSelect 
                :options="filterOptions.states"
                :selected="manufacturerForm.distributorNeededStates"
                placeholder="Select states..."
                @update:selected="(val) => updateManufacturerStates(val)"
              />
            </div>
          </div>
        </div>

        <!-- Desired Distributor Profile -->
        <div class="section-card">
          <h3>Desired Distributor Profile</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Minimum Order Value</label>
              <input 
                type="text" 
                v-model="manufacturerForm.minimumOrderValue" 
                placeholder="Figures in lakhs"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Margin for the distributor</label>
              <input 
                type="text" 
                v-model="manufacturerForm.distributorMargin" 
                placeholder="Enter margin percent"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Logistics</label>
              <select v-model="manufacturerForm.logistics" class="form-select">
                <option value="">Select logistics</option>
                <option value="self">Self Managed</option>
                <option value="third-party">Third Party</option>
                <option value="distributor">Distributor Managed</option>
              </select>
            </div>
            <div class="form-group">
              <label>Margin Range</label>
              <input 
                type="text" 
                v-model="manufacturerForm.marginRange" 
                placeholder="Enter margin range __% to __%"
                class="form-input"
              />
            </div>
            <div class="form-group full-width">
              <label>Warehouse space needs</label>
              <input 
                type="text" 
                v-model="manufacturerForm.warehouseSpace" 
                placeholder="Enter Space in Sq Ft."
                class="form-input"
              />
            </div>
          </div>
        </div>

      </div>

      <!-- Super Stockist / Distributor Form -->
      <div v-else class="form-section distributor-form">
        
        <!-- Contact Info -->
        <div class="section-card">
          <h3>Contact Information</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Salutation</label>
              <input 
                type="text" 
                v-model="distributorForm.salutation" 
                placeholder="Enter salutation"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Designation</label>
              <input 
                type="text" 
                v-model="distributorForm.designation" 
                placeholder="Enter designation"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Phone 2</label>
              <input 
                type="tel" 
                v-model="distributorForm.phone2" 
                placeholder="Enter phone number"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Name *</label>
              <input 
                type="text" 
                v-model="distributorForm.name" 
                placeholder="Enter name"
                class="form-input"
                required
              />
            </div>
            <div class="form-group">
              <label>Mobile No.</label>
              <input 
                type="tel" 
                v-model="distributorForm.mobile" 
                placeholder="Enter mobile number"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input 
                type="email" 
                v-model="distributorForm.email" 
                placeholder="Enter email"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Middle Name</label>
              <input 
                type="text" 
                v-model="distributorForm.middleName" 
                placeholder="Enter middle name"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Source</label>
              <input 
                type="text" 
                v-model="distributorForm.source" 
                placeholder="Lead source"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Lead Owner</label>
              <input 
                type="text" 
                v-model="distributorForm.leadOwner" 
                placeholder="Lead owner"
                class="form-input"
                readonly
              />
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input 
                type="text" 
                v-model="distributorForm.lastName" 
                placeholder="Enter last name"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Status *</label>
              <select v-model="distributorForm.status" class="form-select" required>
                <option value="">Select Status</option>
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="customer">Customer</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Company Profile -->
        <div class="section-card">
          <h3>Company Profile</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>{{ leadCategory === 'super-stockist' ? 'Super Stockist' : 'Distributor' }}? *</label>
              <select v-model="distributorForm.type" class="form-select" required>
                <option value="">Select</option>
                <option value="super-stockist">Super Stockist</option>
                <option value="distributor">Distributor</option>
              </select>
            </div>
            <div class="form-group">
              <label>Staff Strength</label>
              <select v-model="distributorForm.staffStrength" class="form-select">
                <option value="">Select</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-100">51-100</option>
                <option value="100+">100+</option>
              </select>
            </div>
            <div class="form-group">
              <label>Company Name *</label>
              <input 
                type="text" 
                v-model="distributorForm.companyName" 
                placeholder="Enter company name as per GST"
                class="form-input"
                required
              />
            </div>
            <div class="form-group">
              <label>No. of brands dealing with currently</label>
              <select v-model="distributorForm.brandsCount" class="form-select">
                <option value="">Select</option>
                <option value="1-5">1-5</option>
                <option value="6-10">6-10</option>
                <option value="11-20">11-20</option>
                <option value="20+">20+</option>
              </select>
            </div>
            <div class="form-group">
              <label>Website</label>
              <input 
                type="url" 
                v-model="distributorForm.website" 
                placeholder="Enter website"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Manufacturer's States</label>
              <input 
                type="text" 
                v-model="distributorForm.manufacturerStates" 
                placeholder="Select the states from where your are currently sourcing"
                class="form-input"
              />
            </div>
            <div class="form-group full-width">
              <label>Category</label>
              <ModernMultiSelect 
                :options="filterOptions.categories"
                :selected="distributorForm.categories"
                placeholder="Select categories..."
                @update:selected="(val) => updateDistributorCategories(val)"
              />
            </div>
            <div class="form-group full-width">
              <label>Sub Category</label>
              <ModernMultiSelect 
                :options="availableDistributorSubCategories"
                :selected="distributorForm.subCategories"
                placeholder="Select sub-categories..."
                @update:selected="(val) => distributorForm.subCategories = val"
              />
            </div>
            <div class="form-group full-width">
              <label>Manufacturer's Districts</label>
              <input 
                type="text" 
                v-model="distributorForm.manufacturerDistricts" 
                placeholder="Enter districts"
                class="form-input"
              />
            </div>
          </div>
        </div>

        <!-- Address Section -->
        <div class="section-card">
          <h3>Address</h3>
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Address</label>
              <ModernMultiSelect 
                :options="availableManufacturerDistricts"
                :selected="manufacturerForm.distributorNeededDistricts"
                placeholder="Select districts..."
                @update:selected="(val) => manufacturerForm.distributorNeededDistricts = val"
              />
            </div>
            <div class="form-group">
              <label>Pincode *</label>
              <input 
                type="text" 
                v-model="addressForm.pincode" 
                @blur="fetchLocationData"
                placeholder="Enter Pincode"
                class="form-input"
                maxlength="6"
                required
              />
            </div>
            <div class="form-group">
              <label>City</label>
              <input 
                type="text" 
                v-model="addressForm.city" 
                placeholder="Enter City"
                class="form-input"
                :readonly="isLocationAutoFilled"
              />
            </div>
            <div class="form-group">
              <label>District</label>
              <input 
                type="text" 
                v-model="addressForm.district" 
                placeholder="Enter District"
                class="form-input"
                :readonly="isLocationAutoFilled"
              />
            </div>
            <div class="form-group">
              <label>State</label>
              <input 
                type="text" 
                v-model="addressForm.state" 
                placeholder="Enter State"
                class="form-input"
                :readonly="isLocationAutoFilled"
              />
            </div>
          </div>
        </div>

        <!-- Operational Information -->
        <div class="section-card">
          <h3>Operational Information</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Which accounting system you are using?</label>
              <input 
                type="text" 
                v-model="distributorForm.accountingSystem" 
                placeholder="Enter accounting system"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Willingness to bear logistics</label>
              <select v-model="distributorForm.logisticsWillingness" class="form-select">
                <option value="">Select Yes or No</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div class="form-group">
              <label>Which app you are using for SFA?</label>
              <input 
                type="text" 
                v-model="distributorForm.sfaApp" 
                placeholder="Enter SFA app"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>No. of warehouses you have</label>
              <select v-model="distributorForm.warehouseCount" class="form-select">
                <option value="">Select</option>
                <option value="1">1</option>
                <option value="2-5">2-5</option>
                <option value="6-10">6-10</option>
                <option value="10+">10+</option>
              </select>
            </div>
            <div class="form-group">
              <label>Which app you are using for DMS?</label>
              <input 
                type="text" 
                v-model="distributorForm.dmsApp" 
                placeholder="Enter DMS app"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Total space in Sq ft.</label>
              <input 
                type="text" 
                v-model="distributorForm.totalSpace" 
                placeholder="Enter total space"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Which Warehouse management system you are using?</label>
              <input 
                type="text" 
                v-model="distributorForm.warehouseManagementSystem" 
                placeholder="Enter warehouse management system"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Count of field sales force</label>
              <select v-model="distributorForm.salesForceCount" class="form-select">
                <option value="">Select</option>
                <option value="1-5">1-5</option>
                <option value="6-10">6-10</option>
                <option value="11-20">11-20</option>
                <option value="20+">20+</option>
              </select>
            </div>
            <div class="form-group">
              <label>Do you have your own sales force?</label>
              <select v-model="distributorForm.ownSalesForce" class="form-select">
                <option value="">Select Yes or No</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Expansion Appetite -->
        <div class="section-card">
          <h3>Expansion Appetite</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Categories interested in</label>
              <ModernMultiSelect 
                :options="filterOptions.categories"
                :selected="distributorForm.categoriesInterested"
                placeholder="Select categories..."
                @update:selected="(val) => distributorForm.categoriesInterested = val"
              />
            </div>
            <div class="form-group">
              <label>Need manufacturers from States</label>
              <ModernMultiSelect 
                :options="filterOptions.states"
                :selected="distributorForm.needManufacturerStates"
                placeholder="Select states..."
                @update:selected="(val) => updateDistributorNeededStates(val)"
              />
            </div>
            <div class="form-group">
              <label>Interested in dealing in how many new brands</label>
              <select v-model="distributorForm.newBrandsInterest" class="form-select">
                <option value="">Select</option>
                <option value="1-2">1-2</option>
                <option value="3-5">3-5</option>
                <option value="6-10">6-10</option>
                <option value="10+">10+</option>
              </select>
            </div>
            <div class="form-group">
              <label>Need manufacturers from Districts</label>
              <ModernMultiSelect 
                :options="availableDistributorNeededDistricts"
                :selected="distributorForm.needManufacturerDistricts"
                placeholder="Select districts..."
                @update:selected="(val) => distributorForm.needManufacturerDistricts = val"
              />
            </div>
          </div>
        </div>

        <!-- Financial Stance -->
        <div class="section-card">
          <h3>Financial Stance</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Distributor Annual Revenue</label>
              <input 
                type="text" 
                v-model="distributorForm.annualRevenue" 
                placeholder="Figures in Lakhs"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Margin % range from current brands</label>
              <input 
                type="text" 
                v-model="distributorForm.marginRange" 
                placeholder="Enter Min__ and Max__"
                class="form-input"
              />
            </div>
          </div>
        </div>

      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button type="button" class="btn-secondary" @click="resetForm">
          Reset Form
        </button>
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : 'Save Lead' }}
        </button>
      </div>

    </form>

    <!-- Loading Overlay -->
    <div v-if="isLoadingLocation" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Fetching location data...</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBusinessLogic } from '../composables/useBusinessLogic'
import ModernMultiSelect from '../components/ModernMultiSelect.vue'
import { filterOptions, locationMapping, industryToCategoryMapping } from '../data/mockData'

const router = useRouter()
const { manufacturers, distributors } = useBusinessLogic()

// Form state
const leadCategory = ref<'manufacturer' | 'super-stockist' | 'distributor'>('manufacturer')
const isSubmitting = ref(false)
const isLoadingLocation = ref(false)
const isLocationAutoFilled = ref(false)

// Address form (common across all types)
const addressForm = reactive({
  streetAddress: '',
  pincode: '',
  city: '',
  district: '',
  state: ''
})

// Manufacturer form
const manufacturerForm = reactive({
  salutation: '',
  designation: '',
  phone2: '',
  name: '',
  mobile: '',
  email: '',
  companyName: '',
  staffStrength: '',
  brandName1: '',
  inspirational: '',
  brandName2: '',
  brandName3: '',
  categories: [] as string[],
  subCategories: [] as string[],
  exporting: '',
  currentDistributors: '',
  presenceStates: '',
  presenceDistricts: '',
  annualRevenue: '',
  listed: '',
  distributorsNeeded: '',
  distributorNeededDistricts: [] as string[],
  distributorNeededStates: [] as string[],
  minimumOrderValue: '',
  distributorMargin: '',
  logistics: '',
  marginRange: '',
  warehouseSpace: ''
})

// Distributor/Super Stockist form
const distributorForm = reactive({
  salutation: '',
  designation: '',
  phone2: '',
  name: '',
  mobile: '',
  email: '',
  middleName: '',
  source: '',
  leadOwner: 'ganesh.t@qunovatec.com',
  lastName: '',
  status: '',
  type: '',
  staffStrength: '',
  companyName: '',
  brandsCount: '',
  website: '',
  manufacturerStates: '',
  categories: [] as string[],
  subCategories: [] as string[],
  manufacturerDistricts: '',
  accountingSystem: '',
  logisticsWillingness: '',
  sfaApp: '',
  warehouseCount: '',
  dmsApp: '',
  totalSpace: '',
  warehouseManagementSystem: '',
  salesForceCount: '',
  ownSalesForce: '',
  categoriesInterested: [] as string[],
  needManufacturerStates: [] as string[],
  newBrandsInterest: '',
  needManufacturerDistricts: [] as string[],
  annualRevenue: '',
  marginRange: ''
})

// Computed properties for dependent dropdowns
const availableManufacturerSubCategories = computed(() => {
  if (manufacturerForm.categories.length > 0) {
    const relatedSubCategories = new Set<string>()
    manufacturerForm.categories.forEach(category => {
      const subCategories = industryToCategoryMapping[category]
      if (subCategories) {
        subCategories.forEach(subCategory => relatedSubCategories.add(subCategory))
      }
    })
    return Array.from(relatedSubCategories)
  }
  return filterOptions.subCategories
})

const availableManufacturerDistricts = computed(() => {
  if (manufacturerForm.distributorNeededStates.length > 0) {
    const relatedDistricts = new Set<string>()
    manufacturerForm.distributorNeededStates.forEach(state => {
      const mapping = locationMapping[state]
      if (mapping) {
        mapping.districts.forEach(district => relatedDistricts.add(district))
      }
    })
    return Array.from(relatedDistricts)
  }
  return filterOptions.districts
})

const availableDistributorSubCategories = computed(() => {
  if (distributorForm.categories.length > 0) {
    const relatedSubCategories = new Set<string>()
    distributorForm.categories.forEach(category => {
      const subCategories = industryToCategoryMapping[category]
      if (subCategories) {
        subCategories.forEach(subCategory => relatedSubCategories.add(subCategory))
      }
    })
    return Array.from(relatedSubCategories)
  }
  return filterOptions.subCategories
})

const availableDistributorNeededDistricts = computed(() => {
  if (distributorForm.needManufacturerStates.length > 0) {
    const relatedDistricts = new Set<string>()
    distributorForm.needManufacturerStates.forEach(state => {
      const mapping = locationMapping[state]
      if (mapping) {
        mapping.districts.forEach(district => relatedDistricts.add(district))
      }
    })
    return Array.from(relatedDistricts)
  }
  return filterOptions.districts
})

// Methods for handling dependent updates
const updateManufacturerCategories = (categories: string[]) => {
  manufacturerForm.categories = categories
  // Clear sub-categories when categories change
  manufacturerForm.subCategories = []
}

const updateManufacturerStates = (states: string[]) => {
  manufacturerForm.distributorNeededStates = states
  // Clear districts when states change
  manufacturerForm.distributorNeededDistricts = []
}

const updateDistributorCategories = (categories: string[]) => {
  distributorForm.categories = categories
  // Clear sub-categories when categories change
  distributorForm.subCategories = []
}

const updateDistributorNeededStates = (states: string[]) => {
  distributorForm.needManufacturerStates = states
  // Clear districts when states change
  distributorForm.needManufacturerDistricts = []
}

// Methods
const fetchLocationData = async () => {
  const pincode = addressForm.pincode.trim()
  
  if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
    return
  }

  isLoadingLocation.value = true
  isLocationAutoFilled.value = false

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    const data = await response.json()
    
    if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice) {
      const postOffice = data[0].PostOffice[0]
      
      addressForm.city = postOffice.Name || postOffice.Block || ''
      addressForm.district = postOffice.District || ''
      addressForm.state = postOffice.State || ''
      
      isLocationAutoFilled.value = true
    } else {
      // Reset fields if no data found
      addressForm.city = ''
      addressForm.district = ''
      addressForm.state = ''
      alert('Invalid pincode or location data not found')
    }
  } catch (error) {
    console.error('Error fetching location data:', error)
    alert('Error fetching location data. Please enter manually.')
  } finally {
    isLoadingLocation.value = false
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    // Handle file upload logic here
    console.log('File uploaded:', target.files[0].name)
  }
}

const resetForm = () => {
  // Reset address form
  Object.keys(addressForm).forEach(key => {
    addressForm[key] = ''
  })
  
  // Reset manufacturer form
  Object.keys(manufacturerForm).forEach(key => {
    if (Array.isArray(manufacturerForm[key])) {
      manufacturerForm[key] = []
    } else {
      manufacturerForm[key] = ''
    }
  })
  
  // Reset distributor form
  Object.keys(distributorForm).forEach(key => {
    if (key === 'leadOwner') {
      distributorForm[key] = 'ganesh.t@qunovatec.com'
    } else if (Array.isArray(distributorForm[key])) {
      distributorForm[key] = []
    } else {
      distributorForm[key] = ''
    }
  })
  
  isLocationAutoFilled.value = false
}

const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    // Generate unique ID
    const timestamp = Date.now()
    const id = leadCategory.value === 'manufacturer' ? `M${timestamp}` : `D${timestamp}`
    
    // Prepare the record based on lead category
    if (leadCategory.value === 'manufacturer') {
      const newManufacturer = {
        id,
        name: manufacturerForm.companyName || manufacturerForm.name,
        city: addressForm.city,
        district: addressForm.district,
        state: addressForm.state,
        category: manufacturerForm.categories[0] || 'General',
        subCategory: manufacturerForm.subCategories[0] || 'General',
        status: 'Registration' as const,
        registrationDate: new Date().toISOString(),
        daysSinceStatus: 0,
        // Store additional manufacturer data
        contactName: manufacturerForm.name,
        email: manufacturerForm.email,
        mobile: manufacturerForm.mobile,
        companyName: manufacturerForm.companyName,
        address: addressForm.streetAddress,
        pincode: addressForm.pincode
      }
      
      // Add to manufacturers array
      manufacturers.value.push(newManufacturer)
      
    } else {
      // For both super-stockist and distributor, treat as distributor
      const newDistributor = {
        id,
        name: distributorForm.companyName || distributorForm.name,
        city: addressForm.city,
        district: addressForm.district,
        state: addressForm.state,
        category: distributorForm.categories[0] || 'General',
        subCategory: distributorForm.subCategories[0] || 'General',
        status: 'Registration' as const,
        registrationDate: new Date().toISOString(),
        daysSinceStatus: 0,
        // Store additional distributor data
        contactName: distributorForm.name,
        email: distributorForm.email,
        mobile: distributorForm.mobile,
        companyName: distributorForm.companyName,
        address: addressForm.streetAddress,
        pincode: addressForm.pincode,
        type: distributorForm.type || leadCategory.value
      }
      
      // Add to distributors array
      distributors.value.push(newDistributor)
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    alert(`${leadCategory.value === 'manufacturer' ? 'Manufacturer' : 'Distributor'} registered successfully!`)
    
    // Reset form and redirect to dashboard
    resetForm()
    router.push('/dashboard')
    
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Error submitting form. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.registration-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background: #f5f5f7;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 8px;
}

.page-header p {
  color: #86868b;
  font-size: 18px;
  font-weight: 300;
}

.lead-category-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #d2d2d7;
}

.lead-category-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 20px 0;
}

.category-toggle {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f5f5f7;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #1d1d1f;
  transition: all 0.3s ease;
  min-width: 160px;
  justify-content: center;
}

.category-btn:hover {
  background: #e8e8ed;
  transform: translateY(-2px);
}

.category-btn.active {
  background: #1c1c1e;
  color: white;
  border-color: #1c1c1e;
  box-shadow: 0 4px 12px rgba(28, 28, 30, 0.3);
}

.category-icon {
  font-size: 18px;
}

.registration-form {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #d2d2d7;
}

.section-card {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f2f2f7;
}

.section-card:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 20px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #f5f5f7;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  align-items: start;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: #1d1d1f;
  font-size: 14px;
  margin-bottom: 4px;
}

.form-input,
.form-select,
.form-textarea {
  padding: 10px 12px;
  border: 1px solid #d2d2d7;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  color: #1d1d1f;
  background: white;
  transition: all 0.2s ease;
  font-family: inherit;
  min-height: 40px;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #1c1c1e;
  box-shadow: 0 0 0 3px rgba(28, 28, 30, 0.1);
}

.form-input:readonly {
  background: #f5f5f7;
  color: #86868b;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 70px;
  padding: 8px 12px;
}

.form-file {
  padding: 6px 10px;
  border: 2px dashed #d2d2d7;
  border-radius: 8px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 40px;
  display: flex;
  align-items: center;
}

.form-file:hover {
  border-color: #1c1c1e;
  background: #f5f5f7;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f2f2f7;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 120px;
}

.btn-primary {
  background: #1c1c1e;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #000000;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #86868b;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: #f5f5f7;
  color: #1d1d1f;
  border: 1px solid #d2d2d7;
}

.btn-secondary:hover {
  background: #e8e8ed;
  transform: translateY(-1px);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: white;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay p {
  font-size: 16px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .registration-page {
    padding: 16px;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
  
  .page-header p {
    font-size: 16px;
  }
  
  .category-toggle {
    flex-direction: column;
    gap: 8px;
  }
  
  .category-btn {
    min-width: auto;
    width: 100%;
  }
  
  .registration-form {
    padding: 20px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
  
  .section-card {
    margin-bottom: 24px;
  }
  
  .section-card h3 {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .registration-page {
    padding: 12px;
  }
  
  .lead-category-section,
  .registration-form {
    padding: 16px;
  }
  
  .form-input,
  .form-select,
  .form-textarea {
    font-size: 14px;
    padding: 8px 10px;
    min-height: 36px;
  }
  
  .category-btn {
    padding: 10px 16px;
    font-size: 14px;
  }
  
  .btn-primary,
  .btn-secondary {
    padding: 10px 20px;
    font-size: 14px;
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