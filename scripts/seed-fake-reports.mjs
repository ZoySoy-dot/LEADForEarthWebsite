// Insert (or clean up) fake #LEADforEarth reports for testing the community
// page + /reports/{id} views.
//
// All seeded reports share submitterEmail = "seed@leadforearth.test" so they
// can be listed / deleted in one shot. Reflections are deleted automatically
// via the ON DELETE CASCADE in the Prisma schema.
//
// Usage:
//   node scripts/seed-fake-reports.mjs           # wipes prior seed data, inserts fresh
//   node scripts/seed-fake-reports.mjs --clean   # deletes seed data only

import "dotenv/config";
import { randomUUID } from "node:crypto";
import pkg from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
const { PrismaClient } = pkg;

const SEED_EMAIL = "seed@leadforearth.test";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env first.");
  process.exit(1);
}

const adapter = new PrismaNeon({ connectionString: url });
const prisma = new PrismaClient({ adapter });

const cleanOnly = process.argv.includes("--clean");

// ---------------------------------------------------------------------------
// Report fixtures. Each covers a real LEAD school; roughly balanced across
// the seven sectors so the globe filter has something to show everywhere.
// ---------------------------------------------------------------------------

const REPORTS = [
  // ---- Philippines --------------------------------------------------------
  {
    school: "De La Salle University – Manila",
    projectTitle: "Green Campus Energy Audit",
    description:
      "A one-month energy audit across Henry Sy Sr. Hall focused on wasteful lighting and cooling. Students partnered with the Facilities Office to install occupancy sensors in 24 classrooms.",
    dateImplemented: "2026-04-15",
    duration: "1 month",
    targetParticipants: "Undergraduate students and Facilities Office staff",
    projectLead: "Prof. Marissa Reyes",
    initiativeTypes: ["energy", "education"],
    sdgGoals: ["sdg4", "sdg7", "sdg13"],
    counts: { students: 240, faculty: 12, staffAdmin: 8, community: 0, population: 22000 },
    impact: {
      energy: {
        baselineKwh: "12800",
        postKwh: "9450",
        kwhReduced: "3350",
        costSavings: "PHP 33,500",
        unitsParticipating: "24",
      },
      education: { sessions: "6", speakers: "4", materials: "300", attendees: "260" },
    },
    effectiveness: [
      { criteria: "Achievement of Objectives", rating: "5", remarks: "Exceeded reduction target by 8%." },
      { criteria: "Community Participation", rating: "5", remarks: "Student volunteers doubled forecast." },
      { criteria: "Sustainability", rating: "4", remarks: "Sensors installed; monitoring plan is quarterly." },
      { criteria: "Adherence to Timeline", rating: "4", remarks: "Slight delay coordinating with three departments." },
    ],
    digitalPlatforms: ["facebook", "instagram"],
    hashtagUsed: "yes",
    hashtagEffectiveness: "The hashtag helped us connect with two other Lasallian schools running similar campaigns.",
    reach: { reactions: 1240, comments: 87, shares: 45, views: 8900 },
    postLinks: "https://facebook.com/dlsu/posts/energy-audit-2026",
    documentationLinks: "https://drive.google.com/drive/folders/dlsu-energy-audit",
    reflection: {
      climateIncluded: "Yes",
      climateDescription:
        "Two workshops covered the link between campus energy use and Scope 2 emissions.",
      participantFeedback:
        "Students appreciated seeing real numbers change week-over-week. Faculty asked for the audit to become a semesterly ritual.",
      spiritOfFaith: "This work connects our care for creation to the everyday choices we make on campus.",
      zealForService: "The students volunteered without incentives; the mission itself pulled them in.",
      communionInMission:
        "We are sharing our audit methodology with USLS Bacolod and DLSU-D so they can adapt it.",
      whatWentWell:
        "Student engagement: over 240 volunteered for the audit teams, well above forecast.",
      challenges:
        "Getting real-time energy meter data required coordination with three departments.",
      recommendations:
        "Set up a shared energy dashboard visible to students in the lobby of each building.",
      districtSuggestions:
        "A district-wide energy baseline template would help schools compare progress.",
      continuing: "Yes",
      plannedActivity: "Semesterly energy audits with student-led monitoring committees.",
    },
  },
  {
    school: "University of St. La Salle (Bacolod)",
    projectTitle: "Bacolod Rainwater Harvesting Pilot",
    description:
      "USLS installed rainwater catchment tanks on three College of Engineering rooftops. Captured water is used for landscape irrigation and toilet flushing during the wet season.",
    dateImplemented: "2026-03-08",
    duration: "3 months",
    targetParticipants: "Engineering students, campus grounds team",
    projectLead: "Engr. Cristina Villaflor",
    initiativeTypes: ["water"],
    sdgGoals: ["sdg6", "sdg11", "sdg13"],
    counts: { students: 180, faculty: 8, staffAdmin: 6, community: 12, population: 9000 },
    impact: {
      water: {
        baselineWater: "6200",
        postWater: "3900",
        litersSaved: "230000",
        costSavings: "PHP 22,000",
        unitsParticipating: "3",
      },
    },
    effectiveness: [
      { criteria: "Achievement of Objectives", rating: "4", remarks: "Saved 37% of baseline water use during the pilot." },
      { criteria: "Community Participation", rating: "4", remarks: "Local barangay volunteers joined installation." },
      { criteria: "Sustainability", rating: "5", remarks: "Infrastructure will keep running with routine maintenance." },
    ],
    digitalPlatforms: ["facebook"],
    hashtagUsed: "yes",
    hashtagEffectiveness: "Modest reach but drew inquiries from three neighboring schools.",
    reach: { reactions: 420, comments: 34, shares: 22, views: 3100 },
    postLinks: "https://facebook.com/usls/posts/rain-harvest",
    documentationLinks: "https://drive.google.com/drive/folders/usls-water",
    reflection: null,
  },
  {
    school: "La Salle Green Hills (Mandaluyong)",
    projectTitle: "LSGH Native Tree Adoption Program",
    description:
      "Grade 10 students adopted and planted 320 native saplings (narra, molave, kamagong) across the school's back lot and along partner parishes. Each sapling has a QR-coded plaque tracking growth over the year.",
    dateImplemented: "2026-06-05",
    duration: "1 day launch, 12-month care cycle",
    targetParticipants: "Grade 10 students and homeroom advisers",
    projectLead: "Mr. Randolph Cinco",
    initiativeTypes: ["biodiversity", "education"],
    sdgGoals: ["sdg13", "sdg15"],
    counts: { students: 420, faculty: 22, staffAdmin: 5, community: 40, population: 5100 },
    impact: {
      biodiversity: {
        types: { greening: true, species: true },
        speciesPlanted: "320",
        areaRehabilitated: "1.2 hectares",
        awarenessActivities: "4",
        partnerOrgs: "Barangay Wack-Wack, Haribon Foundation",
        unitsParticipating: "12",
      },
    },
    effectiveness: [
      { criteria: "Achievement of Objectives", rating: "5", remarks: "All 320 saplings planted with named adopters." },
      { criteria: "Community Participation", rating: "5", remarks: "Whole Grade 10 batch joined; parents attended launch." },
      { criteria: "Sustainability", rating: "4", remarks: "QR tracker aims to keep engagement past the launch week." },
    ],
    digitalPlatforms: ["facebook", "instagram", "tiktok"],
    hashtagUsed: "yes",
    hashtagEffectiveness: "TikTok reels of the planting hit 45k views. Highest for a Green Hills initiative this year.",
    reach: { reactions: 3100, comments: 210, shares: 180, views: 45200 },
    postLinks: "https://facebook.com/lsgh/posts/tree-adoption",
    documentationLinks: "https://drive.google.com/drive/folders/lsgh-tree-adoption",
    reflection: {
      climateIncluded: "Yes",
      climateDescription: "Homeroom sessions covered urban heat islands and native species importance.",
      participantFeedback: "Students loved the personal ownership of a specific tree.",
      spiritOfFaith: "Care for creation as an act of gratitude, not obligation.",
      zealForService: "Students who normally opt out signed up because it felt personal.",
      communionInMission: "Partner parishes now request the same program.",
      whatWentWell: "Personal adoption model kept engagement past launch day.",
      challenges: "Coordinating with barangay permits took two weeks longer than planned.",
      recommendations: "Start permits process a month earlier next cycle.",
      districtSuggestions: "Share adoption tracker template across the district.",
      continuing: "Yes",
      plannedActivity: "Grade 9 batch will adopt saplings in October 2026.",
    },
  },
  {
    school: "De La Salle University-Dasmariñas (Cavite)",
    projectTitle: "Manila Bay Coastal Clean-Up",
    description:
      "DLSU-D student council mobilized 180 volunteers for a Manila Bay coastal cleanup near the Kawit shoreline, coordinated with the DENR and a local barangay.",
    dateImplemented: "2026-05-22",
    duration: "1 day",
    targetParticipants: "College students, alumni, faculty",
    projectLead: "Ms. Mikaela Ordoñez",
    initiativeTypes: ["cleanup"],
    sdgGoals: ["sdg14", "sdg11"],
    counts: { students: 130, faculty: 12, staffAdmin: 6, community: 32, population: 13500 },
    impact: {
      cleanup: {
        areas: { coastal: true },
        wasteCollected: "1240",
        areaCleaned: "2.3 hectares",
        bagsFilled: "215",
        partnerOrgs: "DENR-CALABARZON, Barangay Binakayan",
        volunteers: "180",
      },
    },
    effectiveness: [
      { criteria: "Achievement of Objectives", rating: "5", remarks: "Exceeded waste-collection forecast." },
      { criteria: "Community Participation", rating: "5", remarks: "Alumni turnout doubled from last year." },
      { criteria: "Sustainability", rating: "3", remarks: "Follow-up cleanup planned but not funded yet." },
    ],
    digitalPlatforms: ["facebook", "instagram"],
    hashtagUsed: "yes",
    hashtagEffectiveness: "Reached other Cavite schools; two committed to join the next drive.",
    reach: { reactions: 890, comments: 60, shares: 55, views: 6400 },
    postLinks: "https://facebook.com/dlsud/posts/manila-bay-cleanup",
    documentationLinks: null,
    reflection: null,
  },
  {
    school: "De La Salle-College of Saint Benilde (Manila)",
    projectTitle: "Zero-Waste Cafeteria Transition",
    description:
      "Benilde piloted a zero-waste initiative at the Angelo King Building cafeteria. Reusable containers replaced disposables for a semester; food scraps went to a partner composter.",
    dateImplemented: "2026-01-20",
    duration: "1 semester",
    targetParticipants: "Cafeteria patrons and vendors",
    projectLead: "Ms. Carmela dela Fuente",
    initiativeTypes: ["waste", "education"],
    sdgGoals: ["sdg12", "sdg13"],
    counts: { students: 620, faculty: 35, staffAdmin: 24, community: 0, population: 12000 },
    impact: {
      waste: {
        baselineKg: "980",
        postKg: "310",
        totalCollected: "1420",
        recycledDiverted: "1180",
        reductionPct: "68",
        unitsParticipating: "1",
      },
      education: { sessions: "4", speakers: "3", materials: "500", attendees: "700" },
    },
    effectiveness: [
      { criteria: "Achievement of Objectives", rating: "5", remarks: "68% waste reduction, beat target of 50%." },
      { criteria: "Community Participation", rating: "4", remarks: "Vendor buy-in took two weeks of onboarding." },
      { criteria: "Sustainability", rating: "5", remarks: "Now the default policy, not a pilot." },
    ],
    digitalPlatforms: ["instagram", "tiktok"],
    hashtagUsed: "yes",
    hashtagEffectiveness: "Design-forward posts got shared by other Benilde departments.",
    reach: { reactions: 2100, comments: 145, shares: 98, views: 22400 },
    postLinks: "https://instagram.com/csbmanila/p/zero-waste",
    documentationLinks: "https://drive.google.com/drive/folders/csb-zero-waste",
    reflection: {
      climateIncluded: "Yes",
      climateDescription: "Sessions covered the emissions footprint of single-use plastic vs. reusables.",
      participantFeedback: "Vendors initially resistant, then became strongest advocates once sales held steady.",
      spiritOfFaith: "Stewardship as a daily practice, not a slogan.",
      zealForService: "Student volunteers ran the return-station sanitation shifts.",
      communionInMission: "Sharing playbook with DLSU-Manila cafeterias for FY2027.",
      whatWentWell: "Vendor buy-in once sales data was visible.",
      challenges: "Container loss rate hit 12% in the first month.",
      recommendations: "Deposit-based system next cycle to reduce loss.",
      districtSuggestions: "Central sourcing for containers could lower per-unit cost.",
      continuing: "Yes",
      plannedActivity: "Expanding to the Taft Campus cafeteria in AY 2026-27.",
    },
  },
  {
    school: "De La Salle Araneta University (Malabon)",
    projectTitle: "Compost from Cafeteria Scraps",
    description:
      "DLSAU's Agriculture program set up a vermicomposting station using cafeteria scraps. Compost is used in the campus community garden that feeds the food-security program.",
    dateImplemented: "2026-02-14",
    duration: "3 months",
    targetParticipants: "Agriculture students and cafeteria staff",
    projectLead: "Dr. Hector Tuazon",
    initiativeTypes: ["waste", "circular"],
    sdgGoals: ["sdg2", "sdg12"],
    counts: { students: 90, faculty: 6, staffAdmin: 4, community: 0, population: 4200 },
    impact: {
      waste: {
        baselineKg: "220",
        postKg: "40",
        totalCollected: "660",
        recycledDiverted: "620",
        reductionPct: "82",
        unitsParticipating: "1",
      },
      circular: {
        itemsCollected: "660 kg compost feedstock",
        itemsRedistributed: "180 kg compost",
        fundsRaised: "PHP 4,500",
        beneficiaryOrgs: "Campus community garden",
        partnerOrgs: "Malabon City Ag Office",
        volunteers: "45",
      },
    },
    effectiveness: [
      { criteria: "Achievement of Objectives", rating: "4", remarks: "82% diversion, exceeded target." },
      { criteria: "Sustainability", rating: "5", remarks: "Self-sustaining once vermibeds matured." },
    ],
    digitalPlatforms: ["facebook"],
    hashtagUsed: "yes",
    hashtagEffectiveness: "Modest reach; more impact through direct partner interest.",
    reach: { reactions: 210, comments: 18, shares: 12, views: 1600 },
    postLinks: "https://facebook.com/dlsau/posts/vermicompost",
    documentationLinks: null,
    reflection: null,
  },

  // ---- Hong Kong ----------------------------------------------------------
  {
    school: "La Salle College (Kowloon)",
    projectTitle: "Kowloon Uniform & Textbook Exchange",
    description:
      "La Salle College Kowloon ran a term-end uniform and textbook swap. Alumni parents dropped off outgrown uniforms; current students collected them at cost.",
    dateImplemented: "2026-06-28",
    duration: "1 week",
    targetParticipants: "Students and parents",
    projectLead: "Mr. Nathan Chan",
    initiativeTypes: ["circular", "waste"],
    sdgGoals: ["sdg10", "sdg12"],
    counts: { students: 520, faculty: 18, staffAdmin: 6, community: 240, population: 1200 },
    impact: {
      circular: {
        itemsCollected: "1350 items",
        itemsRedistributed: "1140 items",
        fundsRaised: "HKD 32,000",
        beneficiaryOrgs: "School bursary fund, three primary schools in Sham Shui Po",
        partnerOrgs: "Old Boys' Association",
        volunteers: "62",
      },
      waste: {
        totalCollected: "480",
        recycledDiverted: "460",
        reductionPct: "96",
        unitsParticipating: "1",
      },
    },
    effectiveness: [
      { criteria: "Achievement of Objectives", rating: "5", remarks: "84% redistribution rate." },
      { criteria: "Community Participation", rating: "5", remarks: "Alumni parents kept dropping off past the deadline." },
      { criteria: "Sustainability", rating: "4", remarks: "Made a permanent term-end program." },
    ],
    digitalPlatforms: ["facebook", "instagram"],
    hashtagUsed: "yes",
    hashtagEffectiveness: "Drew inquiries from St. Joseph's College about running a joint swap.",
    reach: { reactions: 760, comments: 44, shares: 38, views: 5100 },
    postLinks: "https://facebook.com/lasallehk/posts/exchange",
    documentationLinks: "https://drive.google.com/drive/folders/lscollege-exchange",
    reflection: {
      climateIncluded: "Yes",
      climateDescription: "Assembly session on garment industry emissions and reuse.",
      participantFeedback: "Parents wanted a permanent drop-off station rather than a term-end event.",
      spiritOfFaith: "Serving those who came before us and those who come after.",
      zealForService: "Alumni giving back to current students created strong intergenerational energy.",
      communionInMission: "Planning a joint swap with St. Joseph's College Hong Kong next term.",
      whatWentWell: "Alumni participation exceeded forecast.",
      challenges: "Sorting workflow at drop-off needed more volunteers than planned.",
      recommendations: "Permanent drop-off point; batch sorting weekly.",
      districtSuggestions: "Central uniform-standards guide could enable inter-school swaps.",
      continuing: "Yes",
      plannedActivity: "Permanent swap corner opens August 2026.",
    },
  },
  {
    school: "St. Joseph's College (Hong Kong Island)",
    projectTitle: "Solar-Powered Classroom Sensor Network",
    description:
      "STEM electives at St. Joseph's built and deployed 40 solar-powered temperature/CO₂ sensors across classrooms. Data lives on a public dashboard the campus uses to open windows before AC kicks in.",
    dateImplemented: "2026-05-05",
    duration: "2 months",
    targetParticipants: "STEM elective students, Facilities team",
    projectLead: "Mr. Kevin Lai",
    initiativeTypes: ["energy", "education"],
    sdgGoals: ["sdg4", "sdg7", "sdg9"],
    counts: { students: 88, faculty: 7, staffAdmin: 5, community: 0, population: 900 },
    impact: {
      energy: {
        baselineKwh: "4200",
        postKwh: "3480",
        kwhReduced: "720",
        costSavings: "HKD 1,850",
        unitsParticipating: "40",
      },
      education: { sessions: "3", speakers: "2", materials: "80", attendees: "88" },
    },
    effectiveness: [
      { criteria: "Achievement of Objectives", rating: "4", remarks: "17% energy reduction in target classrooms." },
      { criteria: "Sustainability", rating: "5", remarks: "Sensors are self-powered; data collection is automatic." },
    ],
    digitalPlatforms: ["instagram"],
    hashtagUsed: "yes",
    hashtagEffectiveness: "Reached other HKI schools; two requested tours.",
    reach: { reactions: 320, comments: 24, shares: 15, views: 2200 },
    postLinks: null,
    documentationLinks: "https://sensors.stjosephs.hk/dashboard",
    reflection: null,
  },
  {
    school: "Chan Sui Ki (La Salle) College (Kowloon)",
    projectTitle: "Kowloon City Biodiversity Walk",
    description:
      "Biology classes led public biodiversity walks around Kowloon City park, identifying and cataloging bird species with visiting elementary students.",
    dateImplemented: "2026-04-27",
    duration: "3 weekends",
    targetParticipants: "Secondary biology students, elementary partners",
    projectLead: "Ms. Priscilla Wong",
    initiativeTypes: ["biodiversity", "education"],
    sdgGoals: ["sdg4", "sdg15"],
    counts: { students: 120, faculty: 5, staffAdmin: 2, community: 140, population: 1100 },
    impact: {
      biodiversity: {
        types: { awareness: true, species: true },
        speciesPlanted: "0 (bird count survey: 37 species)",
        areaRehabilitated: "0",
        awarenessActivities: "3",
        partnerOrgs: "HK Bird Watching Society",
        unitsParticipating: "4",
      },
      education: { sessions: "3", speakers: "5", materials: "260", attendees: "260" },
    },
    effectiveness: [
      { criteria: "Achievement of Objectives", rating: "5", remarks: "37 bird species catalogued vs 25 target." },
      { criteria: "Community Participation", rating: "5", remarks: "Elementary students made up half the crowd." },
    ],
    digitalPlatforms: ["facebook", "instagram"],
    hashtagUsed: "yes",
    hashtagEffectiveness: "Positive; drew families who normally don't attend school events.",
    reach: { reactions: 540, comments: 51, shares: 30, views: 3700 },
    postLinks: "https://instagram.com/csklasalle/p/biodiversity-walk",
    documentationLinks: null,
    reflection: null,
  },

  // ---- Malaysia -----------------------------------------------------------
  {
    school: "St. John's Institution (Kuala Lumpur)",
    projectTitle: "Klang River Community Clean-Up",
    description:
      "SJI students, alumni, and neighboring communities cleaned a 1.5 km stretch of the Klang River in partnership with the DBKL and River of Life project.",
    dateImplemented: "2026-05-11",
    duration: "1 day",
    targetParticipants: "Students, alumni, community volunteers",
    projectLead: "En. Ahmad Iskandar",
    initiativeTypes: ["cleanup"],
    sdgGoals: ["sdg6", "sdg11", "sdg14"],
    counts: { students: 140, faculty: 15, staffAdmin: 4, community: 82, population: 1800 },
    impact: {
      cleanup: {
        areas: { river: true },
        wasteCollected: "980",
        areaCleaned: "1.5 km stretch",
        bagsFilled: "168",
        partnerOrgs: "DBKL, River of Life KL",
        volunteers: "241",
      },
    },
    effectiveness: [
      { criteria: "Achievement of Objectives", rating: "4", remarks: "Target 1 km stretch, exceeded to 1.5 km." },
      { criteria: "Community Participation", rating: "5", remarks: "Neighboring residents joined in force." },
      { criteria: "Sustainability", rating: "3", remarks: "Quarterly follow-up committed by DBKL." },
    ],
    digitalPlatforms: ["facebook", "instagram"],
    hashtagUsed: "yes",
    hashtagEffectiveness: "Local news picked it up; DBKL retweeted.",
    reach: { reactions: 1500, comments: 92, shares: 78, views: 11200 },
    postLinks: "https://facebook.com/sjiKL/posts/klang-cleanup",
    documentationLinks: null,
    reflection: null,
  },
  {
    school: "St. Xavier's Institution (Penang)",
    projectTitle: "Georgetown Water Conservation Week",
    description:
      "SXI's environmental club ran a week-long water conservation campaign: bathroom faucet audits, greywater signage in labs, and a Georgetown-heritage water history photo exhibit.",
    dateImplemented: "2026-03-17",
    duration: "1 week",
    targetParticipants: "Whole school and visiting Georgetown residents",
    projectLead: "Mr. Vincent Tan",
    initiativeTypes: ["water", "education"],
    sdgGoals: ["sdg6", "sdg11"],
    counts: { students: 480, faculty: 22, staffAdmin: 8, community: 60, population: 1600 },
    impact: {
      water: {
        baselineWater: "1800",
        postWater: "1420",
        litersSaved: "38000",
        costSavings: "MYR 320",
        unitsParticipating: "18",
      },
      education: { sessions: "5", speakers: "3", materials: "400", attendees: "540" },
    },
    effectiveness: [
      { criteria: "Achievement of Objectives", rating: "4", remarks: "21% reduction in monitored zones." },
      { criteria: "Community Participation", rating: "4", remarks: "Weekend exhibit drew 200 non-student visitors." },
    ],
    digitalPlatforms: ["facebook", "instagram"],
    hashtagUsed: "yes",
    hashtagEffectiveness: "Heritage angle drew local media coverage.",
    reach: { reactions: 680, comments: 42, shares: 26, views: 4400 },
    postLinks: "https://facebook.com/sxi/posts/water-week",
    documentationLinks: null,
    reflection: {
      climateIncluded: "Yes",
      climateDescription: "Sessions covered Penang water stress and climate projections.",
      participantFeedback: "Community residents asked for a monthly heritage water tour.",
      spiritOfFaith: "Water as a shared gift, worth safeguarding together.",
      zealForService: "Environmental club led without prodding from teachers.",
      communionInMission: "Sister school in Ipoh (St. Michael's) will replicate the audit next term.",
      whatWentWell: "Cross-generational participation.",
      challenges: "Weather disrupted the outdoor exhibit twice.",
      recommendations: "Indoor backup venue booked for next iteration.",
      districtSuggestions: "Water baseline template with unit-conversion built in.",
      continuing: "Yes",
      plannedActivity: "Georgetown Water Trail with heritage guides, Oct 2026.",
    },
  },
  {
    school: "St. Michael's Institution (Ipoh, Perak)",
    projectTitle: "Perak Native Tree Sanctuary",
    description:
      "SMI dedicated a section of the school grounds as a Perak native species sanctuary, planting 90 endangered lowland dipterocarp saplings with the Malaysian Nature Society.",
    dateImplemented: "2026-06-01",
    duration: "1 month",
    targetParticipants: "Secondary students",
    projectLead: "Ms. Vanessa Lim",
    initiativeTypes: ["biodiversity"],
    sdgGoals: ["sdg13", "sdg15"],
    counts: { students: 210, faculty: 9, staffAdmin: 3, community: 18, population: 1200 },
    impact: {
      biodiversity: {
        types: { habitat: true, species: true, greening: true },
        speciesPlanted: "90",
        areaRehabilitated: "0.35 hectares",
        awarenessActivities: "2",
        partnerOrgs: "Malaysian Nature Society (Perak)",
        unitsParticipating: "6",
      },
    },
    effectiveness: [
      { criteria: "Achievement of Objectives", rating: "5", remarks: "All 90 saplings planted; survival check in month 3." },
      { criteria: "Sustainability", rating: "4", remarks: "Volunteer watering rota through the dry season." },
    ],
    digitalPlatforms: ["facebook"],
    hashtagUsed: "yes",
    hashtagEffectiveness: "Modest reach; partnership was the bigger outcome.",
    reach: { reactions: 380, comments: 22, shares: 14, views: 2900 },
    postLinks: null,
    documentationLinks: null,
    reflection: null,
  },

  // ---- Singapore ----------------------------------------------------------
  {
    school: "Saint Joseph's Institution",
    projectTitle: "SJI Uniform Circularity Drive",
    description:
      "SJI's environmental council collected 620 outgrown uniforms and repurposed 480 for the incoming cohort. Remaining 140 went to a partner secondary school.",
    dateImplemented: "2026-01-30",
    duration: "3 weeks",
    targetParticipants: "Whole school community",
    projectLead: "Mr. Daryl Ang",
    initiativeTypes: ["circular"],
    sdgGoals: ["sdg10", "sdg12"],
    counts: { students: 380, faculty: 20, staffAdmin: 6, community: 90, population: 1800 },
    impact: {
      circular: {
        itemsCollected: "620",
        itemsRedistributed: "620",
        fundsRaised: "SGD 4,200",
        beneficiaryOrgs: "Incoming SJI cohort, partner secondary school",
        partnerOrgs: "Old Josephians' Association",
        volunteers: "48",
      },
    },
    effectiveness: [
      { criteria: "Achievement of Objectives", rating: "5", remarks: "100% redistribution." },
      { criteria: "Community Participation", rating: "4", remarks: "Alumni parents drove donation pipeline." },
      { criteria: "Sustainability", rating: "5", remarks: "Baked into annual induction now." },
    ],
    digitalPlatforms: ["instagram"],
    hashtagUsed: "yes",
    hashtagEffectiveness: "Good; SJI International International expressed interest in joining next year.",
    reach: { reactions: 540, comments: 35, shares: 22, views: 4100 },
    postLinks: null,
    documentationLinks: null,
    reflection: {
      climateIncluded: "No",
      climateDescription: null,
      participantFeedback: "Incoming cohort appreciated the cost saving; parents appreciated the sustainability angle.",
      spiritOfFaith: "Simple stewardship: care for what we already have.",
      zealForService: "Alumni parents making time to sort and label.",
      communionInMission: "Cross-school partnership taking shape for FY27.",
      whatWentWell: "Redistribution rate: no waste at all.",
      challenges: "Storage space during the collection window.",
      recommendations: "Pop-up storage donations from a partner logistics firm.",
      districtSuggestions: "Uniform-swap toolkit at district level.",
      continuing: "Yes",
      plannedActivity: "January 2027 drive, expanded to partner school.",
    },
  },
  {
    school: "LASALLE College of the Arts",
    projectTitle: "Design for a Zero-Waste Campus (Advocacy Exhibit)",
    description:
      "LASALLE's Design Communication students mounted a public exhibit visualizing the carbon and waste footprint of a typical arts studio, with actionable swaps.",
    dateImplemented: "2026-02-20",
    duration: "10 days",
    targetParticipants: "Students, staff, public",
    projectLead: "Ms. Amanda Choo",
    initiativeTypes: ["education"],
    sdgGoals: ["sdg12", "sdg13"],
    counts: { students: 260, faculty: 22, staffAdmin: 10, community: 340, population: 2900 },
    impact: {
      education: { sessions: "6", speakers: "8", materials: "600", attendees: "830" },
    },
    effectiveness: [
      { criteria: "Achievement of Objectives", rating: "5", remarks: "Foot traffic doubled from prior year." },
      { criteria: "Community Participation", rating: "5", remarks: "Members of the public visited on weekends." },
    ],
    digitalPlatforms: ["instagram", "tiktok"],
    hashtagUsed: "yes",
    hashtagEffectiveness: "Design-forward exhibit got shared widely on TikTok.",
    reach: { reactions: 4200, comments: 310, shares: 250, views: 62000 },
    postLinks: "https://instagram.com/lasallesg/p/zero-waste",
    documentationLinks: "https://drive.google.com/drive/folders/lasalle-arts-exhibit",
    reflection: null,
  },

  // ---- Thailand -----------------------------------------------------------
  {
    school: "La Salle College (Bangkok)",
    projectTitle: "Bangkok Urban Canopy Project",
    description:
      "La Salle Bangkok planted 220 saplings along a 400m school-adjacent canal, aiming to lower ambient temperature and manage stormwater runoff.",
    dateImplemented: "2026-06-14",
    duration: "2 months",
    targetParticipants: "Secondary students, parent volunteers",
    projectLead: "Khun Anucha Preechayudh",
    initiativeTypes: ["biodiversity"],
    sdgGoals: ["sdg11", "sdg13", "sdg15"],
    counts: { students: 260, faculty: 12, staffAdmin: 4, community: 50, population: 1500 },
    impact: {
      biodiversity: {
        types: { greening: true, habitat: true },
        speciesPlanted: "220",
        areaRehabilitated: "0.6 hectares",
        awarenessActivities: "2",
        partnerOrgs: "Bangkok Metropolitan Administration",
        unitsParticipating: "8",
      },
    },
    effectiveness: [
      { criteria: "Achievement of Objectives", rating: "4", remarks: "All saplings planted; survival TBD." },
      { criteria: "Community Participation", rating: "4", remarks: "Parents joined for weekend planting shifts." },
    ],
    digitalPlatforms: ["facebook"],
    hashtagUsed: "yes",
    hashtagEffectiveness: "BMA reposted; opened door to further projects.",
    reach: { reactions: 490, comments: 38, shares: 20, views: 3200 },
    postLinks: null,
    documentationLinks: null,
    reflection: null,
  },
  {
    school: "La Salle Chanthaburi (Mandapitak) School (Chanthaburi)",
    projectTitle: "Chanthaburi School Compost Cooperative",
    description:
      "The school teamed up with three neighboring schools to run a shared compost program, converting cafeteria and agricultural waste into fertilizer for community gardens.",
    dateImplemented: "2026-04-02",
    duration: "3 months",
    targetParticipants: "Middle and high school students",
    projectLead: "Khun Wichitra Chansri",
    initiativeTypes: ["waste", "circular"],
    sdgGoals: ["sdg2", "sdg12", "sdg17"],
    counts: { students: 150, faculty: 8, staffAdmin: 3, community: 60, population: 900 },
    impact: {
      waste: {
        baselineKg: "310",
        postKg: "55",
        totalCollected: "820",
        recycledDiverted: "780",
        reductionPct: "82",
        unitsParticipating: "4",
      },
      circular: {
        itemsCollected: "820 kg feedstock",
        itemsRedistributed: "240 kg compost",
        fundsRaised: "THB 3,500",
        beneficiaryOrgs: "Three neighboring schools, community garden",
        partnerOrgs: "Chanthaburi Community Ag Office",
        volunteers: "60",
      },
    },
    effectiveness: [
      { criteria: "Achievement of Objectives", rating: "5", remarks: "82% diversion." },
      { criteria: "Community Participation", rating: "5", remarks: "Model spread to two more schools." },
    ],
    digitalPlatforms: ["facebook"],
    hashtagUsed: "yes",
    hashtagEffectiveness: "Small circle but strong within it.",
    reach: { reactions: 220, comments: 15, shares: 10, views: 1400 },
    postLinks: null,
    documentationLinks: null,
    reflection: {
      climateIncluded: "Yes",
      climateDescription: "Sessions on the emissions cost of food waste in landfills.",
      participantFeedback: "Community gardeners said the compost quality was better than commercial.",
      spiritOfFaith: "Turning what we discard into what feeds our neighbours.",
      zealForService: "Cross-school partnership required real effort; students led the coordination.",
      communionInMission: "Inspired sister-school cooperation across four campuses.",
      whatWentWell: "The multi-school partnership model.",
      challenges: "Transport logistics between schools.",
      recommendations: "Rotating pickup schedule with parent volunteers.",
      districtSuggestions: "Grants for inter-school partnerships to cover logistics.",
      continuing: "Yes",
      plannedActivity: "Expand to two more schools in Q4 2026.",
    },
  },

  // ---- Japan --------------------------------------------------------------
  {
    school: "Hakodate La Salle High School (Hakodate)",
    projectTitle: "Hakodate Climate Literacy Forum",
    description:
      "Hakodate La Salle hosted an inter-school climate literacy forum with three neighboring schools and a Hokkaido University researcher. Focus was regional impacts on Hokkaido fisheries.",
    dateImplemented: "2026-05-18",
    duration: "1 day",
    targetParticipants: "High school students, invited guests",
    projectLead: "Mr. Kenji Yamamoto",
    initiativeTypes: ["education"],
    sdgGoals: ["sdg4", "sdg13", "sdg14"],
    counts: { students: 220, faculty: 14, staffAdmin: 4, community: 40, population: 480 },
    impact: {
      education: {
        types: { forum: true, seminar: true },
        sessions: "4",
        speakers: "5",
        materials: "300",
        attendees: "278",
      },
    },
    effectiveness: [
      { criteria: "Achievement of Objectives", rating: "5", remarks: "Cross-school attendance exceeded target." },
      { criteria: "Community Participation", rating: "4", remarks: "Local fisheries co-op sent representatives." },
    ],
    digitalPlatforms: ["twitter", "facebook"],
    hashtagUsed: "yes",
    hashtagEffectiveness: "Modest reach but drew researcher engagement.",
    reach: { reactions: 340, comments: 28, shares: 20, views: 2600 },
    postLinks: null,
    documentationLinks: null,
    reflection: null,
  },
  {
    school: "La Salle High School (Kagoshima)",
    projectTitle: "Kagoshima Solar-Roof Pilot",
    description:
      "Kagoshima La Salle installed a 20 kW solar array on the gymnasium roof, offsetting daytime lighting and ventilation load. Data feeds a public dashboard for student projects.",
    dateImplemented: "2026-03-01",
    duration: "3 months",
    targetParticipants: "STEM students, Facilities team",
    projectLead: "Mr. Hiroshi Sato",
    initiativeTypes: ["energy"],
    sdgGoals: ["sdg7", "sdg13"],
    counts: { students: 90, faculty: 6, staffAdmin: 4, community: 0, population: 620 },
    impact: {
      energy: {
        baselineKwh: "8400",
        postKwh: "5600",
        kwhReduced: "2800",
        costSavings: "JPY 62,000",
        unitsParticipating: "1",
      },
    },
    effectiveness: [
      { criteria: "Achievement of Objectives", rating: "4", remarks: "33% offset; year 1 will refine estimate." },
      { criteria: "Sustainability", rating: "5", remarks: "Infrastructure has 25-year lifespan." },
    ],
    digitalPlatforms: ["twitter"],
    hashtagUsed: "no",
    hashtagEffectiveness: null,
    reach: { reactions: 120, comments: 8, shares: 4, views: 900 },
    postLinks: null,
    documentationLinks: "https://solar.kagoshima-lasalle.jp",
    reflection: null,
  },

  // ---- Myanmar ------------------------------------------------------------
  {
    school: "De La Salle Academy (Yangon)",
    projectTitle: "Yangon Schoolyard Reforestation",
    description:
      "Students planted 60 native saplings on and near the school compound, and ran an outdoor classroom session on the ecological importance of local biodiversity.",
    dateImplemented: "2026-05-30",
    duration: "2 weeks",
    targetParticipants: "Middle school students",
    projectLead: "Ms. Nilar Aung",
    initiativeTypes: ["biodiversity", "education"],
    sdgGoals: ["sdg13", "sdg15"],
    counts: { students: 110, faculty: 6, staffAdmin: 2, community: 20, population: 380 },
    impact: {
      biodiversity: {
        types: { greening: true, awareness: true },
        speciesPlanted: "60",
        areaRehabilitated: "0.2 hectares",
        awarenessActivities: "2",
        partnerOrgs: "Local monastery reforestation program",
        unitsParticipating: "3",
      },
      education: { sessions: "2", speakers: "2", materials: "80", attendees: "130" },
    },
    effectiveness: [
      { criteria: "Achievement of Objectives", rating: "5", remarks: "All 60 saplings planted; monastery partnership secured." },
      { criteria: "Community Participation", rating: "4", remarks: "Monks joined the outdoor session." },
    ],
    digitalPlatforms: ["facebook"],
    hashtagUsed: "yes",
    hashtagEffectiveness: "Small reach but meaningful within Yangon Lasallian community.",
    reach: { reactions: 180, comments: 14, shares: 8, views: 1100 },
    postLinks: null,
    documentationLinks: null,
    reflection: {
      climateIncluded: "Yes",
      climateDescription: "Outdoor classroom session covered local climate impacts on farming.",
      participantFeedback: "Students proud of the visible impact; planted trees they'll see grow.",
      spiritOfFaith: "Rooted care: planting for those we may never meet.",
      zealForService: "Cross-community partnership with the monastery was student-initiated.",
      communionInMission: "Sharing the outdoor classroom template with sister Lasallian schools.",
      whatWentWell: "Cross-community turnout.",
      challenges: "Watering rotation during dry weeks.",
      recommendations: "Formal watering rota tied to specific classrooms.",
      districtSuggestions: "Small-school grants for native sapling procurement.",
      continuing: "Yes",
      plannedActivity: "Second planting session in October 2026.",
    },
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function computeRate(counts) {
  const total = counts.students + counts.faculty + counts.staffAdmin + counts.community;
  if (!counts.population) return { total, rate: null };
  return { total, rate: Number(((total / counts.population) * 100).toFixed(2)) };
}

function toReportRow(r) {
  const { total, rate } = computeRate(r.counts);
  return {
    editToken: randomUUID(),
    submitterName: "Seed Submitter",
    submitterRole: "Task Force Lead",
    submitterEmail: SEED_EMAIL,
    submitterPhone: null,
    schoolName: r.school,
    projectTitle: r.projectTitle,
    description: r.description,
    dateImplemented: new Date(r.dateImplemented),
    projectDuration: r.duration,
    targetParticipants: r.targetParticipants,
    projectLead: r.projectLead,
    initiativeTypes: r.initiativeTypes,
    initiativeOther: null,
    sdgGoals: r.sdgGoals,
    students: r.counts.students,
    faculty: r.counts.faculty,
    staffAdmin: r.counts.staffAdmin,
    community: r.counts.community,
    totalParticipants: total,
    schoolPopulation: r.counts.population,
    participationRate: rate,
    impact: r.impact,
    effectiveness: r.effectiveness,
    digitalPlatforms: r.digitalPlatforms,
    digitalPlatformOther: null,
    hashtagUsed: r.hashtagUsed,
    hashtagEffectiveness: r.hashtagEffectiveness,
    reachReactions: r.reach.reactions,
    reachComments: r.reach.comments,
    reachShares: r.reach.shares,
    reachViews: r.reach.views,
    postLinks: r.postLinks,
    documentationLinks: r.documentationLinks,
    hasReflections: !!r.reflection,
    status: "approved",
  };
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

const existing = await prisma.report.findMany({
  where: { submitterEmail: SEED_EMAIL },
  select: { id: true },
});

if (existing.length > 0) {
  console.log(`Removing ${existing.length} prior seed report(s)…`);
  await prisma.report.deleteMany({ where: { submitterEmail: SEED_EMAIL } });
}

if (cleanOnly) {
  console.log("Cleanup done. Skipping insert (--clean flag).");
  await prisma.$disconnect();
  process.exit(0);
}

console.log(`Inserting ${REPORTS.length} fake report(s)…`);
for (const r of REPORTS) {
  const row = toReportRow(r);
  const created = await prisma.report.create({ data: row });
  if (r.reflection) {
    await prisma.reflection.create({
      data: { reportId: created.id, ...r.reflection },
    });
  }
  console.log(`  ${created.id.slice(0, 8)}…  ${r.school}  ·  ${r.projectTitle}`);
}

console.log(`\nDone. ${REPORTS.length} reports inserted, all approved.`);
console.log(`Marker: submitterEmail = "${SEED_EMAIL}"`);
console.log(`To remove them later:  node scripts/seed-fake-reports.mjs --clean`);

await prisma.$disconnect();
