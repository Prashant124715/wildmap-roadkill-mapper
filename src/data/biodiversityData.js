// Biodiversity Insights - Dummy Data Module
// Contains all animal observation data, ethical guidelines, and filter options

export const animalData = [
  {
    id: 'tiger',
    name: 'Bengal Tiger',
    scientificName: 'Panthera tigris tigris',
    image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&q=80',
    observationZones: ['Tadoba Andhari', 'Ranthambore', 'Bandhavgarh'],
    bestMonths: 'March – May',
    bestTime: 'Early morning / Dusk',
    frequency: 'Low',
    habitat: 'Dense forest & buffer zones',
    ethicalTip: 'Maintain extreme silence. Never instruct drivers to block the tiger’s path.',
    conservationStatus: 'Endangered',
    activityTrend: [{ month: 'Jan', activity: 65 }, { month: 'Feb', activity: 68 }, { month: 'Mar', activity: 80 }, { month: 'Apr', activity: 90 }, { month: 'May', activity: 95 }, { month: 'Jun', activity: 70 }, { month: 'Jul', activity: 20 }, { month: 'Aug', activity: 15 }, { month: 'Sep', activity: 30 }, { month: 'Oct', activity: 50 }, { month: 'Nov', activity: 60 }, { month: 'Dec', activity: 62 }]
  },
  {
    id: 'leopard',
    name: 'Leopard',
    scientificName: 'Panthera pardus',
    image: 'https://images.unsplash.com/photo-1517825738774-7de9363ef735?w=800&q=80',
    observationZones: ['Sanjay Gandhi National Park', 'Western Ghats'],
    bestMonths: 'October – February',
    bestTime: 'Night / Early morning',
    frequency: 'Medium',
    habitat: 'Dense forest & buffer zones',
    ethicalTip: 'Avoid flash photography completely; leopards are nocturnal and highly sensitive to sudden light.',
    conservationStatus: 'Vulnerable',
    activityTrend: [{ month: 'Jan', activity: 78 }, { month: 'Feb', activity: 72 }, { month: 'Mar', activity: 45 }, { month: 'Apr', activity: 30 }, { month: 'May', activity: 20 }, { month: 'Jun', activity: 18 }, { month: 'Jul', activity: 25 }, { month: 'Aug', activity: 32 }, { month: 'Sep', activity: 40 }, { month: 'Oct', activity: 65 }, { month: 'Nov', activity: 80 }, { month: 'Dec', activity: 85 }]
  },
  {
    id: 'elephant',
    name: 'Indian Elephant',
    scientificName: 'Elephas maximus indicus',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&q=80',
    observationZones: ['Wayanad', 'Nagarhole', 'Bandipur Corridor'],
    bestMonths: 'September – February',
    bestTime: 'Early morning / Dusk',
    frequency: 'Medium',
    habitat: 'Tropical moist forests & grasslands',
    ethicalTip: 'Keep at least 100m distance. Never honk or rev engines near elephant herds.',
    conservationStatus: 'Endangered',
    activityTrend: [{ month: 'Jan', activity: 65 }, { month: 'Feb', activity: 60 }, { month: 'Mar', activity: 48 }, { month: 'Apr', activity: 38 }, { month: 'May', activity: 30 }, { month: 'Jun', activity: 35 }, { month: 'Jul', activity: 40 }, { month: 'Aug', activity: 50 }, { month: 'Sep', activity: 70 }, { month: 'Oct', activity: 78 }, { month: 'Nov', activity: 80 }, { month: 'Dec', activity: 72 }]
  },

  {
    id: 'fox',
    name: 'Red Fox',
    scientificName: 'Vulpes vulpes',
    image: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?w=800&q=80',
    observationZones: ['Nashik rural zones', 'Desert National Park'],
    bestMonths: 'November – March',
    bestTime: 'Night',
    frequency: 'Medium',
    habitat: 'Scrubland & dry grasslands',
    ethicalTip: 'Use red-filtered light at night; white light causes temporary blindness.',
    conservationStatus: 'Least Concern',
    activityTrend: [{ month: 'Jan', activity: 70 }, { month: 'Feb', activity: 62 }, { month: 'Mar', activity: 55 }, { month: 'Apr', activity: 30 }, { month: 'May', activity: 15 }, { month: 'Jun', activity: 12 }, { month: 'Jul', activity: 18 }, { month: 'Aug', activity: 22 }, { month: 'Sep', activity: 35 }, { month: 'Oct', activity: 48 }, { month: 'Nov', activity: 68 }, { month: 'Dec', activity: 75 }]
  },
  {
    id: 'wild-boar',
    name: 'Wild Boar',
    scientificName: 'Sus scrofa',
    image: 'https://images.unsplash.com/photo-1605092676920-8ac5ae40c7c8?w=800&q=80',
    observationZones: ['Agricultural boundaries', 'Forest highways'],
    bestMonths: 'July – December',
    bestTime: 'Early morning',
    frequency: 'High',
    habitat: 'Forest edges & farmland borders',
    ethicalTip: 'Never corner a wild boar. They charge aggressively when threatened.',
    conservationStatus: 'Least Concern',
    activityTrend: [{ month: 'Jan', activity: 40 }, { month: 'Feb', activity: 35 }, { month: 'Mar', activity: 28 }, { month: 'Apr', activity: 22 }, { month: 'May', activity: 30 }, { month: 'Jun', activity: 45 }, { month: 'Jul', activity: 72 }, { month: 'Aug', activity: 80 }, { month: 'Sep', activity: 85 }, { month: 'Oct', activity: 78 }, { month: 'Nov', activity: 70 }, { month: 'Dec', activity: 65 }]
  },

  {
    id: 'lion',
    name: 'Asiatic Lion',
    scientificName: 'Panthera leo persica',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80',
    observationZones: ['Gir National Park', 'Girnar Wildlife Sanctuary'],
    bestMonths: 'December – April',
    bestTime: 'Early morning / Late afternoon',
    frequency: 'Medium',
    habitat: 'Dry deciduous forest & savanna',
    ethicalTip: 'Lions are apex predators. Always stay inside your registered safari vehicle.',
    conservationStatus: 'Endangered',
    activityTrend: [{ month: 'Jan', activity: 85 }, { month: 'Feb', activity: 80 }, { month: 'Mar', activity: 75 }, { month: 'Apr', activity: 60 }, { month: 'May', activity: 40 }, { month: 'Jun', activity: 20 }, { month: 'Jul', activity: 15 }, { month: 'Aug', activity: 20 }, { month: 'Sep', activity: 35 }, { month: 'Oct', activity: 50 }, { month: 'Nov', activity: 70 }, { month: 'Dec', activity: 80 }]
  },
  {
    id: 'rhino',
    name: 'Indian Rhinoceros',
    scientificName: 'Rhinoceros unicornis',
    image: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=800&q=80',
    observationZones: ['Kaziranga National Park', 'Pobitora Wildlife Sanctuary'],
    bestMonths: 'November – April',
    bestTime: 'Early morning',
    frequency: 'Medium',
    habitat: 'Tall grasslands & marshlands',
    ethicalTip: 'Rhinos have poor vision but charge quickly. Maintain a safe distance of at least 150m.',
    conservationStatus: 'Vulnerable',
    activityTrend: [{ month: 'Jan', activity: 70 }, { month: 'Feb', activity: 75 }, { month: 'Mar', activity: 80 }, { month: 'Apr', activity: 60 }, { month: 'May', activity: 40 }, { month: 'Jun', activity: 20 }, { month: 'Jul', activity: 15 }, { month: 'Aug', activity: 10 }, { month: 'Sep', activity: 30 }, { month: 'Oct', activity: 50 }, { month: 'Nov', activity: 65 }, { month: 'Dec', activity: 75 }]
  },
  {
    id: 'zebra',
    name: 'Plains Zebra',
    scientificName: 'Equus quagga',
    image: 'https://images.unsplash.com/photo-1501705388883-4ed8a543392c?w=800&q=80',
    observationZones: ['African Savanna', 'Serengeti Migration Corridor'],
    bestMonths: 'July – October',
    bestTime: 'Morning / Afternoon',
    frequency: 'Very High',
    habitat: 'Savanna & grasslands',
    ethicalTip: 'Do not block migration paths or separate foals from the herd.',
    conservationStatus: 'Least Concern',
    activityTrend: [{ month: 'Jan', activity: 40 }, { month: 'Feb', activity: 45 }, { month: 'Mar', activity: 50 }, { month: 'Apr', activity: 55 }, { month: 'May', activity: 60 }, { month: 'Jun', activity: 70 }, { month: 'Jul', activity: 90 }, { month: 'Aug', activity: 95 }, { month: 'Sep', activity: 85 }, { month: 'Oct', activity: 75 }, { month: 'Nov', activity: 60 }, { month: 'Dec', activity: 50 }]
  },

];

export const ethicalGuidelines = [
  {
    icon: 'Eye',
    title: 'Do Not Disturb',
    description: 'Observe wildlife from a respectful distance. Never chase, corner, or startle animals for a better view or photo.',
  },
  {
    icon: 'VolumeX',
    title: 'Minimize Noise',
    description: 'Avoid loud sounds, music, and unnecessary vehicle honking in wildlife habitats. Sound pollution disrupts breeding and feeding.',
  },
  {
    icon: 'CameraOff',
    title: 'No Flash Photography',
    description: 'Flash can temporarily blind and disorient animals, especially nocturnal species. Use natural light or high-ISO settings.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Respect Regulations',
    description: 'Follow all forest department rules. Stay on designated paths and within permitted zones during allowed hours only.',
  },
  {
    icon: 'Ruler',
    title: 'Safe Distance',
    description: 'Always maintain the recommended minimum distance. Use binoculars or telephoto lenses for close observations.',
  },
  {
    icon: 'Leaf',
    title: 'Leave No Trace',
    description: 'Carry out all waste. Do not leave food, plastic, or any material behind. Preserve the ecosystem as you found it.',
  },
];

export const habitatTypes = [
  'All Habitats',
  'Dense forest & buffer zones',
  'Grasslands & forest edges',
  'Scrubland & dry grasslands',
  'Forest edges & farmland borders',
  'Open forests & farmland',
  'Tropical moist forests & grasslands',
  'Rocky outcrops & dry deciduous forests',
  'Tropical rainforests & bamboo thickets',
  'Dry deciduous forest & savanna',
  'Tall grasslands & marshlands',
  'Savanna & grasslands',
  'Open savanna & woodlands',
];

export const frequencyLevels = ['All Levels', 'Very High', 'High', 'Medium', 'Low'];

export const timeOptions = [
  'All Times',
  'Early morning',
  'Morning',
  'Sunrise / Evening',
  'Late afternoon',
  'Dusk',
  'Night',
  'Early morning / Late night',
  'Early morning / Dusk',
  'Morning / Late afternoon',
  'Morning / After rain',
  'Night / Early morning',
  'Morning / Afternoon',
  'Morning / Evening',
];
