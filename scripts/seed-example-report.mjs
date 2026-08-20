// Insert (or clean up) the single "example" #LEADforEarth report used to
// show institutions what a completed submission looks like on the site.
//
// The example is tagged with submitterEmail = "example@leadforearth.org"
// so it can be listed / deleted in one shot without touching real reports.
//
// Usage:
//   node scripts/seed-example-report.mjs           # wipes prior example, inserts fresh
//   node scripts/seed-example-report.mjs --clean   # deletes example only

import "dotenv/config";
import { randomBytes } from "node:crypto";
import pkg from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
const { PrismaClient } = pkg;

const EXAMPLE_EMAIL = "example@leadforearth.org";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env first.");
  process.exit(1);
}

const adapter = new PrismaNeon({ connectionString: url });
const prisma = new PrismaClient({ adapter });
const cleanOnly = process.argv.includes("--clean");

// ---------------------------------------------------------------------------
// Example fixture. Written to touch every section so an institution can see
// exactly what their report will look like once submitted and approved.
// ---------------------------------------------------------------------------

const EXAMPLE = {
  submitterName: "Sample Coordinator",
  submitterRole: "Sustainability Program Coordinator",
  submitterEmail: EXAMPLE_EMAIL,
  submitterPhone: "+63 917 000 0000",

  schoolName: "De La Salle University – Manila",
  projectTitle: "Example Report: Green Campus Energy Audit",
  description:
    "This is a sample submission showing what a completed #LEADforEarth report looks like. It walks through a one-month energy audit across Henry Sy Sr. Hall focused on wasteful lighting and cooling. Students partnered with the Facilities Office to install occupancy sensors in 24 classrooms and ran two workshops on Scope 2 emissions.",
  dateImplemented: new Date("2026-06-15"),
  projectDuration: "1 month",
  targetParticipants: "Undergraduate students, Facilities Office staff, invited faculty",
  projectLead: "Sustainability Office",

  initiativeTypes: ["energy", "education"],
  initiativeOther: null,
  sdgGoals: ["sdg4", "sdg7", "sdg11", "sdg12", "sdg13"],

  students: 245,
  faculty: 18,
  staffAdmin: 12,
  community: 8,
  totalParticipants: 283,
  schoolPopulation: 20500,
  participationRate: 1.38,

  impact: {
    energy: {
      baselineKwh: "12500",
      postKwh: "9800",
      kwhReduced: "2700",
      costSavings: "PHP 27,000",
      unitsParticipating: "24 classrooms",
    },
    education: {
      types: { forum: false, seminar: false, workshop: true, awareness: true },
      sessions: "4",
      speakers: "3",
      materials: "500",
      attendees: "340",
    },
    otherImpact: "",
  },

  effectiveness: [
    { criteria: "Organization and planning", rating: "5", remarks: "Strong coordination between the Sustainability Office and Facilities from week one." },
    { criteria: "Participant engagement", rating: "5", remarks: "245 students volunteered for the audit teams; well above the 150 forecast." },
    { criteria: "Achievement of intended outcomes", rating: "4", remarks: "Hit 21.6% kWh reduction; targeted 25%." },
    { criteria: "Feasibility and scalability", rating: "5", remarks: "Ready to replicate across three more halls next semester." },
    { criteria: "Overall effectiveness", rating: "5", remarks: "Real, visible savings within a month. Students asked for the audit to become a semesterly ritual." },
  ],

  digitalPlatforms: ["facebook", "instagram", "tiktok"],
  digitalPlatformOther: null,
  hashtagUsed: "Yes",
  hashtagEffectiveness:
    "Consistent use of #LEADforEarth on every post pulled traction from sister schools. Two posts crossed 10k views.",
  reachReactions: 1240,
  reachComments: 156,
  reachShares: 89,
  reachViews: 12500,
  postLinks:
    "https://facebook.com/dlsu/posts/energy-audit-example\nhttps://instagram.com/dlsu/reel/energy-audit-example",

  documentationLinks:
    "https://drive.google.com/example-report-photos\nhttps://dlsu.edu.ph/sustainability/energy-audit-2026",

  reflection: {
    climateIncluded: "Yes",
    climateDescription:
      "Two workshops covered the link between campus energy use and Scope 2 emissions, and how Metro Manila's grid mix shapes each kWh's carbon cost.",
    participantFeedback:
      "Students appreciated seeing real numbers change week-over-week. Faculty asked for the audit to become a semesterly ritual. One volunteer said the exercise \"made the abstract concrete.\"",
    spiritOfFaith:
      "This work connects our care for creation to the everyday choices we make on campus. The audit was, in a small way, a stewardship examination of conscience.",
    zealForService:
      "The students volunteered without incentives; the mission itself pulled them in. Several stayed late to help Facilities re-label breaker panels.",
    communionInMission:
      "We are sharing our audit methodology with USLS Bacolod and DLSU-D so they can adapt it. The Sustainability Office is documenting the toolkit for the district.",
    whatWentWell:
      "Student engagement, over 240 volunteered for the audit teams, well above forecast. The occupancy sensors delivered measurable savings within two weeks.",
    challenges:
      "Getting real-time energy meter data required coordination with three departments. The initial baseline week had incomplete readings from Floor 4.",
    recommendations:
      "Bring Facilities into the planning phase from day one. Book meter access before the campaign starts, not during.",
    districtSuggestions:
      "A shared district template for baseline energy audits would save every school two weeks of setup. Consider offering training-of-trainers for Sustainability Officers.",
    continuing: "Yes",
    plannedActivity:
      "Extend the audit to Andrew Building and St. La Salle Hall in the next campaign month, then publish a district-wide toolkit.",
    notContinuingReason: null,
  },
};

// ---------------------------------------------------------------------------
// Insert helpers
// ---------------------------------------------------------------------------

function toReportRow(r) {
  return {
    editToken: randomBytes(24).toString("base64url"),
    submitterName: r.submitterName,
    submitterRole: r.submitterRole,
    submitterEmail: r.submitterEmail,
    submitterPhone: r.submitterPhone,
    schoolName: r.schoolName,
    projectTitle: r.projectTitle,
    description: r.description,
    dateImplemented: r.dateImplemented,
    projectDuration: r.projectDuration,
    targetParticipants: r.targetParticipants,
    projectLead: r.projectLead,
    initiativeTypes: r.initiativeTypes,
    initiativeOther: r.initiativeOther,
    sdgGoals: r.sdgGoals,
    students: r.students,
    faculty: r.faculty,
    staffAdmin: r.staffAdmin,
    community: r.community,
    totalParticipants: r.totalParticipants,
    schoolPopulation: r.schoolPopulation,
    participationRate: r.participationRate,
    impact: r.impact,
    effectiveness: r.effectiveness,
    digitalPlatforms: r.digitalPlatforms,
    digitalPlatformOther: r.digitalPlatformOther,
    hashtagUsed: r.hashtagUsed,
    hashtagEffectiveness: r.hashtagEffectiveness,
    reachReactions: r.reachReactions,
    reachComments: r.reachComments,
    reachShares: r.reachShares,
    reachViews: r.reachViews,
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
  where: { submitterEmail: EXAMPLE_EMAIL },
  select: { id: true },
});

if (existing.length > 0) {
  console.log(`Removing ${existing.length} prior example report(s)…`);
  await prisma.report.deleteMany({ where: { submitterEmail: EXAMPLE_EMAIL } });
}

if (cleanOnly) {
  console.log("Cleanup done. Skipping insert (--clean flag).");
  await prisma.$disconnect();
  process.exit(0);
}

console.log("Inserting example report…");
const row = toReportRow(EXAMPLE);
const created = await prisma.report.create({ data: row });
if (EXAMPLE.reflection) {
  await prisma.reflection.create({
    data: { reportId: created.id, ...EXAMPLE.reflection },
  });
}

console.log(`\nDone. Example report inserted:`);
console.log(`  ID:    ${created.id}`);
console.log(`  URL:   /reports/${created.id}`);
console.log(`  Email: ${EXAMPLE_EMAIL}`);
console.log(`\nTo remove: node scripts/seed-example-report.mjs --clean`);

await prisma.$disconnect();
