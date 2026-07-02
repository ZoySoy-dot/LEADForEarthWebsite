import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { SDG_LABELS } from "@/data/sdgs";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function esc(v: unknown): string {
  if (v === null || v === undefined || v === "") return "N/A";
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
}

function row(label: string, value: unknown): string {
  return `<tr>
    <td style="padding:6px 12px 6px 0;color:#757575;font-size:13px;vertical-align:top;width:40%">${esc(label)}</td>
    <td style="padding:6px 0;color:#2d2d2d;font-size:14px">${esc(value)}</td>
  </tr>`;
}

function sectionHeader(title: string): string {
  return `<h3 style="color:#1a5c2a;font-size:16px;margin:28px 0 10px 0;padding-bottom:6px;border-bottom:2px solid #2d8c3e">${esc(title)}</h3>`;
}

function checkboxList(obj: Record<string, boolean>, labels: Record<string, string>): string {
  const picked = Object.keys(obj)
    .filter((k) => obj[k])
    .map((k) => labels[k] ?? k);
  return picked.length ? picked.join(", ") : "N/A";
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  if (!data?.submitter?.email || !data?.overview?.schoolName || !data?.overview?.projectTitle) {
    return NextResponse.json(
      { error: "School name, project title, and submitter email are required." },
      { status: 400 }
    );
  }

  const initiativeLabels = {
    energy: "Energy Conservation",
    water: "Water Conservation",
    biodiversity: "Biodiversity Conservation",
    waste: "Waste Reduction/Recycling",
    education: "Environmental Education",
    cleanup: "Clean-Up Drive",
    circular: "Circular Economy Drive",
    other: "Other",
  };

  const platformLabels = {
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    twitter: "X/Twitter",
    other: "Other",
  };

  const biodiversityTypes = data.impact?.biodiversity?.types ?? {};
  const educationTypes = data.impact?.education?.types ?? {};
  const cleanupAreas = data.impact?.cleanup?.areas ?? {};

  const objectiveRows = (data.objectives ?? [])
    .map(
      (o: { text: string; achieved: string; evidence: string }, i: number) => `
      <tr>
        <td style="padding:8px;border:1px solid #e0e0e0;vertical-align:top;font-size:13px">${i + 1}. ${esc(o.text)}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;vertical-align:top;font-size:13px;width:100px;text-align:center">${esc(o.achieved)}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;vertical-align:top;font-size:13px">${esc(o.evidence)}</td>
      </tr>`
    )
    .join("");

  const effectivenessRows = (data.effectiveness ?? [])
    .map(
      (c: { criteria: string; rating: string; remarks: string }) => `
      <tr>
        <td style="padding:8px;border:1px solid #e0e0e0;font-size:13px">${esc(c.criteria)}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;font-size:13px;text-align:center;width:80px">${esc(c.rating)}</td>
        <td style="padding:8px;border:1px solid #e0e0e0;font-size:13px">${esc(c.remarks)}</td>
      </tr>`
    )
    .join("");

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:780px;margin:0 auto;color:#2d2d2d">
    <div style="background:#1a5c2a;padding:24px 32px;border-radius:12px 12px 0 0">
      <h2 style="color:#fff;margin:0;font-size:20px">New #LEADforEarth Impact Report</h2>
      <p style="color:#c8e6c9;margin:6px 0 0 0;font-size:13px">${esc(data.overview?.schoolName)} | ${esc(data.overview?.projectTitle)}</p>
    </div>
    <div style="background:#f7faf7;padding:24px 32px;border-radius:0 0 12px 12px;border:1px solid #e0e0e0">

      ${sectionHeader("Submitter")}
      <table style="width:100%;border-collapse:collapse">
        ${row("Name", data.submitter?.name)}
        ${row("Role", data.submitter?.role)}
        ${row("Email", data.submitter?.email)}
        ${row("Phone", data.submitter?.phone)}
      </table>

      ${sectionHeader("I. Project Overview")}
      <table style="width:100%;border-collapse:collapse">
        ${row("School Name", data.overview?.schoolName)}
        ${row("Project Title", data.overview?.projectTitle)}
        ${row("Brief Description of Activity", data.overview?.description)}
        ${row("Date Implemented", data.overview?.dateImplemented)}
        ${row("Project Duration", data.overview?.projectDuration)}
        ${row("Target Participants", data.overview?.targetParticipants)}
        ${row("Project Lead", data.overview?.projectLead)}
        ${row("Type of Initiative", checkboxList(data.overview?.initiativeTypes ?? {}, initiativeLabels))}
        ${data.overview?.initiativeTypes?.other ? row("Other Initiative (specify)", data.overview?.initiativeOther) : ""}
        ${row("SDGs Addressed", checkboxList(data.overview?.sdgGoals ?? {}, SDG_LABELS))}
      </table>

      ${sectionHeader("II. Participation Data")}
      <table style="width:100%;border-collapse:collapse">
        ${row("Students", data.participation?.students)}
        ${row("Faculty", data.participation?.faculty)}
        ${row("Staff, Associates, and Administration", data.participation?.staffAdmin)}
        ${row("Community Members", data.participation?.community)}
        ${row("Total Number of Participants", data.participation?.total)}
        ${row("Total School Population", data.participation?.schoolPopulation)}
        ${row("Participation Rate (%)", data.participation?.rate)}
      </table>

      ${sectionHeader("III. Objectives Assessment")}
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead>
          <tr style="background:#eef5ee">
            <th style="padding:8px;border:1px solid #e0e0e0;text-align:left">Objective</th>
            <th style="padding:8px;border:1px solid #e0e0e0">Achieved?</th>
            <th style="padding:8px;border:1px solid #e0e0e0;text-align:left">Evidence / Explanation</th>
          </tr>
        </thead>
        <tbody>${objectiveRows}</tbody>
      </table>

      ${sectionHeader("IV. Environmental Impact Evaluation")}

      ${
        data.overview?.initiativeTypes?.energy
          ? `<h4 style="color:#2d8c3e;font-size:14px;margin:16px 0 8px">Energy Conservation</h4>
             <table style="width:100%;border-collapse:collapse">
               ${row("Baseline (1 mo before), kWh", data.impact?.energy?.baselineKwh)}
               ${row("Post-Activity (1 mo after), kWh", data.impact?.energy?.postKwh)}
               ${row("kWh Reduced", data.impact?.energy?.kwhReduced)}
               ${row("Estimated Cost Savings", data.impact?.energy?.costSavings)}
               ${row("Classrooms/Offices/Departments Participating", data.impact?.energy?.unitsParticipating)}
             </table>`
          : ""
      }

      ${
        data.overview?.initiativeTypes?.water
          ? `<h4 style="color:#2d8c3e;font-size:14px;margin:16px 0 8px">Water Conservation</h4>
             <table style="width:100%;border-collapse:collapse">
               ${row("Baseline (1 mo before), liter / m³", data.impact?.water?.baselineWater)}
               ${row("Post-Activity (1 mo after), liter / m³", data.impact?.water?.postWater)}
               ${row("Estimated Liters Saved", data.impact?.water?.litersSaved)}
               ${row("Estimated Cost Savings", data.impact?.water?.costSavings)}
               ${row("Classrooms/Offices/Departments Participating", data.impact?.water?.unitsParticipating)}
             </table>`
          : ""
      }

      ${
        data.overview?.initiativeTypes?.biodiversity
          ? `<h4 style="color:#2d8c3e;font-size:14px;margin:16px 0 8px">Biodiversity Conservation</h4>
             <table style="width:100%;border-collapse:collapse">
               ${row("Type of Activity", checkboxList(biodiversityTypes, { habitat: "Habitat Restoration", species: "Native Species Protection", greening: "Campus Greening", awareness: "Wildlife Awareness Campaign" }))}
               ${row("Native Species Planted/Protected", data.impact?.biodiversity?.speciesPlanted)}
               ${row("Area Rehabilitated (sqm/hectares)", data.impact?.biodiversity?.areaRehabilitated)}
               ${row("Awareness Activities Conducted", data.impact?.biodiversity?.awarenessActivities)}
               ${row("Partner Organizations", data.impact?.biodiversity?.partnerOrgs)}
               ${row("Classrooms/Offices/Departments Participating", data.impact?.biodiversity?.unitsParticipating)}
             </table>`
          : ""
      }

      ${
        data.overview?.initiativeTypes?.waste
          ? `<h4 style="color:#2d8c3e;font-size:14px;margin:16px 0 8px">Waste Reduction / Recycling</h4>
             <table style="width:100%;border-collapse:collapse">
               ${row("Baseline (1 mo before), kg", data.impact?.waste?.baselineKg)}
               ${row("Post-Activity (1 mo after), kg", data.impact?.waste?.postKg)}
               ${row("Total Waste Collected (kg)", data.impact?.waste?.totalCollected)}
               ${row("Waste Recycled / Diverted (kg)", data.impact?.waste?.recycledDiverted)}
               ${row("Reduction in Waste Generation (%)", data.impact?.waste?.reductionPct)}
               ${row("Classrooms/Offices/Departments Participating", data.impact?.waste?.unitsParticipating)}
             </table>`
          : ""
      }

      ${
        data.overview?.initiativeTypes?.education
          ? `<h4 style="color:#2d8c3e;font-size:14px;margin:16px 0 8px">Environmental Education</h4>
             <table style="width:100%;border-collapse:collapse">
               ${row("Type of Activity", checkboxList(educationTypes, { forum: "Forum", seminar: "Seminar", workshop: "Workshop", awareness: "Awareness Campaign" }))}
               ${row("Sessions Conducted", data.impact?.education?.sessions)}
               ${row("Speakers / Resource Persons", data.impact?.education?.speakers)}
               ${row("Educational Materials Distributed", data.impact?.education?.materials)}
               ${row("Attendees", data.impact?.education?.attendees)}
             </table>`
          : ""
      }

      ${
        data.overview?.initiativeTypes?.cleanup
          ? `<h4 style="color:#2d8c3e;font-size:14px;margin:16px 0 8px">Clean-Up Drive</h4>
             <table style="width:100%;border-collapse:collapse">
               ${row("Area of Clean-Up", checkboxList(cleanupAreas, { campus: "Campus", community: "Community", river: "River", coastal: "Coastal", park: "Park", other: "Other" }))}
               ${cleanupAreas.other ? row("Other Area (specify)", data.impact?.cleanup?.areaOther) : ""}
               ${row("Total Waste Collected (kg)", data.impact?.cleanup?.wasteCollected)}
               ${row("Area Cleaned (sqm/hectares)", data.impact?.cleanup?.areaCleaned)}
               ${row("Trash Bags Filled", data.impact?.cleanup?.bagsFilled)}
               ${row("Partner Organizations", data.impact?.cleanup?.partnerOrgs)}
               ${row("Volunteers Involved", data.impact?.cleanup?.volunteers)}
             </table>`
          : ""
      }

      ${
        data.overview?.initiativeTypes?.circular
          ? `<h4 style="color:#2d8c3e;font-size:14px;margin:16px 0 8px">Circular Economy Drive</h4>
             <table style="width:100%;border-collapse:collapse">
               ${row("Donated Items Collected", data.impact?.circular?.itemsCollected)}
               ${row("Items Sold / Redistributed", data.impact?.circular?.itemsRedistributed)}
               ${row("Funds Raised", data.impact?.circular?.fundsRaised)}
               ${row("Beneficiary Organization(s)", data.impact?.circular?.beneficiaryOrgs)}
               ${row("Partner Organizations", data.impact?.circular?.partnerOrgs)}
               ${row("Volunteers Involved", data.impact?.circular?.volunteers)}
             </table>`
          : ""
      }

      ${
        data.impact?.otherImpact
          ? `<h4 style="color:#2d8c3e;font-size:14px;margin:16px 0 8px">Other Environmental Actions</h4>
             <table style="width:100%;border-collapse:collapse">
               ${row("Impact Indicators Used", data.impact?.otherImpact)}
             </table>`
          : ""
      }

      ${sectionHeader("V. Effectiveness of Implementation")}
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead>
          <tr style="background:#eef5ee">
            <th style="padding:8px;border:1px solid #e0e0e0;text-align:left">Criteria</th>
            <th style="padding:8px;border:1px solid #e0e0e0">Rating (1–5)</th>
            <th style="padding:8px;border:1px solid #e0e0e0;text-align:left">Remarks</th>
          </tr>
        </thead>
        <tbody>${effectivenessRows}</tbody>
      </table>

      ${sectionHeader("VI. Climate Literacy and Reflection")}
      <table style="width:100%;border-collapse:collapse">
        ${row("Pre-event sessions and post-event reflections included?", data.climateLiteracy?.included)}
        ${row("Description", data.climateLiteracy?.description)}
      </table>

      ${sectionHeader("VII. Participant Feedback")}
      <table style="width:100%;border-collapse:collapse">
        ${row("Key Insights", data.participantFeedback)}
      </table>

      ${sectionHeader("VIII. Digital Advocacy Impact")}
      <table style="width:100%;border-collapse:collapse">
        ${row("Platforms Used", checkboxList(data.digitalAdvocacy?.platforms ?? {}, platformLabels))}
        ${data.digitalAdvocacy?.platforms?.other ? row("Other Platform (specify)", data.digitalAdvocacy?.platformOther) : ""}
        ${row("#LEADforEarth Hashtag Used?", data.digitalAdvocacy?.hashtagUsed)}
        ${row("Hashtag Effectiveness / Notes", data.digitalAdvocacy?.hashtagEffectiveness)}
        ${row("Total Reactions / Likes", data.digitalAdvocacy?.reach?.reactions)}
        ${row("Total Comments", data.digitalAdvocacy?.reach?.comments)}
        ${row("Total Shares / Reposts", data.digitalAdvocacy?.reach?.shares)}
        ${row("Total Reach / Views", data.digitalAdvocacy?.reach?.views)}
        ${row("Official Post Links", data.digitalAdvocacy?.postLinks)}
      </table>

      ${sectionHeader("IX. Lasallian Reflection")}
      <table style="width:100%;border-collapse:collapse">
        ${row("Spirit of Faith: Responsibility toward creation", data.lasallianReflection?.spiritOfFaith)}
        ${row("Zeal for Service: Active service demonstrated", data.lasallianReflection?.zealForService)}
        ${row("Communion in Mission: Lasallian collaboration", data.lasallianReflection?.communionInMission)}
      </table>

      ${sectionHeader("X. Lessons Learned and Recommendations")}
      <table style="width:100%;border-collapse:collapse">
        ${row("A. What Went Well", data.lessons?.whatWentWell)}
        ${row("B. Challenges Encountered", data.lessons?.challenges)}
        ${row("C. Recommendations for Future Implementation", data.lessons?.recommendations)}
        ${row("D. Suggestions for the District Committee", data.lessons?.districtSuggestions)}
        ${row("E. Continuing next campaign month?", data.lessons?.continuing)}
        ${data.lessons?.continuing === "Yes" ? row("Planned Activity", data.lessons?.plannedActivity) : ""}
        ${data.lessons?.continuing === "No" ? row("Reason", data.lessons?.notContinuingReason) : ""}
      </table>

      ${sectionHeader("Documentation")}
      <table style="width:100%;border-collapse:collapse">
        ${row("Photo / Documentation Links", data.documentationLinks)}
      </table>

    </div>
  </div>`;

  await transporter.sendMail({
    from: `"LEADForEarth Website" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_RECIPIENT ?? process.env.SMTP_USER,
    replyTo: data.submitter?.email,
    subject: `[LEADForEarth Report] ${data.overview?.schoolName} | ${data.overview?.projectTitle}`,
    html,
  });

  return NextResponse.json({ success: true });
}
