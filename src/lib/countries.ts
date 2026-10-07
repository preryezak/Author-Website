/**
 * Dialling codes for the optional phone field on the study sign-up.
 * [ISO 3166-1 alpha-2, name, dial code without "+"]. East Africa first, then the rest of Africa,
 * then the world, so the people this site mostly serves are quickest to reach.
 */
export type Country = { iso: string; name: string; dial: string };

const RAW: [string, string, string][] = [
  ["UG", "Uganda", "256"], ["KE", "Kenya", "254"], ["TZ", "Tanzania", "255"], ["RW", "Rwanda", "250"], ["BI", "Burundi", "257"], ["SS", "South Sudan", "211"], ["ET", "Ethiopia", "251"],
  ["NG", "Nigeria", "234"], ["GH", "Ghana", "233"], ["ZA", "South Africa", "27"], ["ZM", "Zambia", "260"], ["ZW", "Zimbabwe", "263"], ["MW", "Malawi", "265"], ["MZ", "Mozambique", "258"],
  ["BW", "Botswana", "267"], ["NA", "Namibia", "264"], ["LS", "Lesotho", "266"], ["SZ", "Eswatini", "268"], ["AO", "Angola", "244"], ["CD", "DR Congo", "243"], ["CG", "Congo", "242"],
  ["CM", "Cameroon", "237"], ["GA", "Gabon", "241"], ["GQ", "Equatorial Guinea", "240"], ["CF", "Central African Republic", "236"], ["TD", "Chad", "235"], ["SD", "Sudan", "249"], ["SO", "Somalia", "252"],
  ["DJ", "Djibouti", "253"], ["ER", "Eritrea", "291"], ["EG", "Egypt", "20"], ["LY", "Libya", "218"], ["TN", "Tunisia", "216"], ["DZ", "Algeria", "213"], ["MA", "Morocco", "212"],
  ["SN", "Senegal", "221"], ["CI", "Côte d'Ivoire", "225"], ["ML", "Mali", "223"], ["BF", "Burkina Faso", "226"], ["NE", "Niger", "227"], ["TG", "Togo", "228"], ["BJ", "Benin", "229"],
  ["SL", "Sierra Leone", "232"], ["LR", "Liberia", "231"], ["GN", "Guinea", "224"], ["GM", "Gambia", "220"], ["GW", "Guinea-Bissau", "245"], ["CV", "Cape Verde", "238"], ["MR", "Mauritania", "222"],
  ["MG", "Madagascar", "261"], ["MU", "Mauritius", "230"], ["SC", "Seychelles", "248"], ["KM", "Comoros", "269"], ["ST", "São Tomé and Príncipe", "239"],
  ["GB", "United Kingdom", "44"], ["US", "United States", "1"], ["CA", "Canada", "1"], ["AU", "Australia", "61"], ["NZ", "New Zealand", "64"], ["IE", "Ireland", "353"],
  ["DE", "Germany", "49"], ["FR", "France", "33"], ["NL", "Netherlands", "31"], ["BE", "Belgium", "32"], ["CH", "Switzerland", "41"], ["AT", "Austria", "43"], ["SE", "Sweden", "46"], ["NO", "Norway", "47"],
  ["DK", "Denmark", "45"], ["FI", "Finland", "358"], ["IS", "Iceland", "354"], ["ES", "Spain", "34"], ["PT", "Portugal", "351"], ["IT", "Italy", "39"], ["GR", "Greece", "30"], ["PL", "Poland", "48"],
  ["CZ", "Czechia", "420"], ["HU", "Hungary", "36"], ["RO", "Romania", "40"], ["BG", "Bulgaria", "359"], ["UA", "Ukraine", "380"], ["RU", "Russia", "7"], ["TR", "Türkiye", "90"],
  ["AE", "United Arab Emirates", "971"], ["SA", "Saudi Arabia", "966"], ["QA", "Qatar", "974"], ["KW", "Kuwait", "965"], ["BH", "Bahrain", "973"], ["OM", "Oman", "968"], ["JO", "Jordan", "962"],
  ["IL", "Israel", "972"], ["LB", "Lebanon", "961"], ["IQ", "Iraq", "964"], ["IR", "Iran", "98"], ["PK", "Pakistan", "92"], ["IN", "India", "91"], ["BD", "Bangladesh", "880"], ["LK", "Sri Lanka", "94"],
  ["NP", "Nepal", "977"], ["CN", "China", "86"], ["HK", "Hong Kong", "852"], ["TW", "Taiwan", "886"], ["JP", "Japan", "81"], ["KR", "South Korea", "82"], ["SG", "Singapore", "65"], ["MY", "Malaysia", "60"],
  ["TH", "Thailand", "66"], ["VN", "Vietnam", "84"], ["PH", "Philippines", "63"], ["ID", "Indonesia", "62"],
  ["BR", "Brazil", "55"], ["AR", "Argentina", "54"], ["CL", "Chile", "56"], ["CO", "Colombia", "57"], ["PE", "Peru", "51"], ["MX", "Mexico", "52"], ["JM", "Jamaica", "1876"], ["TT", "Trinidad and Tobago", "1868"],
  ["BS", "Bahamas", "1242"], ["BB", "Barbados", "1246"], ["HT", "Haiti", "509"], ["DO", "Dominican Republic", "1809"], ["PR", "Puerto Rico", "1787"], ["PG", "Papua New Guinea", "675"], ["FJ", "Fiji", "679"],
];

export const COUNTRIES: Country[] = RAW.map(([iso, name, dial]) => ({ iso, name, dial }));

export const dialFor = (iso: string): string => COUNTRIES.find((c) => c.iso === iso.toUpperCase())?.dial ?? "";
