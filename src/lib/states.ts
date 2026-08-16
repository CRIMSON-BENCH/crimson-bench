export interface StateData {
  name: string
  slug: string
  abbr: string
  capital: string
  majorCity: string
  population: string
  businessHubs: string[]
}

export const STATES: StateData[] = [
  { name: 'Alabama', slug: 'alabama', abbr: 'AL', capital: 'Montgomery', majorCity: 'Birmingham', population: '5.1M', businessHubs: ['Birmingham', 'Huntsville', 'Mobile'] },
  { name: 'Alaska', slug: 'alaska', abbr: 'AK', capital: 'Juneau', majorCity: 'Anchorage', population: '733K', businessHubs: ['Anchorage', 'Fairbanks', 'Juneau'] },
  { name: 'Arizona', slug: 'arizona', abbr: 'AZ', capital: 'Phoenix', majorCity: 'Phoenix', population: '7.4M', businessHubs: ['Phoenix', 'Scottsdale', 'Tempe', 'Mesa', 'Chandler', 'Tucson'] },
  { name: 'Arkansas', slug: 'arkansas', abbr: 'AR', capital: 'Little Rock', majorCity: 'Little Rock', population: '3.1M', businessHubs: ['Little Rock', 'Fayetteville', 'Fort Smith'] },
  { name: 'California', slug: 'california', abbr: 'CA', capital: 'Sacramento', majorCity: 'Los Angeles', population: '39.0M', businessHubs: ['Los Angeles', 'San Francisco', 'San Jose', 'San Diego', 'Sacramento', 'Oakland', 'Palo Alto', 'Santa Monica', 'Irvine'] },
  { name: 'Colorado', slug: 'colorado', abbr: 'CO', capital: 'Denver', majorCity: 'Denver', population: '5.8M', businessHubs: ['Denver', 'Boulder', 'Colorado Springs', 'Aurora', 'Fort Collins'] },
  { name: 'Connecticut', slug: 'connecticut', abbr: 'CT', capital: 'Hartford', majorCity: 'Bridgeport', population: '3.6M', businessHubs: ['Hartford', 'Stamford', 'Bridgeport', 'New Haven', 'Greenwich'] },
  { name: 'Delaware', slug: 'delaware', abbr: 'DE', capital: 'Dover', majorCity: 'Wilmington', population: '1.0M', businessHubs: ['Wilmington', 'Dover', 'Newark'] },
  { name: 'Florida', slug: 'florida', abbr: 'FL', capital: 'Tallahassee', majorCity: 'Miami', population: '22.6M', businessHubs: ['Miami', 'Tampa', 'Orlando', 'Jacksonville', 'Fort Lauderdale', 'Boca Raton', 'Naples', 'West Palm Beach', 'Sarasota'] },
  { name: 'Georgia', slug: 'georgia', abbr: 'GA', capital: 'Atlanta', majorCity: 'Atlanta', population: '10.9M', businessHubs: ['Atlanta', 'Savannah', 'Augusta', 'Columbus', 'Sandy Springs', 'Alpharetta'] },
  { name: 'Hawaii', slug: 'hawaii', abbr: 'HI', capital: 'Honolulu', majorCity: 'Honolulu', population: '1.4M', businessHubs: ['Honolulu', 'Hilo', 'Kailua'] },
  { name: 'Idaho', slug: 'idaho', abbr: 'ID', capital: 'Boise', majorCity: 'Boise', population: '1.9M', businessHubs: ['Boise', 'Nampa', 'Meridian', 'Idaho Falls'] },
  { name: 'Illinois', slug: 'illinois', abbr: 'IL', capital: 'Springfield', majorCity: 'Chicago', population: '12.5M', businessHubs: ['Chicago', 'Naperville', 'Schaumburg', 'Evanston', 'Oak Brook', 'Peoria', 'Rockford'] },
  { name: 'Indiana', slug: 'indiana', abbr: 'IN', capital: 'Indianapolis', majorCity: 'Indianapolis', population: '6.8M', businessHubs: ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel'] },
  { name: 'Iowa', slug: 'iowa', abbr: 'IA', capital: 'Des Moines', majorCity: 'Des Moines', population: '3.2M', businessHubs: ['Des Moines', 'Cedar Rapids', 'Davenport', 'Iowa City'] },
  { name: 'Kansas', slug: 'kansas', abbr: 'KS', capital: 'Topeka', majorCity: 'Wichita', population: '2.9M', businessHubs: ['Wichita', 'Overland Park', 'Kansas City', 'Topeka', 'Olathe'] },
  { name: 'Kentucky', slug: 'kentucky', abbr: 'KY', capital: 'Frankfort', majorCity: 'Louisville', population: '4.5M', businessHubs: ['Louisville', 'Lexington', 'Covington', 'Bowling Green'] },
  { name: 'Louisiana', slug: 'louisiana', abbr: 'LA', capital: 'Baton Rouge', majorCity: 'New Orleans', population: '4.6M', businessHubs: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette'] },
  { name: 'Maine', slug: 'maine', abbr: 'ME', capital: 'Augusta', majorCity: 'Portland', population: '1.4M', businessHubs: ['Portland', 'Augusta', 'Bangor', 'South Portland'] },
  { name: 'Maryland', slug: 'maryland', abbr: 'MD', capital: 'Annapolis', majorCity: 'Baltimore', population: '6.2M', businessHubs: ['Baltimore', 'Rockville', 'Bethesda', 'Gaithersburg', 'Annapolis', 'Silver Spring'] },
  { name: 'Massachusetts', slug: 'massachusetts', abbr: 'MA', capital: 'Boston', majorCity: 'Boston', population: '7.0M', businessHubs: ['Boston', 'Cambridge', 'Worcester', 'Springfield', 'Waltham', 'Burlington', 'Framingham'] },
  { name: 'Michigan', slug: 'michigan', abbr: 'MI', capital: 'Lansing', majorCity: 'Detroit', population: '10.1M', businessHubs: ['Detroit', 'Grand Rapids', 'Ann Arbor', 'Lansing', 'Troy', 'Sterling Heights', 'Dearborn'] },
  { name: 'Minnesota', slug: 'minnesota', abbr: 'MN', capital: 'Saint Paul', majorCity: 'Minneapolis', population: '5.7M', businessHubs: ['Minneapolis', 'Saint Paul', 'Bloomington', 'Rochester', 'Eden Prairie', 'Plymouth'] },
  { name: 'Mississippi', slug: 'mississippi', abbr: 'MS', capital: 'Jackson', majorCity: 'Jackson', population: '2.9M', businessHubs: ['Jackson', 'Gulfport', 'Southaven', 'Hattiesburg'] },
  { name: 'Missouri', slug: 'missouri', abbr: 'MO', capital: 'Jefferson City', majorCity: 'Kansas City', population: '6.2M', businessHubs: ['Kansas City', 'St. Louis', 'Springfield', 'Columbia', "Lee's Summit"] },
  { name: 'Montana', slug: 'montana', abbr: 'MT', capital: 'Helena', majorCity: 'Billings', population: '1.1M', businessHubs: ['Billings', 'Missoula', 'Great Falls', 'Bozeman'] },
  { name: 'Nebraska', slug: 'nebraska', abbr: 'NE', capital: 'Lincoln', majorCity: 'Omaha', population: '2.0M', businessHubs: ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island'] },
  { name: 'Nevada', slug: 'nevada', abbr: 'NV', capital: 'Carson City', majorCity: 'Las Vegas', population: '3.2M', businessHubs: ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks'] },
  { name: 'New Hampshire', slug: 'new-hampshire', abbr: 'NH', capital: 'Concord', majorCity: 'Manchester', population: '1.4M', businessHubs: ['Manchester', 'Nashua', 'Concord', 'Portsmouth'] },
  { name: 'New Jersey', slug: 'new-jersey', abbr: 'NJ', capital: 'Trenton', majorCity: 'Newark', population: '9.3M', businessHubs: ['Newark', 'Jersey City', 'Hoboken', 'Trenton', 'Princeton', 'Parsippany', 'Edison', 'Short Hills'] },
  { name: 'New Mexico', slug: 'new-mexico', abbr: 'NM', capital: 'Santa Fe', majorCity: 'Albuquerque', population: '2.1M', businessHubs: ['Albuquerque', 'Santa Fe', 'Las Cruces', 'Rio Rancho'] },
  { name: 'New York', slug: 'new-york', abbr: 'NY', capital: 'Albany', majorCity: 'New York City', population: '19.5M', businessHubs: ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse', 'White Plains', 'Melville', 'Garden City'] },
  { name: 'North Carolina', slug: 'north-carolina', abbr: 'NC', capital: 'Raleigh', majorCity: 'Charlotte', population: '10.7M', businessHubs: ['Charlotte', 'Raleigh', 'Durham', 'Greensboro', 'Winston-Salem', 'Cary', 'Chapel Hill', 'Research Triangle Park'] },
  { name: 'North Dakota', slug: 'north-dakota', abbr: 'ND', capital: 'Bismarck', majorCity: 'Fargo', population: '779K', businessHubs: ['Fargo', 'Bismarck', 'Grand Forks', 'Minot'] },
  { name: 'Ohio', slug: 'ohio', abbr: 'OH', capital: 'Columbus', majorCity: 'Columbus', population: '11.8M', businessHubs: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Westlake', 'Dublin'] },
  { name: 'Oklahoma', slug: 'oklahoma', abbr: 'OK', capital: 'Oklahoma City', majorCity: 'Oklahoma City', population: '4.0M', businessHubs: ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Edmond'] },
  { name: 'Oregon', slug: 'oregon', abbr: 'OR', capital: 'Salem', majorCity: 'Portland', population: '4.2M', businessHubs: ['Portland', 'Salem', 'Eugene', 'Beaverton', 'Hillsboro', 'Bend'] },
  { name: 'Pennsylvania', slug: 'pennsylvania', abbr: 'PA', capital: 'Harrisburg', majorCity: 'Philadelphia', population: '12.9M', businessHubs: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Harrisburg', 'Lancaster', 'King of Prussia', 'Wayne', 'Malvern'] },
  { name: 'Rhode Island', slug: 'rhode-island', abbr: 'RI', capital: 'Providence', majorCity: 'Providence', population: '1.1M', businessHubs: ['Providence', 'Warwick', 'Cranston', 'Pawtucket'] },
  { name: 'South Carolina', slug: 'south-carolina', abbr: 'SC', capital: 'Columbia', majorCity: 'Charleston', population: '5.3M', businessHubs: ['Charleston', 'Columbia', 'Greenville', 'Spartanburg', 'Myrtle Beach'] },
  { name: 'South Dakota', slug: 'south-dakota', abbr: 'SD', capital: 'Pierre', majorCity: 'Sioux Falls', population: '909K', businessHubs: ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Pierre'] },
  { name: 'Tennessee', slug: 'tennessee', abbr: 'TN', capital: 'Nashville', majorCity: 'Nashville', population: '7.1M', businessHubs: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Brentwood', 'Franklin'] },
  { name: 'Texas', slug: 'texas', abbr: 'TX', capital: 'Austin', majorCity: 'Houston', population: '30.0M', businessHubs: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'Plano', 'Irving', 'Frisco', 'McKinney', 'Arlington', 'Round Rock', 'The Woodlands'] },
  { name: 'Utah', slug: 'utah', abbr: 'UT', capital: 'Salt Lake City', majorCity: 'Salt Lake City', population: '3.4M', businessHubs: ['Salt Lake City', 'Provo', 'Ogden', 'St. George', 'Lehi', 'Sandy'] },
  { name: 'Vermont', slug: 'vermont', abbr: 'VT', capital: 'Montpelier', majorCity: 'Burlington', population: '647K', businessHubs: ['Burlington', 'Montpelier', 'South Burlington', 'Rutland'] },
  { name: 'Virginia', slug: 'virginia', abbr: 'VA', capital: 'Richmond', majorCity: 'Virginia Beach', population: '8.7M', businessHubs: ['Richmond', 'Virginia Beach', 'Arlington', 'McLean', 'Tysons', 'Reston', 'Norfolk', 'Alexandria', 'Fairfax'] },
  { name: 'Washington', slug: 'washington', abbr: 'WA', capital: 'Olympia', majorCity: 'Seattle', population: '7.8M', businessHubs: ['Seattle', 'Bellevue', 'Redmond', 'Kirkland', 'Spokane', 'Tacoma', 'Renton', 'Bothell'] },
  { name: 'West Virginia', slug: 'west-virginia', abbr: 'WV', capital: 'Charleston', majorCity: 'Charleston', population: '1.7M', businessHubs: ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg'] },
  { name: 'Wisconsin', slug: 'wisconsin', abbr: 'WI', capital: 'Madison', majorCity: 'Milwaukee', population: '5.9M', businessHubs: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Waukesha'] },
  { name: 'Wyoming', slug: 'wyoming', abbr: 'WY', capital: 'Cheyenne', majorCity: 'Cheyenne', population: '581K', businessHubs: ['Cheyenne', 'Casper', 'Laramie', 'Gillette'] },
]

export function getStateBySlug(slug: string): StateData | undefined {
  return STATES.find(s => s.slug === slug)
}

export function getStateByAbbr(abbr: string): StateData | undefined {
  return STATES.find(s => s.abbr === abbr.toUpperCase())
}

export function getAllStateSlugs(): string[] {
  return STATES.map(s => s.slug)
}
