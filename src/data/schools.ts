// Lasallian East Asia District member schools.
// Edit this grouped map to add/remove/rename schools — LEAD_SCHOOLS auto-derives.

export const LEAD_SCHOOLS_BY_COUNTRY: Record<string, string[]> = {
  Philippines: [
    "De La Salle University – Manila",
    "De La Salle University – Laguna Campus",
    "De La Salle University – BGC Campus",
    "De La Salle-College of Saint Benilde (Manila)",
    "De La Salle Araneta University (Malabon)",
    "De La Salle University-Dasmariñas (Cavite)",
    "De La Salle Medical and Health Sciences Institute (Cavite)",
    "De La Salle Santiago Zobel School (Muntinlupa)",
    "De La Salle Lipa (Batangas)",
    "De La Salle Andres Soriano Memorial College (Toledo, Cebu)",
    "De La Salle John Bosco College (Bislig, Surigao del Sur)",
    "La Salle Green Hills (Mandaluyong)",
    "La Salle College Antipolo (Rizal)",
    "La Salle Academy (Iligan)",
    "La Salle University (Ozamiz)",
    "University of St. La Salle (Bacolod)",
    "St. Joseph School-La Salle (Bacolod)",
    "Jaime Hilario Integrated School-La Salle (Bagac, Bataan)",
    "The Mangyan School (Mindoro)",
  ],
  "Hong Kong": [
    "St. Joseph's College (Hong Kong Island)",
    "St. Joseph's Primary School (Hong Kong Island)",
    "La Salle College (Kowloon)",
    "La Salle Primary School (Kowloon)",
    "Chan Sui Ki (La Salle) College (Kowloon)",
    "Chan Sui Ki (La Salle) Primary School (Kowloon)",
    "Chong Gene Hang College (Chai Wan)",
    "De La Salle Secondary School, N.T. (Sheung Shui)",
  ],
  Singapore: [
    "De La Salle School",
    "LASALLE College of the Arts",
    "Saint Anthony's Primary School",
    "Saint Joseph's Institution",
    "Saint Joseph's Institution International School",
    "Saint Joseph's Institution Junior",
    "Saint Patrick's School",
    "Saint Stephen's School",
  ],
  Thailand: [
    "La Salle College (Bangkok)",
    "La Salle Chotiravi Nakhonsawan School (Nakhon Sawan)",
    "La Salle Chanthaburi (Mandapitak) School (Chanthaburi)",
    "La Salle Bamboo School / Learning Centre (Sangkhlaburi)",
    "La Salle Nursery (Bangkok)",
  ],
  Malaysia: [
    "St. John's Institution (Kuala Lumpur)",
    "St. Joseph's Institution International School (Petaling Jaya)",
    "La Salle School Brickfields (Kuala Lumpur)",
    "La Salle School Jinjang (Kuala Lumpur)",
    "La Salle School Peel Road (Kuala Lumpur)",
    "La Salle School Sentul (Kuala Lumpur)",
    "La Salle School Petaling Jaya (Selangor)",
    "La Salle School Klang (Selangor)",
    "St. Xavier's Institution (Penang)",
    "St. Michael's Institution (Ipoh, Perak)",
    "St. George's Institution (Taiping, Perak)",
    "St. Anthony's School (Teluk Intan, Perak)",
    "St. Francis Institution (Melaka)",
    "St. Andrew's Secondary School (Muar, Johor)",
    "St. Paul's Institution (Seremban, Negeri Sembilan)",
    "La Salle School (Kota Kinabalu, Sabah)",
    "St. Joseph's Secondary School (Kuching, Sarawak)",
    "Sacred Heart Secondary School (Sibu, Sarawak)",
    "St. Martin's School (Tambunan, Sabah)",
    "St. Mary's Secondary School (Sandakan, Sabah)",
  ],
  Japan: [
    "Hakodate La Salle High School (Hakodate)",
    "La Salle High School (Kagoshima)",
  ],
  Myanmar: ["De La Salle Academy (Yangon)"],
};

export type SchoolOption = { name: string; country: string };

export const LEAD_SCHOOLS: SchoolOption[] = Object.entries(
  LEAD_SCHOOLS_BY_COUNTRY
).flatMap(([country, names]) => names.map((name) => ({ name, country })));
