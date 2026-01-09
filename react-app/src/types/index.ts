// Core data types
export interface CarData {
  [feature: string]: string;
}

export interface FileData {
  [carName: string]: CarData;
}

export interface CarFeaturesOrder {
  [carName: string]: string[];
}

// KPI metrics
export interface KPIMetrics {
  totalFeatures: number;
  sameCount: number;
  partialCount: number;
  diffCount: number;
  missingCellCount: number;
  diff2Percent: string;
  diff3Percent: string;
  diff4Percent: string;
}

// Row data for table
export interface RowData {
  feature: string;
  values: string[];
  colorClass: "green" | "yellow" | "red" | "";
  finalValue: string;
  tooltip?: string;
}

// Chart data
export interface ChartData {
  sameCount: number;
  partialCount: number;
  diffCount: number;
  diff2Percent: number;
  diff3Percent: number;
  diff4Percent: number;
}

// Component props
export interface FileUploadProps {
  onFilesProcessed: (
    fileData: FileData[],
    carFeaturesOrder: CarFeaturesOrder,
    allCars: string[],
    fileNames: string[],
    isFile4Uploaded: boolean
  ) => void;
}

export interface KPISectionProps {
  metrics: KPIMetrics;
  isFile4Uploaded: boolean;
}

export interface ChartsSectionProps {
  chartData: ChartData | null;
  isFile4Uploaded: boolean;
}

export interface User {
  _id: string;
  name: string;
}

export interface ComparisonState {
  _id: string;
  country: string;
  brand: string;
  model: string;
  is_exported: boolean;
  exported_at: string | null;
}

export interface CarNavigationProps {
  allCars: string[];
  currentCarIndex: number;
  onCarChange: (index: number) => void;
  users: User[];
  selectedUserId: string;
  onUserChange: (userId: string) => void;
  usersLoading: boolean;
  usersError: string | null;
}

export interface DataTableProps {
  carName: string;
  rows: RowData[];
  fileNames: string[];
  isFile4Uploaded: boolean;
  onFinalValueChange: (feature: string, value: string) => void;
  onCellValueChange: (
    feature: string,
    fileIndex: number,
    value: string
  ) => void;
}

export interface LegendProps {}

export interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ExportControlsProps {
  onExportCurrentCSV: () => void;
  onExportCurrentExcel: () => void;
  onExportAllCSV: () => void;
  onExportAllExcel: () => void;
}

export interface SearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export type Row = {
  feature: string;
  values: any[];
  finalValue: any;
};

// 31 General Features
export interface General {
  msrp?: Number | null;
  leasing_conditions?: Number | null;
  leasing_provider1?: Number | null;
  leasing_provider2?: Number | null;
  leasing_provider3?: Number | null;
  leasing_provider4?: Number | null;
  model_year?: Number | null;
  car_length?: Number | null;
  car_width_without_mirrors?: Number | null;
  car_width_mirrors_unfolded?: Number | null;
  car_width_mirrors_folded?: Number | null;
  car_height?: Number | null;
  wheelbase?: Number | null;
  body_type?: String | null;
  curb_weight?: Number | null;
  gross_weight?: Number | null;
  seating_capacity?: Number | null;
  cargo_area_rear_seats_up?: Number | null;
  cargo_area_rear_seats_down?: Number | null;
  cargo_area_front?: Number | null;
  car_warranty_duration?: Number | null;
  car_warranty_km?: Number | null;
  battery_warranty_duration?: Number | null;
  battery_warranty_km?: Number | null;
  acceleration?: Number | null;
  top_speed?: Number | null;
  max_towing_weight_braked?: Number | null;
  max_towing_weight_unbraked?: Number | null;
  trailer_preparation?: Number | null;
  electric_trailer_preparation?: Number | null;
  standard_wheel_size?: Number | null;
}

// 23 Battery Motor Features
export interface BatteryMotor {
  drive_type?: String | null;
  engine_type?: String | null;
  battery_capacity?: Number | null;
  electric_range_wltp?: Number | null;
  wltp?: Number | null;
  city_consumption?: Number | null;
  highway_consumption?: Number | null;
  combined_consumption?: Number | null;
  ac_charging_time?: String | null;
  standard_ac_charging_kw?: Number | null;
  max_ac_charging_kw?: Number | null;
  dc_charging_time?: String | null;
  standard_dc_charging_kw?: Number | null;
  max_dc_charging_kw?: Number | null;
  voltage_architecture?: String | null;
  motor_power_kw?: Number | null;
  motor_power_hp?: Number | null;
  torque_nm?: Number | null;
  torque_lb_ft?: Number | null;
  heat_pump?: Number | null;
  one_pedal_driving_capability?: Number | null;
  electronic_handbrake?: Number | null;
  auto_hold?: Number | null;
}

// 10 Access Storage Features
export interface AccessStorage {
  keyless_entry_key_fob?: number | null;
  digital_key_entry_ccc?: number | null;
  digital_key_entry_bluetooth?: number | null;
  digital_key_start?: number | null;
  electric_tailgate?: number | null;
  hands_free_tailgate?: number | null;
  remote_trunk_opening?: string | null;
  cargo_mgmt_adjustable_floor?: number | null;
  cargo_mgmt_tie_down_hooks?: number | null;
  rear_seat_folding?: string | null;
}

// 22 Adas Features
export interface Adas {
  traffic_sign_recognition?: number | null;
  "360_degree_camera"?: number | null;
  front_view_camera?: number | null;
  rear_view_camera?: number | null;
  adaptive_cruise_control?: number | null;
  lane_keep_assist?: number | null;
  blind_spot_monitoring?: number | null;
  forward_collision_warning?: number | null;
  rear_cross_traffic_alert?: number | null;
  automatic_emergency_braking_front?: number | null;
  automatic_emergency_braking_rear?: number | null;
  automatic_emergency_braking_parking?: number | null;
  automatic_emergency_steering_front?: number | null;
  automatic_emergency_steering_rear?: number | null;
  door_exit_warning?: number | null;
  parking_sensors_front?: number | null;
  parking_sensors_rear?: number | null;
  parking_sensors_technology?: String | null;
  self_parking_feature?: number | null;
  driver_attention_monitoring?: number | null;
  sentry_mode?: number | null;
  dashcam?: number | null;
}

// 17 Light Features
export interface Light {
  led_headlights?: Number | null;
  matrix_led_headlights?: Number | null;
  halogen_headlights?: Number | null;
  xenon_headlights?: Number | null;
  laser_headlights?: Number | null;
  digital_headlights?: Number | null;
  adaptive_headlights?: Number | null;
  led_daytime_running_lights?: Number | null;
  fog_lights_front?: Number | null;
  fog_lights_rear?: Number | null;
  led_fog_lights?: Number | null;
  halogen_fog_lights?: Number | null;
  led_tail_lights?: Number | null;
  automatic_high_beam?: Number | null;
  welcome_light?: Number | null;
  exit_light?: Number | null;
  puddle_light?: Number | null;
}
// 31 Interior Features
export interface Interior {
  leather_upholstery?: Number | null;
  synthetic_leather?: Number | null;
  alcantara_suede?: Number | null;
  vegan_interior_option?: Number | null;
  fabric_seats?: Number | null;
  seat_heating_front?: Number | null;
  seat_heating_back?: Number | null;
  ventilated_seats_front?: Number | null;
  ventilated_seats_front_number?: Number | null;
  ventilated_seats_rear?: Number | null;
  ventilated_seats_rear_number?: Number | null;
  driver_seat_adjustability?: String | null;
  driver_seat_memory_settings?: Number | null;
  passenger_seat_adjustability?: String | null;
  passenger_seat_memory_settings?: Number | null;
  driver_seat_massage_function?: Number | null;
  passenger_seat_massage_function?: Number | null;
  steering_wheel_heated?: Number | null;
  multifunctional_steering_wheel?: Number | null;
  steering_whel_material?: String | null;
  climate_control?: String | null;
  air_purification_system?: Number | null;
  standard_sound_system_brand?: String | null;
  standard_sound_system_number_of_speakers?: Number | null;
  optional_sound_system?: Number | null;
  optional_sound_system_brand?: Number | null;
  optional_sound_system_number_of_speakers?: Number | null;
  subwoofer?: Number | null;
  ambient_lighting?: Number | null;
  "number_of_colors/themes"?: Number | null;
  customizable_lighting?: Number | null;
}

// 13 Glass Features
export interface Glass {
  rear_side_windows_tinted?: Number | null;
  rear_side_windows_privacy_glass?: Number | null;
  rear_uv_protection_windows?: Number | null;
  rear_side_window_sunblind_manual?: Number | null;
  rear_side_window_sunblind_electric?: Number | null;
  roof_type?: String | null;
  roof_material?: String | null;
  roof_glass_tinted?: Number | null;
  roof_uv_protection_glass?: Number | null;
  roof_sunblind_manual?: Number | null;
  roof_sunblind_electric?: Number | null;
  electrically_heated_windshield?: Number | null;
  electrically_heated_rear_window?: Number | null;
}

// 19 Safety Technical Features
export interface SafetyTechnical {
  anti_theft_alarm?: Number | null;
  anti_theft_immobilise?: Number | null;
  tire_pressure_monitoring_system?: Number | null;
  isofix?: Number | null;
  stability_control?: String | null;
  braking_system?: String | null;
  frontal_airbag?: Number | null;
  knee_airbag?: Number | null;
  side_head_airbag?: Number | null;
  side_chest_airbag?: Number | null;
  side_pelvis_airbag?: Number | null;
  centre_airbag?: Number | null;
  belt_pretensioner?: Number | null;
  belt_loadlimiter?: Number | null;
  rear_row_side_head_airbag?: Number | null;
  rear_side_chest_airbag?: Number | null;
  rear_side_pelvis_airbag?: Number | null;
  rear_belt_pretensioner?: Number | null;
  rear_belt_loadlimiter?: Number | null;
}

// 56 Connectivity Features
export interface ConnectivityFeature {
  operating_system?: String | null;
  head_up_display?: Number | null;
  central_infotainment_display?: String | null;
  instrument_cluster?: Number | null;
  passenger_screen?: Number | null;
  lower_central_screen?: Number | null;
  rear_seats_screen?: Number | null;
  rotary_push_button?: Number | null;
  voice_control?: Number | null;
  gesture_control?: Number | null;
  ota_updates?: Number | null;
  built_in_internet?: String | null;
  car_wifi_hotspot?: Number | null;
  ev_route_planner?: Number | null;
  realtime_traffic_updates?: Number | null;
  live_map_updates?: Number | null;
  ota_map_updates?: Number | null;
  apple_carplay?: Number | null;
  android_auto?: Number | null;
  inductive_charging?: Number | null;
  number_of_usb_plug?: Number | null;
  number_of_usbc_plug?: Number | null;
  remote_start?: Number | null;
  remote_parking?: Number | null;
  tire_pressure_monitoring?: Number | null;
  fuel_battery_level_monitoring?: Number | null;
  digital_key?: Number | null;
  key_sharing?: Number | null;
  scheduled_charging?: Number | null;
  remote_lock_unlock?: Number | null;
  send_adress_to_car?: Number | null;
  spotify?: Number | null;
  apple_music?: Number | null;
  amazon_music?: Number | null;
  tidal?: Number | null;
  pandora?: Number | null;
  siriusxm?: Number | null;
  tuneln?: Number | null;
  youtube_music?: Number | null;
  deezer?: Number | null;
  youtube?: Number | null;
  netflix?: Number | null;
  amazon_prime_video?: Number | null;
  hulu?: Number | null;
  "disney+"?: Number | null;
  hbo_max?: Number | null;
  "apple_tv+"?: Number | null;
  google_maps?: Number | null;
  waze?: Number | null;
  accuweather?: Number | null;
  chargepoint?: Number | null;
  plugshare?: Number | null;
  twitter?: Number | null;
  facebook?: Number | null;
  whatsapp?: Number | null;
  telegram?: Number | null;
}

// 2 Connectivity Packages
export interface ConnectivityPackage {
  price_of_premium_connectivity?: Number | null;
  duration_of_free_trial?: String | null;
}

export interface FeatureEntry<T, K extends keyof T = keyof T> {
  key: K;
  label: string;
  fileValues: (number | string | boolean | null)[];
  value: T[K] | null;
}

export type Features = {
  general: FeatureEntry<General>[];
  battery_motor: FeatureEntry<BatteryMotor>[];
  access_storage: FeatureEntry<AccessStorage>[];
  adas: FeatureEntry<Adas>[];
  lights: FeatureEntry<Light>[];
  interior: FeatureEntry<Interior>[];
  glasses: FeatureEntry<Glass>[];
  safety_technical: FeatureEntry<SafetyTechnical>[];
  connectivity_features: FeatureEntry<ConnectivityFeature>[];
  connectivity_packages: FeatureEntry<ConnectivityPackage>[];
};

export type SpecFeatures<T> = Partial<{
  [K in keyof T]: T[K] | null;
}>;

export type Specs = {
  general: General;
  battery_motor: BatteryMotor;
  access_storage: AccessStorage;
  adas: Adas;
  lights: Light;
  interior: Interior;
  glasses: Glass;
  safety_technical: SafetyTechnical;
  connectivity_features: ConnectivityFeature;
  connectivity_packages: ConnectivityPackage;
};

export type FeatureMapping<T> = {
  key: keyof T;
  type: "number" | "string" | "boolean";
};

export const GENERAL_FEATURE_MAP: Record<string, FeatureMapping<General>> = {
  "MSRP [€]": { key: "msrp", type: "number" },
  "Leasing Conditions": { key: "leasing_conditions", type: "number" }, // need to change later
  "Leasing Provider 1": { key: "leasing_provider1", type: "number" }, // need to change later
  "Leasing Provider 2": { key: "leasing_provider2", type: "number" }, // need to change later
  "Leasing Provider 3": { key: "leasing_provider3", type: "number" }, // need to change later
  "Leasing Provider 4": { key: "leasing_provider4", type: "number" }, // need to change later
  "Model Year": { key: "model_year", type: "number" },
  "Car length [mm]": { key: "car_length", type: "number" },
  "Car width without mirrors [mm]": {
    key: "car_width_without_mirrors",
    type: "number",
  },
  "Car width mirrors unfolded [mm]": {
    key: "car_width_mirrors_unfolded",
    type: "number",
  },
  "Car width mirrors folded [mm]": {
    key: "car_width_mirrors_folded",
    type: "number",
  },
  "Car height [mm]": { key: "car_height", type: "number" },
  "Wheelbase [mm]": { key: "wheelbase", type: "number" },
  "Body type (sedan, SUV, hatchback)": {
    key: "body_type",
    type: "string",
  },
  "curb weight [kg]": { key: "curb_weight", type: "number" },
  "gross weight [kg]": { key: "gross_weight", type: "number" },
  "Seating capacity (number of seats)": {
    key: "seating_capacity",
    type: "number",
  },
  "Cargo Area Rear (Rear Seats Up) [l]": {
    key: "cargo_area_rear_seats_up",
    type: "number",
  },
  "Cargo Area Rear (Rear Seats Down) [l]": {
    key: "cargo_area_rear_seats_down",
    type: "number",
  },
  "Cargo Area Front (Frunk) [l]": {
    key: "cargo_area_front",
    type: "number",
  },
  "Car warranty duration [years]": {
    key: "car_warranty_duration",
    type: "number",
  },
  "Car warranty duration [km]": {
    key: "car_warranty_km",
    type: "number",
  },
  "Battery warranty duration [years]": {
    key: "battery_warranty_duration",
    type: "number",
  },
  "Battery warranty duration [km]": {
    key: "battery_warranty_km",
    type: "number",
  },
  "Acceleration 0-100 km/h [sec]": { key: "acceleration", type: "number" },
  "Top speed [km/h]": { key: "top_speed", type: "number" },
  "Max towing weight braked [kg]": {
    key: "max_towing_weight_braked",
    type: "number",
  },
  "Max towing weight unbraked [kg]": {
    key: "max_towing_weight_unbraked",
    type: "number",
  },
  "Trailer preparation [Yes/No]": {
    key: "trailer_preparation",
    type: "boolean",
  },
  "Electric trailer preperation [Yes/No]": {
    key: "electric_trailer_preparation",
    type: "boolean",
  },
  'Standard wheel size ["]': { key: "standard_wheel_size", type: "number" },
};

export const BATTERY_FEATURE_MAP: Record<
  string,
  FeatureMapping<BatteryMotor>
> = {
  "Drive type (RWD, FWD, AWD)": { key: "drive_type", type: "string" },
  "Engine Type (Electric, Petrol, Hybrid)": {
    key: "engine_type",
    type: "string",
  },
  "Battery capacity [kWh]": { key: "battery_capacity", type: "number" },
  "Electric range WLTP [km]": { key: "electric_range_wltp", type: "number" },
  "WLTP [km]": { key: "wltp", type: "number" },
  "City consumption (kWh/100km or l/100km)": {
    key: "city_consumption",
    type: "number",
  },
  "Highway consumption (kWh/100km or l/100km)": {
    key: "highway_consumption",
    type: "number",
  },
  "Combined consumption (kWh/100km or l/100km)": {
    key: "combined_consumption",
    type: "number",
  },
  "AC Charging time": { key: "ac_charging_time", type: "string" },
  "Standard AC Charging kw": {
    key: "standard_ac_charging_kw",
    type: "number",
  },
  "Maximum AC Charging kw": { key: "max_ac_charging_kw", type: "number" },
  "DC Charging time": { key: "dc_charging_time", type: "string" },
  "Standard DC Charging kw": {
    key: "standard_dc_charging_kw",
    type: "number",
  },
  "Maximum DC Charging kw": { key: "max_dc_charging_kw", type: "number" },
  "Voltage Architecture (400V/800V)": {
    key: "voltage_architecture",
    type: "string",
  },
  "Motor power kw": { key: "motor_power_kw", type: "number" },
  "motor power hp": { key: "motor_power_hp", type: "number" },
  "Torque Nm": { key: "torque_nm", type: "number" },
  "Torque lb-ft": { key: "torque_lb_ft", type: "number" },
  "Heat pump (Yes/No)": { key: "heat_pump", type: "boolean" },
  "One-pedal driving capability (Yes/No)": {
    key: "one_pedal_driving_capability",
    type: "boolean",
  },
  "Electronic handbrake (Yes/No)": {
    key: "electronic_handbrake",
    type: "boolean",
  },
  "Auto-Hold (Yes/No)": { key: "auto_hold", type: "boolean" },
};

export const ACCESS_STORAGE_FEATURE_MAP: Record<
  string,
  FeatureMapping<AccessStorage>
> = {
  "Keyless entry key fob (Yes/No)": {
    key: "keyless_entry_key_fob",
    type: "number",
  },
  "Digital key entry (CCC) (Yes/No)": {
    key: "digital_key_entry_ccc",
    type: "number",
  },
  "Digital key entry (Bluetooth) (Yes/No)": {
    key: "digital_key_entry_bluetooth",
    type: "number",
  },
  "Digital key start (Yes/No)": { key: "digital_key_start", type: "number" },
  "Electric tailgate (Yes/No)": { key: "electric_tailgate", type: "number" },
  "Hands-free tailgate operation (Yes/No)": {
    key: "hands_free_tailgate",
    type: "number",
  },
  "Remote trunk opening (via app or key fob)": {
    key: "remote_trunk_opening",
    type: "string",
  },
  "Cargo management adjustable floor (Yes/No)": {
    key: "cargo_mgmt_adjustable_floor",
    type: "number",
  },
  "Cargo management tie-down hooks (Yes/No)": {
    key: "cargo_mgmt_tie_down_hooks",
    type: "number",
  },
  "Rear seat folding (60/40 split, 40/20/40 split, flat fold)": {
    key: "rear_seat_folding",
    type: "string",
  },
};

export const ADAS_FEATURE_MAP: Record<string, FeatureMapping<Adas>> = {
  "Traffic sign recognition (Yes/No)": {
    key: "traffic_sign_recognition",
    type: "number",
  },
  "Surround view/360-degree camera (Yes/No)": {
    key: "360_degree_camera",
    type: "number",
  },
  "Front view camera (Yes/No) (Degree)": {
    key: "front_view_camera",
    type: "number",
  },
  "Rear view camera (Yes/No) (Degree)": {
    key: "rear_view_camera",
    type: "number",
  },
  "Adaptive cruise control (Yes/No)": {
    key: "adaptive_cruise_control",
    type: "number",
  },
  "Lane keep assist (Yes/No)": {
    key: "lane_keep_assist",
    type: "number",
  },
  "Blind spot monitoring (Yes/No)": {
    key: "blind_spot_monitoring",
    type: "number",
  },
  "Forward Collision Warning (Yes/No)": {
    key: "forward_collision_warning",
    type: "number",
  },
  "Rear Cross Traffic Alert (Yes/No)": {
    key: "rear_cross_traffic_alert",
    type: "number",
  },
  "Automatic emergency braking front (Yes/No)": {
    key: "automatic_emergency_braking_front",
    type: "number",
  },
  "Automatic emergency braking rear (Yes/No)": {
    key: "automatic_emergency_braking_rear",
    type: "number",
  },
  "Automatic emergency braking for parking (Yes/No)": {
    key: "automatic_emergency_braking_parking",
    type: "number",
  },
  "Automatic emergency steering intervention front (Yes/No)": {
    key: "automatic_emergency_steering_front",
    type: "number",
  },
  "Automatic emergency steering intervention rear (Yes/No)": {
    key: "automatic_emergency_steering_rear",
    type: "number",
  },
  "Door Exit Warning (Yes/No)": {
    key: "door_exit_warning",
    type: "number",
  },
  "Parking sensors front (Yes/No)": {
    key: "parking_sensors_front",
    type: "number",
  },
  "Parking sensors back (Yes/No)": {
    key: "parking_sensors_rear",
    type: "number",
  },
  "Parking sensor technology (Infrared/Camera)": {
    key: "parking_sensors_technology",
    type: "string",
  },
  "Self-Parking feature (Yes/No)": {
    key: "self_parking_feature",
    type: "number",
  },
  "Driver attention monitoring (Yes/No)": {
    key: "driver_attention_monitoring",
    type: "number",
  },
  "Sentry mode (Yes/No)": {
    key: "sentry_mode",
    type: "number",
  },
  "Dashcam (Yes/No)": {
    key: "dashcam",
    type: "number",
  },
};

export const LIGHT_FEATURE_MAP: Record<string, FeatureMapping<Light>> = {
  "LED headlights (Yes/No)": {
    key: "led_headlights",
    type: "number",
  },
  "Matrix LED headlights (Yes/No)": {
    key: "matrix_led_headlights",
    type: "number",
  },
  "Halogen headlights (Yes/No)": {
    key: "halogen_headlights",
    type: "number",
  },
  "Xenon headlights (Yes/No)": {
    key: "xenon_headlights",
    type: "number",
  },
  "Laser headlights (Yes/No)": {
    key: "laser_headlights",
    type: "number",
  },
  "Digital headlights (DLP) (Yes/No)": {
    key: "digital_headlights",
    type: "number",
  },
  "Adaptive headlights/Curve light (Yes/No)": {
    key: "adaptive_headlights",
    type: "number",
  },
  "LED daytime running lights (Yes/No)": {
    key: "led_daytime_running_lights",
    type: "number",
  },
  "Fog lights front (Yes/No)": {
    key: "fog_lights_front",
    type: "number",
  },
  "Fog lights rear (Yes/No)": {
    key: "fog_lights_rear",
    type: "number",
  },
  "LED Fog lights (Yes/No)": {
    key: "led_fog_lights",
    type: "number",
  },
  "Halogen Fog lights (Yes/No)": {
    key: "halogen_fog_lights",
    type: "number",
  },
  "LED Tail lights (Yes/No)": {
    key: "led_tail_lights",
    type: "number",
  },
  "Automatic high beam (Yes/No)": {
    key: "automatic_high_beam",
    type: "number",
  },
  "Welcome light (Yes/No)": {
    key: "welcome_light",
    type: "number",
  },
  "Exit light (Yes/No)": {
    key: "exit_light",
    type: "number",
  },
  "Puddle light (Yes/No)": {
    key: "puddle_light",
    type: "number",
  },
};

export const INTERIOR_FEATURE_MAP: Record<string, FeatureMapping<Interior>> = {
  "Leather Upholstery (Yes/No)": {
    key: "leather_upholstery",
    type: "number",
  },
  "Synthetic Leather (Yes/No)  (Vegan Yes/No)": {
    key: "synthetic_leather",
    type: "number",
  },
  "Alcantara / Suede (Yes/No)": {
    key: "alcantara_suede",
    type: "number",
  },
  "Vegan interior option (Yes/No)": {
    key: "vegan_interior_option",
    type: "number",
  },
  "Fabric seats (Yes/No)": {
    key: "fabric_seats",
    type: "number",
  },
  "Seat heating front (Yes/No)": {
    key: "seat_heating_front",
    type: "number",
  },
  "Seat heating back (Yes/No)": {
    key: "seat_heating_back",
    type: "number",
  },
  "Ventilated seats front (Yes/No)": {
    key: "ventilated_seats_front",
    type: "number",
  },
  "Ventilated seats front number": {
    key: "ventilated_seats_front_number",
    type: "number",
  },
  "Ventilated seats rear (Yes/No)": {
    key: "ventilated_seats_rear",
    type: "number",
  },
  "Ventilated seats rear number": {
    key: "ventilated_seats_rear_number",
    type: "number",
  },
  "Driver seat adjustability (manual, electric)": {
    key: "driver_seat_adjustability",
    type: "number",
  },
  "Driver seat memory settings (Yes/No)": {
    key: "driver_seat_memory_settings",
    type: "number",
  },
  "Passenger seat adjustability (manual, electric)": {
    key: "passenger_seat_adjustability",
    type: "number",
  },
  "Passenger seat memory settings (Yes/No)": {
    key: "passenger_seat_memory_settings",
    type: "number",
  },
  "Driver seat massage function (Yes/No)": {
    key: "driver_seat_massage_function",
    type: "number",
  },
  "Passenger seat massage function (Yes/No)": {
    key: "passenger_seat_massage_function",
    type: "number",
  },
  "Steering wheel heated (Yes/No)": {
    key: "steering_wheel_heated",
    type: "number",
  },
  "Multifunctional steering wheel (Yes/No)": {
    key: "multifunctional_steering_wheel",
    type: "number",
  },
  "Steering whel material": {
    key: "steering_whel_material",
    type: "number",
  },
  "Climate control (single-zone, dual-zone, tri-zone, four-zone)": {
    key: "climate_control",
    type: "number",
  },
  "Air purification system (Yes/No)": {
    key: "air_purification_system",
    type: "number",
  },
  "Standard Sound system brand": {
    key: "standard_sound_system_brand",
    type: "number",
  },
  "Standard Sound system number of speakers": {
    key: "standard_sound_system_number_of_speakers",
    type: "number",
  },
  "Optional Sound system (Yes/No)": {
    key: "optional_sound_system",
    type: "number",
  },
  "Optional Sound system brand": {
    key: "optional_sound_system_brand",
    type: "number",
  },
  "Optional Sound system number of speakers": {
    key: "optional_sound_system_number_of_speakers",
    type: "number",
  },
  "Subwoofer (Yes/No)": {
    key: "subwoofer",
    type: "number",
  },
  "Ambient lighting (Yes/No)": {
    key: "ambient_lighting",
    type: "number",
  },
  "Number of colors/themes": {
    key: "number_of_colors/themes",
    type: "number",
  },
  "customizable lighting (Yes/No)": {
    key: "customizable_lighting",
    type: "number",
  },
};

export const GLASS_FEATURE_MAP: Record<string, FeatureMapping<Glass>> = {
  "Rear side windows tinted (Yes/No)": {
    key: "rear_side_windows_tinted",
    type: "number",
  },
  "Rear side windows privacy glass (Yes/No)": {
    key: "rear_side_windows_privacy_glass",
    type: "number",
  },
  "Rear UV protection windows (Yes/No)": {
    key: "rear_uv_protection_windows",
    type: "number",
  },
  "Rear side window sunblind manual (Yes/No)": {
    key: "rear_side_window_sunblind_manual",
    type: "number",
  },
  "Rear side window sunblind electric (Yes/No)": {
    key: "rear_side_window_sunblind_electric",
    type: "number",
  },
  "Roof type (fixed, convertable)": {
    key: "roof_type",
    type: "number",
  },
  "Roof material (glass, metal)": {
    key: "roof_material",
    type: "number",
  },
  "Roof glass tinted (Yes/No)": {
    key: "roof_glass_tinted",
    type: "number",
  },
  "Roof UV protection glass (Yes/No)": {
    key: "roof_uv_protection_glass",
    type: "number",
  },
  "Roof sunblind manual (Yes/No)": {
    key: "roof_sunblind_manual",
    type: "number",
  },
  "Roof sunblind electric (Yes/No)": {
    key: "roof_sunblind_electric",
    type: "number",
  },
  "Electrically heated windshield (wire-based) (Yes/No)": {
    key: "electrically_heated_windshield",
    type: "number",
  },
  "Electrically heated rear window (wire-based) (Yes/No)": {
    key: "electrically_heated_rear_window",
    type: "number",
  },
};

export const SAFETY_TECHNICAL_FEATURE_MAP: Record<
  string,
  FeatureMapping<SafetyTechnical>
> = {
  "Anti-theft alarm (Yes/No)": {
    key: "anti_theft_alarm",
    type: "number",
  },
  "Anti-theft immobilise (Yes/No)": {
    key: "anti_theft_immobilise",
    type: "number",
  },
  "Tire pressure monitoring system (Yes/No)": {
    key: "tire_pressure_monitoring_system",
    type: "number",
  },
  "ISOFIX (Yes/No)": {
    key: "isofix",
    type: "number",
  },
  "Stability control (ESP, TCS)": {
    key: "stability_control",
    type: "number",
  },
  "Braking system (ABS, EBD, brake assist)": {
    key: "braking_system",
    type: "number",
  },
  "Frontal airbag (Yes/No)": {
    key: "frontal_airbag",
    type: "number",
  },
  "Knee airbag (Yes/No)": {
    key: "knee_airbag",
    type: "number",
  },
  "Side head airbag (Yes/No)": {
    key: "side_head_airbag",
    type: "number",
  },
  "Side chest airbag (Yes/No)": {
    key: "side_chest_airbag",
    type: "number",
  },
  "Side pelvis airbag (Yes/No)": {
    key: "side_pelvis_airbag",
    type: "number",
  },
  "Centre airbag (Yes/No)": {
    key: "centre_airbag",
    type: "number",
  },
  "Belt pretensioner (Yes/No)": {
    key: "belt_pretensioner",
    type: "number",
  },
  "Belt loadlimiter (Yes/No)": {
    key: "belt_loadlimiter",
    type: "number",
  },
  "Rear row Side head airbag (Yes/No)": {
    key: "rear_row_side_head_airbag",
    type: "number",
  },
  "Rear Side chest airbag (Yes/No)": {
    key: "rear_side_chest_airbag",
    type: "number",
  },
  "Rear Side pelvis airbag (Yes/No)": {
    key: "rear_side_pelvis_airbag",
    type: "number",
  },
  "Rear Belt pretensioner (Yes/No)": {
    key: "rear_belt_pretensioner",
    type: "number",
  },
  "Rear Belt loadlimiter (Yes/No)": {
    key: "rear_belt_loadlimiter",
    type: "number",
  },
};

export const CONNECTIVITY_FEATURES_MAP: Record<
  string,
  FeatureMapping<ConnectivityFeature>
> = {
  "Operating System": {
    key: "operating_system",
    type: "string",
  },
  "Head-Up-Display (Yes/No)": {
    key: "head_up_display",
    type: "string",
  },
  "Central Infotainment Display (Yes/No)": {
    key: "central_infotainment_display",
    type: "string",
  },
  "Instrument Cluster(Yes/No)": {
    key: "instrument_cluster",
    type: "string",
  },
  "Passenger Screen (Yes/No)": {
    key: "passenger_screen",
    type: "string",
  },
  "Lower central screen(Yes/No)": {
    key: "lower_central_screen",
    type: "string",
  },
  "Rear seats screen (Yes/No)": {
    key: "rear_seats_screen",
    type: "string",
  },
  "Rotary Push Button (Yes/No)": {
    key: "rotary_push_button",
    type: "string",
  },
  "Voice control (Yes/No)": {
    key: "voice_control",
    type: "string",
  },
  "Gesture control (Yes/No)": {
    key: "gesture_control",
    type: "string",
  },
  "OTA Updates (Yes/No)": {
    key: "ota_updates",
    type: "string",
  },
  "Built-in (4G/5G)": {
    key: "built_in_internet",
    type: "string",
  },
  "Car Wi-Fi hotspot (Yes/No)": {
    key: "car_wifi_hotspot",
    type: "string",
  },
  "EV Route planner (Yes/No)": {
    key: "ev_route_planner",
    type: "string",
  },
  "Real-time traffic updates (Yes/No)": {
    key: "realtime_traffic_updates",
    type: "string",
  },
  "Live Map updates (Yes/No)": {
    key: "live_map_updates",
    type: "string",
  },
  "Over-the-air map updates (Yes/No)": {
    key: "ota_map_updates",
    type: "string",
  },
  "Apple CarPlay (Yes/No)": {
    key: "apple_carplay",
    type: "string",
  },
  "Android Auto (Yes/No)": {
    key: "android_auto",
    type: "string",
  },
  "Inductive charging (Yes/No)": {
    key: "inductive_charging",
    type: "string",
  },
  "Number of USB plug-ins": {
    key: "number_of_usb_plug",
    type: "string",
  },
  "Number of USB-C plug-ins": {
    key: "number_of_usbc_plug",
    type: "string",
  },
  "Remote start (Yes/No)": {
    key: "remote_start",
    type: "string",
  },
  "Remote Parking (Yes/No)": {
    key: "remote_parking",
    type: "string",
  },
  "Tire pressure monitoring (Yes/No)": {
    key: "tire_pressure_monitoring",
    type: "string",
  },
  "Fuel/Battery level monitoring (Yes/No)": {
    key: "fuel_battery_level_monitoring",
    type: "string",
  },
  "Digital Key (Yes/No)": {
    key: "digital_key",
    type: "string",
  },
  "Key sharing (Yes/No)": {
    key: "key_sharing",
    type: "string",
  },
  "Scheduled charging (Yes/No)": {
    key: "scheduled_charging",
    type: "string",
  },
  "Remote lock/unlock (Yes/No)": {
    key: "remote_lock_unlock",
    type: "string",
  },
  "Send adress to car (Yes/No)": {
    key: "send_adress_to_car",
    type: "string",
  },
  Spotify: {
    key: "spotify",
    type: "string",
  },
  "Apple Music": {
    key: "apple_music",
    type: "string",
  },
  "Amazon Music": {
    key: "amazon_music",
    type: "string",
  },
  Tidal: {
    key: "tidal",
    type: "string",
  },
  Pandora: {
    key: "pandora",
    type: "string",
  },
  SiriusXM: {
    key: "siriusxm",
    type: "string",
  },
  Tuneln: {
    key: "tuneln",
    type: "string",
  },
  "YouTube Music": {
    key: "youtube_music",
    type: "string",
  },
  Deezer: {
    key: "deezer",
    type: "string",
  },
  YouTube: {
    key: "youtube",
    type: "string",
  },
  Netflix: {
    key: "netflix",
    type: "string",
  },
  "Amazon Prime Video": {
    key: "amazon_prime_video",
    type: "string",
  },
  Hulu: {
    key: "hulu",
    type: "string",
  },
  "Disney+": {
    key: "disney+",
    type: "string",
  },
  "HBO Max": {
    key: "hbo_max",
    type: "string",
  },
  "Apple TV+": {
    key: "apple_tv+",
    type: "string",
  },
  "Google Maps": {
    key: "google_maps",
    type: "string",
  },
  Waze: {
    key: "waze",
    type: "string",
  },
  AccuWeather: {
    key: "accuweather",
    type: "string",
  },
  ChargePoint: {
    key: "chargepoint",
    type: "string",
  },
  PlugShare: {
    key: "plugshare",
    type: "string",
  },
  Twitter: {
    key: "twitter",
    type: "string",
  },
  Facebook: {
    key: "facebook",
    type: "string",
  },
  WhatsApp: {
    key: "whatsapp",
    type: "string",
  },
  Telegram: {
    key: "telegram",
    type: "string",
  },
};

export const CONNECTIVITY_PACKAGES_FEATURE_MAP: Record<
  string,
  FeatureMapping<ConnectivityPackage>
> = {
  "Price of Premium Connectivity": {
    key: "price_of_premium_connectivity",
    type: "string",
  },
  "Duration of free trial": {
    key: "duration_of_free_trial",
    type: "number",
  },
};
