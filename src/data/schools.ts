// Canonical roster of Lasallian East Asia District member schools.
// Coordinates are in decimal degrees (lat, lng). Edit this list to add,
// rename, or remove schools; every other consumer is derived from it.

export type SchoolPrecision = "exact" | "approx" | "verify" | "shared-campus";

export type LeadSchool = {
  name: string;
  country: string; // sector name (Hong Kong, Japan, ...)
  countryCode: string; // ISO 3166-1 alpha-2
  location: string; // human-readable address / area
  lat: number;
  lng: number;
  precision: SchoolPrecision;
};

export const LEAD_SCHOOLS: readonly LeadSchool[] = [
  // ---- Hong Kong ----------------------------------------------------------
  { name: "La Salle Primary School", country: "Hong Kong", countryCode: "HK", location: "Kowloon Tong, Kowloon", lat: 22.327398, lng: 114.181338, precision: "exact" },
  { name: "La Salle College", country: "Hong Kong", countryCode: "HK", location: "18 La Salle Road, Kowloon Tong", lat: 22.328692, lng: 114.182732, precision: "exact" },
  { name: "St. Joseph's College", country: "Hong Kong", countryCode: "HK", location: "7 Kennedy Road, Central", lat: 22.276779, lng: 114.158706, precision: "exact" },
  { name: "De La Salle Secondary School, N.T.", country: "Hong Kong", countryCode: "HK", location: "Kwu Tung, New Territories", lat: 22.501871, lng: 114.111261, precision: "exact" },
  { name: "Chan Sui Ki (La Salle) College", country: "Hong Kong", countryCode: "HK", location: "Sheung Wo Street, Ho Man Tin", lat: 22.319364, lng: 114.183056, precision: "exact" },
  { name: "Chong Gene Hang College", country: "Hong Kong", countryCode: "HK", location: "12 Cheung Man Road, Chai Wan", lat: 22.268164, lng: 114.237402, precision: "exact" },
  { name: "St. Joseph's Primary School", country: "Hong Kong", countryCode: "HK", location: "48 Wood Road, Wan Chai", lat: 22.275391, lng: 114.176663, precision: "exact" },
  { name: "Chan Sui Ki (La Salle) Primary School", country: "Hong Kong", countryCode: "HK", location: "22 Sheung Shing Street, Ho Man Tin", lat: 22.318631, lng: 114.181138, precision: "exact" },

  // ---- Japan --------------------------------------------------------------
  { name: "Hakodate La Salle Gakuen", country: "Japan", countryCode: "JP", location: "Hiyoshicho, Hakodate, Hokkaido", lat: 41.788048, lng: 140.790169, precision: "exact" },
  { name: "La Salle Gakuen", country: "Japan", countryCode: "JP", location: "Komatsubara, Kagoshima", lat: 31.530344, lng: 130.527592, precision: "exact" },

  // ---- Myanmar ------------------------------------------------------------
  { name: "La Salle Center", country: "Myanmar", countryCode: "MM", location: "Insein, Yangon", lat: 16.827813, lng: 96.129688, precision: "exact" },
  { name: "La Salle Juniorate", country: "Myanmar", countryCode: "MM", location: "Circular Road, Pyin Oo Lwin (Maymyo)", lat: 22.041292, lng: 96.468018, precision: "exact" },
  { name: "De La Salle Academy", country: "Myanmar", countryCode: "MM", location: "11 May Kha Road, Yangon", lat: 16.852072, lng: 96.144016, precision: "exact" },

  // ---- Malaysia -----------------------------------------------------------
  { name: "St. Xavier's Secondary School", country: "Malaysia", countryCode: "MY", location: "Lebuh Farquhar, George Town, Penang", lat: 5.421038, lng: 100.336763, precision: "exact" },
  { name: "St. Xavier's Branch School", country: "Malaysia", countryCode: "MY", location: "Jalan Brother James, Pulau Tikus, Penang", lat: 5.431308, lng: 100.306926, precision: "exact" },
  { name: "St. Xavier's Primary School", country: "Malaysia", countryCode: "MY", location: "Jalan Sekolah La Salle, Ayer Itam, Penang", lat: 5.40903, lng: 100.300082, precision: "exact" },
  { name: "St. George's Secondary School", country: "Malaysia", countryCode: "MY", location: "Jalan Stesen, Taiping, Perak", lat: 4.852562, lng: 100.73777, precision: "exact" },
  { name: "St. George's Primary School", country: "Malaysia", countryCode: "MY", location: "Jalan Muzium Hulu, Taiping, Perak", lat: 4.853994, lng: 100.736045, precision: "exact" },
  { name: "St. Michael's Secondary School", country: "Malaysia", countryCode: "MY", location: "Jalan S.P. Seenivasagam, Ipoh, Perak", lat: 4.599892, lng: 101.077065, precision: "exact" },
  { name: "St. Michael's Primary School", country: "Malaysia", countryCode: "MY", location: "Jalan S.P. Seenivasagam, Ipoh, Perak", lat: 4.60124, lng: 101.07872, precision: "approx" },
  { name: "La Salle Primary School Ipoh", country: "Malaysia", countryCode: "MY", location: "Lebuh Sungai Senam, Taman Canning, Ipoh", lat: 4.607942, lng: 101.108974, precision: "exact" },
  { name: "St. Anthony's Secondary School", country: "Malaysia", countryCode: "MY", location: "Jalan Sekolah, Teluk Intan, Perak", lat: 4.02666, lng: 101.023994, precision: "exact" },
  { name: "St. Anthony's Primary School", country: "Malaysia", countryCode: "MY", location: "Jalan Sungai Nibong, Teluk Intan, Perak", lat: 4.022858, lng: 101.030799, precision: "exact" },
  { name: "La Salle Secondary School Klang", country: "Malaysia", countryCode: "MY", location: "Persiaran Raja Muda Musa, Klang, Selangor", lat: 3.031758, lng: 101.437159, precision: "exact" },
  { name: "La Salle Primary School Klang", country: "Malaysia", countryCode: "MY", location: "Persiaran Raja Muda Musa, Klang, Selangor", lat: 3.031758, lng: 101.437159, precision: "shared-campus" },
  { name: "La Salle Secondary School Petaling Jaya", country: "Malaysia", countryCode: "MY", location: "Jalan Chantek 5/13, Seksyen 5, PJ", lat: 3.100639, lng: 101.654391, precision: "exact" },
  { name: "La Salle Primary School Petaling Jaya", country: "Malaysia", countryCode: "MY", location: "Jalan Gasing, Seksyen 5, PJ", lat: 3.100554, lng: 101.652603, precision: "exact" },
  { name: "La Salle Secondary School Brickfields", country: "Malaysia", countryCode: "MY", location: "282 Jalan Tun Sambanthan, KL", lat: 3.127509, lng: 101.683702, precision: "exact" },
  { name: "La Salle Primary School Brickfields", country: "Malaysia", countryCode: "MY", location: "Jalan Tun Sambanthan, Brickfields, KL", lat: 3.127301, lng: 101.683548, precision: "exact" },
  { name: "St. John's Secondary School", country: "Malaysia", countryCode: "MY", location: "9 Jalan Bukit Nanas, Kuala Lumpur", lat: 3.151202, lng: 101.700086, precision: "exact" },
  { name: "St. John's Primary School", country: "Malaysia", countryCode: "MY", location: "Jalan Bukit Nanas, Kuala Lumpur", lat: 3.150683, lng: 101.699022, precision: "exact" },
  { name: "La Salle Secondary School Sentul", country: "Malaysia", countryCode: "MY", location: "800 Jalan Sentul, Kuala Lumpur", lat: 3.180241, lng: 101.691986, precision: "exact" },
  { name: "La Salle Primary School Sentul", country: "Malaysia", countryCode: "MY", location: "800 Jalan Sentul, Kuala Lumpur", lat: 3.180241, lng: 101.691986, precision: "shared-campus" },
  { name: "La Salle Jinjang Primary 1", country: "Malaysia", countryCode: "MY", location: "Jalan School Lane, Jinjang Utara, KL", lat: 3.21419, lng: 101.661398, precision: "exact" },
  { name: "La Salle Jinjang Primary 2", country: "Malaysia", countryCode: "MY", location: "Jalan School Lane, Jinjang Utara, KL", lat: 3.21419, lng: 101.661398, precision: "shared-campus" },
  { name: "St. Paul's Secondary School", country: "Malaysia", countryCode: "MY", location: "Jalan Tan Sri Manickavasagam, Seremban", lat: 2.728715, lng: 101.932082, precision: "exact" },
  { name: "St. Paul's Primary School", country: "Malaysia", countryCode: "MY", location: "Taman Bukit Labu, Seremban", lat: 2.72162, lng: 101.919198, precision: "exact" },
  { name: "St. Francis' Secondary School", country: "Malaysia", countryCode: "MY", location: "Jalan Parameswara, Banda Hilir, Melaka", lat: 2.190833, lng: 102.252673, precision: "exact" },
  { name: "St. Francis' Primary School", country: "Malaysia", countryCode: "MY", location: "Jalan Chan Koon Cheng, Banda Hilir, Melaka", lat: 2.192647, lng: 102.253806, precision: "exact" },
  { name: "St. Andrew's Secondary School Muar", country: "Malaysia", countryCode: "MY", location: "Jalan Hashim, Muar, Johor", lat: 2.050288, lng: 102.577563, precision: "exact" },
  { name: "St. Andrew's Primary School Muar", country: "Malaysia", countryCode: "MY", location: "Jalan Hashim, Muar, Johor", lat: 2.051379, lng: 102.577619, precision: "exact" },
  { name: "La Salle Secondary School Kota Kinabalu", country: "Malaysia", countryCode: "MY", location: "Jalan Murni, Tanjung Aru, Sabah", lat: 5.95369, lng: 116.05223, precision: "exact" },
  { name: "Sacred Heart Primary School Kota Kinabalu", country: "Malaysia", countryCode: "MY", location: "Jalan Menteri, Karamunsing, Sabah", lat: 5.964686, lng: 116.071922, precision: "exact" },
  { name: "St. Martin's Secondary School Tambunan", country: "Malaysia", countryCode: "MY", location: "Tambunan, Sabah", lat: 5.691583, lng: 116.38016, precision: "exact" },
  { name: "St. Joseph's Secondary School Kuching", country: "Malaysia", countryCode: "MY", location: "Jalan Tun Abang Haji Openg, Sarawak", lat: 1.55132, lng: 110.341193, precision: "exact" },
  { name: "Sacred Heart Secondary School Sibu", country: "Malaysia", countryCode: "MY", location: "Sibu, Sarawak", lat: 2.296399, lng: 111.841408, precision: "exact" },

  // ---- Philippines --------------------------------------------------------
  { name: "De La Salle University", country: "Philippines", countryCode: "PH", location: "2401 Taft Avenue, Malate, Manila", lat: 14.564764, lng: 120.993165, precision: "exact" },
  { name: "De La Salle University - Integrated School", country: "Philippines", countryCode: "PH", location: "2401 Taft Avenue, Malate, Manila", lat: 14.564764, lng: 120.993165, precision: "shared-campus" },
  { name: "De La Salle University - The Academy", country: "Philippines", countryCode: "PH", location: "DLSU Laguna Campus, Binan (verify)", lat: 14.26228, lng: 121.042491, precision: "verify" },
  { name: "De La Salle - College of Saint Benilde (Manila)", country: "Philippines", countryCode: "PH", location: "2544 Taft Avenue, Malate, Manila", lat: 14.563847, lng: 120.994791, precision: "exact" },
  { name: "De La Salle - College of Saint Benilde (Antipolo)", country: "Philippines", countryCode: "PH", location: "8 L. Sumulong Memorial Circle, Antipolo, Rizal", lat: 14.582363, lng: 121.181764, precision: "exact" },
  { name: "De La Salle - College of Saint Benilde (Benilde Deaf School)", country: "Philippines", countryCode: "PH", location: "2544 Taft Avenue, Malate, Manila", lat: 14.563287, lng: 120.994598, precision: "exact" },
  { name: "De La Salle University - Dasmarinas", country: "Philippines", countryCode: "PH", location: "West Avenue, Dasmarinas, Cavite", lat: 14.326852, lng: 120.957451, precision: "exact" },
  { name: "De La Salle Medical and Health Sciences Institute", country: "Philippines", countryCode: "PH", location: "Gov. D. Mangubat Ave, Dasmarinas, Cavite", lat: 14.327735, lng: 120.943268, precision: "exact" },
  { name: "De La Salle Araneta University", country: "Philippines", countryCode: "PH", location: "303 Victoneta Ave, Potrero, Malabon", lat: 14.671194, lng: 120.998561, precision: "exact" },
  { name: "De La Salle Lipa", country: "Philippines", countryCode: "PH", location: "J.P. Laurel National Highway, Lipa City, Batangas", lat: 13.94157, lng: 121.147731, precision: "exact" },
  { name: "De La Salle Santiago Zobel School", country: "Philippines", countryCode: "PH", location: "University Ave, Ayala Alabang, Muntinlupa", lat: 14.409318, lng: 121.01955, precision: "exact" },
  { name: "La Salle Green Hills", country: "Philippines", countryCode: "PH", location: "1556 Ortigas Ave, Mandaluyong City", lat: 14.59623, lng: 121.055019, precision: "exact" },
  { name: "La Salle College Antipolo", country: "Philippines", countryCode: "PH", location: "1985 La Salle St, Antipolo, Rizal", lat: 14.603291, lng: 121.205067, precision: "exact" },
  { name: "De La Salle - Andres Soriano Memorial College", country: "Philippines", countryCode: "PH", location: "Toledo City, Cebu", lat: 10.310095, lng: 123.710501, precision: "exact" },
  { name: "De La Salle - John Bosco College", country: "Philippines", countryCode: "PH", location: "Mangagoy, Bislig City, Surigao del Sur", lat: 8.180394, lng: 126.354073, precision: "exact" },
  { name: "La Salle Academy", country: "Philippines", countryCode: "PH", location: "Bro. Raymund Jeffrey Rd, Palao, Iligan City", lat: 8.230642, lng: 124.246358, precision: "exact" },
  { name: "La Salle University", country: "Philippines", countryCode: "PH", location: "Burgos St. Extension, Ozamiz City", lat: 8.148495, lng: 123.846813, precision: "exact" },
  { name: "St. Jaime Hilario Integrated School - De La Salle", country: "Philippines", countryCode: "PH", location: "Bagac, Bataan", lat: 14.627486, lng: 120.367348, precision: "exact" },
  { name: "St. Joseph School - La Salle", country: "Philippines", countryCode: "PH", location: "Fr. Gratian Murray AFSC St, Bacolod City", lat: 10.670388, lng: 122.965482, precision: "exact" },
  { name: "University of St. La Salle", country: "Philippines", countryCode: "PH", location: "La Salle Avenue, Bacolod City", lat: 10.678796, lng: 122.962333, precision: "exact" },

  // ---- Singapore ----------------------------------------------------------
  { name: "De La Salle School", country: "Singapore", countryCode: "SG", location: "11 Choa Chu Kang Street 52", lat: 1.39507, lng: 103.743372, precision: "exact" },
  { name: "St Anthony's Primary School", country: "Singapore", countryCode: "SG", location: "30 Bukit Batok Street 32", lat: 1.364189, lng: 103.748959, precision: "exact" },
  { name: "St Stephen's School", country: "Singapore", countryCode: "SG", location: "20 Siglap View", lat: 1.318829, lng: 103.917569, precision: "exact" },
  { name: "St Joseph's Institution Junior", country: "Singapore", countryCode: "SG", location: "3 Essex Road", lat: 1.317362, lng: 103.84548, precision: "exact" },
  { name: "St Joseph's Institution Independent", country: "Singapore", countryCode: "SG", location: "38 Malcolm Road", lat: 1.323413, lng: 103.827644, precision: "exact" },
  { name: "St Joseph's Institution International PreSchool", country: "Singapore", countryCode: "SG", location: "49A Holland Road", lat: 1.308588, lng: 103.809056, precision: "exact" },
  { name: "St Joseph's Institution International Elementary", country: "Singapore", countryCode: "SG", location: "490 Thomson Road", lat: 1.333726, lng: 103.841008, precision: "exact" },
  { name: "St Joseph's Institution International High School", country: "Singapore", countryCode: "SG", location: "490 Thomson Road", lat: 1.333726, lng: 103.841008, precision: "shared-campus" },
  { name: "St Patrick's School", country: "Singapore", countryCode: "SG", location: "490 East Coast Road", lat: 1.308693, lng: 103.916329, precision: "exact" },

  // ---- Thailand -----------------------------------------------------------
  { name: "La Salle School Bangkok", country: "Thailand", countryCode: "TH", location: "752 Thanon Lasalle, Bang Na, Bangkok", lat: 13.658028, lng: 100.631805, precision: "exact" },
  { name: "La Salle School Nakhonsawan", country: "Thailand", countryCode: "TH", location: "Pak Nam Pho, Mueang Nakhon Sawan", lat: 15.719487, lng: 100.13955, precision: "exact" },
  { name: "La Salle School Chanthaburi", country: "Thailand", countryCode: "TH", location: "Chanthanimit, Mueang Chanthaburi", lat: 12.615527, lng: 102.127187, precision: "exact" },
  { name: "La Salle School Sangkhlaburi", country: "Thailand", countryCode: "TH", location: "Nong Lu, Sangkhla Buri, Kanchanaburi", lat: 15.305946, lng: 98.408097, precision: "exact" },
];

// Grouped view; consumed by the autocomplete and the community page.
export const LEAD_SCHOOLS_BY_COUNTRY: Record<string, string[]> =
  LEAD_SCHOOLS.reduce<Record<string, string[]>>((acc, s) => {
    (acc[s.country] ??= []).push(s.name);
    return acc;
  }, {});

// Older, seeded, or renamed school names that don't match the canonical
// list; used only by pages that need to bucket historical reports into
// their sector for display. Keys must be lowercase.
export const LEGACY_SCHOOL_ALIASES: Record<string, string> = {
  "de la salle university – manila": "De La Salle University",
  "de la salle university - manila": "De La Salle University",
  "de la salle university-dasmariñas (cavite)": "De La Salle University - Dasmarinas",
  "de la salle-college of saint benilde (manila)": "De La Salle - College of Saint Benilde (Manila)",
  "de la salle araneta university (malabon)": "De La Salle Araneta University",
  "la salle green hills (mandaluyong)": "La Salle Green Hills",
  "university of st. la salle (bacolod)": "University of St. La Salle",
  "la salle college (kowloon)": "La Salle College",
  "st. joseph's college (hong kong island)": "St. Joseph's College",
  "chan sui ki (la salle) college (kowloon)": "Chan Sui Ki (La Salle) College",
  "st. john's institution (kuala lumpur)": "St. John's Secondary School",
  "st. xavier's institution (penang)": "St. Xavier's Secondary School",
  "st. michael's institution (ipoh, perak)": "St. Michael's Secondary School",
  "saint joseph's institution": "St Joseph's Institution Independent",
  "lasalle college of the arts": "St Joseph's Institution Independent",
  "la salle college (bangkok)": "La Salle School Bangkok",
  "la salle chanthaburi (mandapitak) school (chanthaburi)": "La Salle School Chanthaburi",
  "hakodate la salle high school (hakodate)": "Hakodate La Salle Gakuen",
  "la salle high school (kagoshima)": "La Salle Gakuen",
  "de la salle academy (yangon)": "De La Salle Academy",
};

// Backwards-compatible alias so existing imports still work.
export type SchoolOption = { name: string; country: string };
