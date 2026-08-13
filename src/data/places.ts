// Major cities and places shown when a LEAD sector is zoomed in on the
// community map. Coordinates in decimal degrees (lng, lat). Keep the list
// short per country so labels don't crowd the zoomed view.

export type PlaceKind = "capital" | "city" | "island" | "region";
export type LabelPos = "right" | "left" | "top" | "bottom";

export type Place = {
  name: string;
  lng: number;
  lat: number;
  kind?: PlaceKind;
  // Where the text label sits relative to the dot. Defaults to "right".
  // Set explicitly to avoid overlap when two places project close together.
  labelPos?: LabelPos;
};

export const PLACES_BY_COUNTRY: Record<string, Place[]> = {
  Japan: [
    { name: "Tokyo",     lng: 139.6503, lat: 35.6762, kind: "capital" },
    { name: "Kyoto",     lng: 135.7681, lat: 35.0116, labelPos: "top" },
    { name: "Osaka",     lng: 135.5023, lat: 34.6937, labelPos: "bottom" },
    { name: "Sapporo",   lng: 141.3545, lat: 43.0618 },
    { name: "Fukuoka",   lng: 130.4017, lat: 33.5904, labelPos: "left" },
    { name: "Hiroshima", lng: 132.4553, lat: 34.3853, labelPos: "top" },
    { name: "Naha",      lng: 127.6809, lat: 26.2124 },
  ],
  "Hong Kong": [
    { name: "Central",          lng: 114.158, lat: 22.284, kind: "city",   labelPos: "bottom" },
    { name: "Kowloon",          lng: 114.187, lat: 22.320, labelPos: "right" },
    { name: "New Territories",  lng: 114.150, lat: 22.450, kind: "region", labelPos: "top" },
    { name: "Lantau",           lng: 113.950, lat: 22.260, kind: "island", labelPos: "left" },
  ],
  Myanmar: [
    { name: "Yangon",     lng: 96.1951,  lat: 16.8409, kind: "city",    labelPos: "bottom" },
    { name: "Naypyidaw",  lng: 96.0785,  lat: 19.7633, kind: "capital", labelPos: "right" },
    { name: "Mandalay",   lng: 96.0836,  lat: 21.9588, labelPos: "right" },
    { name: "Bagan",      lng: 94.8606,  lat: 21.1717, labelPos: "left" },
    { name: "Bago",       lng: 96.4667,  lat: 17.3350, labelPos: "top" },
  ],
  Thailand: [
    { name: "Bangkok",           lng: 100.5018, lat: 13.7563, kind: "capital", labelPos: "left" },
    { name: "Chiang Mai",        lng: 98.9853,  lat: 18.7883 },
    { name: "Phuket",            lng: 98.3923,  lat: 7.8804,  labelPos: "left" },
    { name: "Pattaya",           lng: 100.8827, lat: 12.9236, labelPos: "right" },
    { name: "Nakhon Ratchasima", lng: 102.0977, lat: 14.9799, labelPos: "right" },
    { name: "Hat Yai",           lng: 100.4700, lat: 7.0086,  labelPos: "right" },
  ],
  Philippines: [
    { name: "Manila",           lng: 120.9842, lat: 14.5995, kind: "capital", labelPos: "left" },
    { name: "Cebu",             lng: 123.8854, lat: 10.3157, labelPos: "right" },
    { name: "Davao",            lng: 125.4553, lat: 7.1907 },
    { name: "Baguio",           lng: 120.5960, lat: 16.4023, labelPos: "left" },
    { name: "Iloilo",           lng: 122.5644, lat: 10.7202, labelPos: "left" },
    { name: "Cagayan de Oro",   lng: 124.6319, lat: 8.4542,  labelPos: "right" },
    { name: "Zamboanga",        lng: 122.0790, lat: 6.9214,  labelPos: "left" },
  ],
  Malaysia: [
    { name: "Kuala Lumpur",  lng: 101.6869, lat: 3.1390,  kind: "capital", labelPos: "left" },
    { name: "George Town",   lng: 100.3288, lat: 5.4141,  labelPos: "left" },
    { name: "Johor Bahru",   lng: 103.7414, lat: 1.4927,  labelPos: "right" },
    { name: "Ipoh",          lng: 101.0829, lat: 4.5975,  labelPos: "right" },
    { name: "Kota Kinabalu", lng: 116.0724, lat: 5.9804 },
    { name: "Kuching",       lng: 110.3556, lat: 1.5533,  labelPos: "bottom" },
  ],
  Singapore: [
    { name: "Central",     lng: 103.8500, lat: 1.2870, kind: "city", labelPos: "bottom" },
    { name: "Jurong",      lng: 103.7060, lat: 1.3400, labelPos: "left" },
    { name: "Changi",      lng: 103.9840, lat: 1.3644, labelPos: "right" },
    { name: "Woodlands",   lng: 103.7860, lat: 1.4370, labelPos: "top" },
  ],
};
