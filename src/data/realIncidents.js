export const stateRiskData = [
  { id: "MH", state: "Maharashtra", incidents: 1450, riskScore: 92, rank: 1, level: "High Risk", highlight: "NH-44 through Pench" },
  { id: "KA", state: "Karnataka", incidents: 1280, riskScore: 88, rank: 2, level: "High Risk", highlight: "Bandipur NH-766" },
  { id: "AS", state: "Assam", incidents: 950, riskScore: 85, rank: 3, level: "High Risk", highlight: "Kaziranga NH-37 floods" },
  { id: "TN", state: "Tamil Nadu", incidents: 820, riskScore: 78, rank: 4, level: "Medium Risk", highlight: "Valparai macaques" },
  { id: "MP", state: "Madhya Pradesh", incidents: 790, riskScore: 75, rank: 5, level: "Medium Risk", highlight: "Kanha-Pench Corridor" },
  { id: "UK", state: "Uttarakhand", incidents: 610, riskScore: 65, rank: 6, level: "Medium Risk", highlight: "Rajaji NP highways" },
  { id: "RJ", state: "Rajasthan", incidents: 420, riskScore: 45, rank: 7, level: "Low Risk", highlight: "Ranthambore periphery" },
  { id: "KL", state: "Kerala", incidents: 380, riskScore: 40, rank: 8, level: "Low Risk", highlight: "Wayanad routes" },
];

export const verifiedIncidents = [
  {
    id: "IND-MH-01",
    state: "Maharashtra",
    location: "NH-44, near Pench Tiger Reserve",
    species: "Tiger & Leopard",
    severity: "Critical",
    description: "NH-44 cuts right through the crucial Kanha-Pench corridor. Despite mitigation structures like underpasses, wildlife-vehicle collisions persist at the edges of the reserve.",
    source: "Wildlife Institute of India (WII) Reports"
  },
  {
    id: "IND-AS-01",
    state: "Assam",
    location: "NH-37, Kaziranga National Park",
    species: "One-horned Rhinoceros & Hog Deer",
    severity: "Critical",
    description: "During annual Brahmaputra floods, animals migrate to higher ground in Karbi Anglong, crossing NH-37. Speeding vehicles frequently strike fleeing wildlife.",
    source: "Assam Forest Department Data"
  },
  {
    id: "IND-KA-01",
    state: "Karnataka",
    location: "NH-766, Bandipur Tiger Reserve",
    species: "Asian Elephant",
    severity: "High",
    description: "High volumes of roadkills led to a landmark night-traffic ban (9 PM to 6 AM) on this highway to protect nocturnal wildlife movement.",
    source: "High Court of Karnataka Rulings / WCS India"
  },
  {
    id: "IND-TN-01",
    state: "Tamil Nadu",
    location: "Valparai, Anamalai Tiger Reserve",
    species: "Lion-tailed Macaque",
    severity: "High",
    description: "Endangered canopy-dwelling primates are forced to cross roads due to fragmented forest canopies. Canopy bridges are being implemented to reduce mortality.",
    source: "Nature Conservation Foundation (NCF)"
  }
];
