# LEADForEarth

**One district, one mission for the Earth.**

LEADForEarth is the environmental initiative of the Lasallian East Asia District (LEAD). It's a district-wide campaign that unites Lasallian schools across East Asia under a single banner and a single hashtag: **#LEADforEarth**.

Each campus chooses its own environmental action, meaningful and feasible for its local context. All of us post under the same hashtag so the district can track progress, roll up impact, and celebrate what's happening together.

## Why it exists

The program grew out of the first International LEAD EcoCamp. It moves the district's institutions from awareness to concrete, repeatable action, so environmental care becomes a normal rhythm of Lasallian school life rather than a one-off event.

It's built on two foundations:

- **Laudato Si'.** Pope Francis's 2015 encyclical on caring for our common home calls every individual, community, and institution to take responsibility for the environment. For Lasallian schools, it's a spiritual mandate that directly informs our participation in LEADForEarth.
- **The UN Sustainable Development Goals.** We align our reporting and activities with the SDGs, especially:
  - SDG 4: Quality Education
  - SDG 11: Sustainable Cities and Communities
  - SDG 12: Responsible Consumption and Production
  - SDG 13: Climate Action
  - SDG 14: Life Below Water
  - SDG 15: Life on Land

## The Lasallian district

Seven sectors, one district:

- Hong Kong
- Japan
- Malaysia
- Myanmar
- Philippines
- Singapore
- Thailand

Different campuses, different actions, one shared mission across continents as one global body of young Lasallians.

## How it works

Four steps every participating school follows each month:

1. **Create action.** Each participating school selects an environmental action that's meaningful and feasible for its own community.
2. **Post with #LEADforEarth.** Document your action on your school's official social media using `#LEADforEarth`, and share your story with the district committee.
3. **Report.** Submit a standardized report to the LEADForEarth committee through this website.
4. **Share your story.** The district committee compiles the stories and shares them on the official LEADForEarth platforms, highlighting the collective impact of all participating schools.

## Suggested actions

Inspirations, not requirements. Adapt, combine, or design your own.

- **Trees and Biodiversity.** Propagation and protection of native or endemic trees, birding activities, support for biodiversity conservation, nature camps.
- **Carbon and Climate.** Project Carbon Neutral, Low Carbon Footprint campaigns.
- **Water Stewardship.** Water conservation initiatives, rain harvesting.
- **Urban Growing and Food.** Urban gardening, composting, vermiculture, hydroponics.
- **Waste and Circular Economy.** Cleanup drives, plastic reduction campaigns, upcycling projects.
- **Community Wellbeing.** Soup kitchens and feeding programs, hunger campaigns, education caravans, Alternative Learning Systems.
- **Advocacy and Awareness.** Awareness campaigns, gender sensitivity, gender equality initiatives, DEI campaigns, peace education.

## What guides us

The Lasallian core values shape how we work:

- **Spirit of Faith.** Every action is grounded in our relationship with the Creator who entrusted this Earth to our care.
- **Zeal for Service.** We translate concern into concrete action, approaching our work with generosity and creativity.
- **Communion in Mission.** Different campuses, different actions, one shared mission.

United not by strict uniformity, but by a shared and enduring mission to protect our planet.

## Contact

- Website: [leadforearth.org](https://leadforearth.org)
- Email: [LeadForEarth@gmail.com](mailto:LeadForEarth@gmail.com)

## About this repository

This repo contains the LEADForEarth campaign website: the public landing pages, community view, guidelines, report submission form, and the admin site the committee uses to review reports and inquiries.

**Stack:** Next.js 16 (App Router) · React · TypeScript · Tailwind CSS v4 · Prisma · Postgres (Neon) · Auth.js (Google).

### Local development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Environment variables you'll need (see `.env.example` if present):

- `DATABASE_URL` and `DIRECT_URL` (Neon Postgres connection strings)
- `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` (Auth.js Google provider)
- `SMTP_*` (for admin replies to inquiries)

### Useful commands

```bash
npm run dev                                    # start the dev server
npx tsc --noEmit                               # type check
npx prisma migrate dev --name <change>         # apply schema changes to Neon
npx prisma studio                              # inspect the database
node scripts/seed-example-report.mjs           # seed the sample example report
node scripts/seed-example-report.mjs --clean   # remove the example report
```
