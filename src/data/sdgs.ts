// UN Sustainable Development Goals — edit labels here if wording changes.
// `color` is the UN's official brand color for each goal (used by the picker tile).

export const SDG_GOALS = [
  { key: "sdg1",  num: 1,  title: "No Poverty",                                color: "#E5243B", label: "SDG 1: No Poverty" },
  { key: "sdg2",  num: 2,  title: "Zero Hunger",                               color: "#DDA63A", label: "SDG 2: Zero Hunger" },
  { key: "sdg3",  num: 3,  title: "Good Health and Well-being",                color: "#4C9F38", label: "SDG 3: Good Health and Well-being" },
  { key: "sdg4",  num: 4,  title: "Quality Education",                         color: "#C5192D", label: "SDG 4: Quality Education" },
  { key: "sdg5",  num: 5,  title: "Gender Equality",                           color: "#FF3A21", label: "SDG 5: Gender Equality" },
  { key: "sdg6",  num: 6,  title: "Clean Water and Sanitation",                color: "#26BDE2", label: "SDG 6: Clean Water and Sanitation" },
  { key: "sdg7",  num: 7,  title: "Affordable and Clean Energy",               color: "#FCC30B", label: "SDG 7: Affordable and Clean Energy" },
  { key: "sdg8",  num: 8,  title: "Decent Work and Economic Growth",           color: "#A21942", label: "SDG 8: Decent Work and Economic Growth" },
  { key: "sdg9",  num: 9,  title: "Industry, Innovation and Infrastructure",   color: "#FD6925", label: "SDG 9: Industry, Innovation and Infrastructure" },
  { key: "sdg10", num: 10, title: "Reduced Inequalities",                      color: "#DD1367", label: "SDG 10: Reduced Inequalities" },
  { key: "sdg11", num: 11, title: "Sustainable Cities and Communities",        color: "#FD9D24", label: "SDG 11: Sustainable Cities and Communities" },
  { key: "sdg12", num: 12, title: "Responsible Consumption and Production",    color: "#BF8B2E", label: "SDG 12: Responsible Consumption and Production" },
  { key: "sdg13", num: 13, title: "Climate Action",                            color: "#3F7E44", label: "SDG 13: Climate Action" },
  { key: "sdg14", num: 14, title: "Life Below Water",                          color: "#0A97D9", label: "SDG 14: Life Below Water" },
  { key: "sdg15", num: 15, title: "Life on Land",                              color: "#56C02B", label: "SDG 15: Life on Land" },
  { key: "sdg16", num: 16, title: "Peace, Justice and Strong Institutions",    color: "#00689D", label: "SDG 16: Peace, Justice and Strong Institutions" },
  { key: "sdg17", num: 17, title: "Partnerships for the Goals",                color: "#19486A", label: "SDG 17: Partnerships for the Goals" },
] as const;

export const SDG_LABELS: Record<string, string> = Object.fromEntries(
  SDG_GOALS.map((g) => [g.key, g.label])
);
