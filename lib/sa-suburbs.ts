// Client-safe South Australian suburb dataset for the booking autocomplete.
// Metro suburbs sit inside the standard service zone (travel included). Regional
// towns are quoted with a custom travel component. No dollar figures here.

export const SUBURB_REGIONS = {
  metro: {
    label: "Metro Adelaide (Standard Included)",
    short: "Metro",
    reassurance: "Metro Adelaide Service Zone - Travel Included",
  },
  regional: {
    label: "Regional SA (Custom Travel)",
    short: "Regional",
    reassurance: "Regional SA - Custom travel quoted in your proposal",
  },
} as const;

export type SuburbRegion = keyof typeof SUBURB_REGIONS;

export type Suburb = {
  name: string;
  postcode: string;
  region: SuburbRegion;
};

const metro = (name: string, postcode: string): Suburb => ({ name, postcode, region: "metro" });
const regional = (name: string, postcode: string): Suburb => ({ name, postcode, region: "regional" });

export const SA_SUBURBS: readonly Suburb[] = [
  // Metro Adelaide
  metro("Adelaide CBD", "5000"),
  metro("North Adelaide", "5006"),
  metro("Bowden", "5007"),
  metro("Brompton", "5007"),
  metro("Hindmarsh", "5007"),
  metro("Thebarton", "5031"),
  metro("Mile End", "5031"),
  metro("Kent Town", "5067"),
  metro("Norwood", "5067"),
  metro("Kensington", "5068"),
  metro("St Peters", "5069"),
  metro("College Park", "5069"),
  metro("Stepney", "5069"),
  metro("Burnside", "5066"),
  metro("Rose Park", "5067"),
  metro("Toorak Gardens", "5065"),
  metro("Glen Osmond", "5064"),
  metro("Parkside", "5063"),
  metro("Eastwood", "5063"),
  metro("Unley", "5061"),
  metro("Hyde Park", "5061"),
  metro("Malvern", "5061"),
  metro("Goodwood", "5034"),
  metro("Wayville", "5034"),
  metro("Mitcham", "5062"),
  metro("Kingswood", "5062"),
  metro("Prospect", "5082"),
  metro("Walkerville", "5081"),
  metro("Medindie", "5081"),
  metro("Enfield", "5085"),
  metro("Mawson Lakes", "5095"),
  metro("Salisbury", "5108"),
  metro("Elizabeth", "5112"),
  metro("Modbury", "5092"),
  metro("Tea Tree Gully", "5091"),
  metro("Golden Grove", "5125"),
  metro("Magill", "5072"),
  metro("Campbelltown", "5074"),
  metro("Payneham", "5070"),
  metro("Glenelg", "5045"),
  metro("Glenelg North", "5045"),
  metro("Glenelg South", "5045"),
  metro("Brighton", "5048"),
  metro("Hove", "5048"),
  metro("Seacliff", "5049"),
  metro("Marion", "5043"),
  metro("Edwardstown", "5039"),
  metro("Plympton", "5038"),
  metro("West Beach", "5024"),
  metro("Henley Beach", "5022"),
  metro("Grange", "5022"),
  metro("Semaphore", "5019"),
  metro("Port Adelaide", "5015"),
  metro("Woodville", "5011"),
  metro("Findon", "5023"),
  metro("Torrensville", "5031"),
  metro("Adelaide Airport", "5950"),
  metro("Hallett Cove", "5158"),
  metro("Morphett Vale", "5162"),
  metro("Noarlunga Centre", "5168"),
  metro("Christies Beach", "5165"),
  metro("Aldinga Beach", "5173"),
  metro("Belair", "5052"),
  metro("Blackwood", "5051"),

  // Regional SA
  regional("Stirling", "5152"),
  regional("Crafers", "5152"),
  regional("Aldgate", "5154"),
  regional("Bridgewater", "5155"),
  regional("Hahndorf", "5245"),
  regional("Mount Barker", "5251"),
  regional("Woodside", "5244"),
  regional("Lobethal", "5241"),
  regional("Birdwood", "5234"),
  regional("Gumeracha", "5233"),
  regional("Barossa", "5352"),
  regional("Tanunda", "5352"),
  regional("Nuriootpa", "5355"),
  regional("Angaston", "5353"),
  regional("Lyndoch", "5351"),
  regional("Gawler", "5118"),
  regional("Eden Valley", "5235"),
  regional("Clare", "5453"),
  regional("Auburn", "5451"),
  regional("McLaren Vale", "5171"),
  regional("Willunga", "5172"),
  regional("McLaren Flat", "5171"),
  regional("Sellicks Beach", "5174"),
  regional("Victor Harbor", "5211"),
  regional("Port Elliot", "5212"),
  regional("Goolwa", "5214"),
  regional("Normanville", "5204"),
  regional("Second Valley", "5204"),
  regional("Murray Bridge", "5253"),
  regional("Strathalbyn", "5255"),
  regional("Langhorne Creek", "5255"),
  regional("Kangaroo Island", "5223"),
  regional("Port Lincoln", "5606"),
  regional("Whyalla", "5600"),
  regional("Port Augusta", "5700"),
  regional("Port Pirie", "5540"),
  regional("Mount Gambier", "5290"),
  regional("Coonawarra", "5263"),
  regional("Robe", "5276"),
  regional("Renmark", "5341"),
  regional("Berri", "5343"),
  regional("Moonta", "5558"),
  regional("Wallaroo", "5556"),
];

// Stable key for a suburb (several suburbs share a postcode).
export const suburbKey = (s: Suburb) => `${s.name}|${s.postcode}`;

export function findSuburb(name: string, postcode: string): Suburb | undefined {
  return SA_SUBURBS.find((s) => s.name === name && s.postcode === postcode);
}

// Prefix matches on the name rank first, then word-start matches, then postcode matches.
export function searchSuburbs(query: string, limit = 8): Suburb[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored: { suburb: Suburb; score: number }[] = [];
  for (const suburb of SA_SUBURBS) {
    const name = suburb.name.toLowerCase();
    let score = -1;
    if (name.startsWith(q)) score = 0;
    else if (name.split(/\s+/).some((w) => w.startsWith(q))) score = 1;
    else if (suburb.postcode.startsWith(q)) score = 2;
    else if (name.includes(q)) score = 3;
    if (score >= 0) scored.push({ suburb, score });
  }
  return scored
    .sort((a, b) => a.score - b.score || a.suburb.name.localeCompare(b.suburb.name))
    .slice(0, limit)
    .map((s) => s.suburb);
}
