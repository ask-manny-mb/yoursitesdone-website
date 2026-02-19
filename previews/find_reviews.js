const http = require('http');
const WebSocket = require('ws');

const businesses = [
  { file: 'adolfo-topete-auto-repair.html', name: 'Adolfo Topete Auto Repair', loc: 'Inglewood, CA' },
  { file: 'affordable-electrical-pros-of-torrance.html', name: 'Affordable Electrical Pros of Torrance', loc: 'Torrance, CA' },
  { file: 'aj-towing.html', name: 'A J Towing', loc: 'Torrance, CA' },
  { file: 'anna-ray-cleaning.html', name: 'Anna Ray Cleaning', loc: 'Hawthorne, CA' },
  { file: 'anytime-leyva-towing-llc.html', name: 'Anytime Leyva Towing', loc: 'Gardena, CA' },
  { file: 'bassam-auto-towing.html', name: 'Bassam Auto Towing', loc: 'Torrance, CA' },
  { file: 'best-house-painter-redondo-beach.html', name: 'Best House Painter Redondo Beach', loc: 'Redondo Beach, CA' },
  { file: 'coastal-electrical-services.html', name: 'Coastal Electrical Services', loc: 'Torrance, CA' },
  { file: 'electrician-redondo-beach.html', name: 'Electrician Redondo Beach', loc: 'Redondo Beach, CA' },
  { file: 'fence-doctors.html', name: 'Fence Doctors', loc: 'Torrance, CA' },
  { file: 'hady-cleaning-llc.html', name: 'HADY CLEANING', loc: 'San Pedro, CA' },
  { file: 'hawthorne-auto-services.html', name: 'Hawthorne Auto Services', loc: 'Hawthorne, CA' },
  { file: 'hda-handyman-service.html', name: 'HDA Handyman Service', loc: 'Carson, CA' },
  { file: 'hectors-carpet-cleaners-torrance.html', name: 'Hectors Carpet Cleaners', loc: 'Torrance, CA' },
  { file: 'hermosa-beach-painting-solutions.html', name: 'Hermosa Beach Painting Solutions', loc: 'Hermosa Beach, CA' },
  { file: 'hermosa-beach-plumbing-heating-ac.html', name: 'Hermosa Beach Plumbing Heating', loc: 'Hermosa Beach, CA' },
  { file: 'hermosa-lock-and-safe-shop.html', name: 'Hermosa Lock and Safe Shop', loc: 'Hermosa Beach, CA' },
  { file: 'hm-carpet-care.html', name: 'HM Carpet Care', loc: 'Gardena, CA' },
  { file: 'jordan-locksmith-hermosa-beach.html', name: 'Jordan Locksmith', loc: 'Hermosa Beach, CA' },
  { file: 'junk-junkies.html', name: 'Junk Junkies', loc: 'Lomita, CA' },
  { file: 'kikes-auto-repair.html', name: 'Kikes Auto Repair', loc: 'Hawthorne, CA' },
  { file: 'long-beach-plumbing-experts.html', name: 'Long Beach Plumbing Experts', loc: 'Long Beach, CA' },
  { file: 'mannon-handyman-service.html', name: 'Mannon Handyman Service', loc: 'Torrance, CA' },
  { file: 'mardikian-automotive-center.html', name: 'Mardikian Automotive Center', loc: 'Redondo Beach, CA' },
  { file: 'ohana-pressure-washing.html', name: 'Ohana Pressure Washing', loc: 'Hawthorne, CA' },
  { file: 'pacific-coast-construction.html', name: 'Pacific Coast Construction', loc: 'Lawndale, CA' },
  { file: 'pacific-coast-plumbing-co.html', name: 'Pacific Coast Plumbing', loc: 'Hermosa Beach, CA' },
  { file: 'page-construction-lic-no788590.html', name: 'Page Construction', loc: 'Redondo Beach, CA' },
  { file: 'pcc-flooring.html', name: 'PCC Flooring', loc: 'Torrance, CA' },
  { file: 'piers-painters.html', name: 'Piers Painters', loc: 'Hermosa Beach, CA' },
  { file: 'precise-service.html', name: 'Precise Service', loc: 'Torrance, CA' },
  { file: 's-p-beagle-plumbing-inc.html', name: 'S P Beagle Plumbing', loc: 'Hermosa Beach, CA' },
  { file: 'safe-view-electric-experts.html', name: 'Safe View Electric', loc: 'San Pedro, CA' },
  { file: 'south-bay-handyman-repair.html', name: 'South Bay Handyman Repair', loc: 'Redondo Beach, CA' },
  { file: 'stay-clean-housekeeping.html', name: 'Stay Clean Housekeeping', loc: 'Long Beach, CA' },
  { file: 't-and-d-auto-center.html', name: 'T and D Auto Center', loc: 'Hawthorne, CA' },
  { file: 'the-auto-shop.html', name: 'The Auto Shop', loc: 'Hawthorne, CA' },
  { file: 'the-canadian-plumber.html', name: 'The Canadian Plumber', loc: 'Hermosa Beach, CA' },
  { file: 'tomoike-landscaping-irrigation.html', name: 'Tomoike Landscaping', loc: 'Torrance, CA' },
  { file: 'torrance-roofing.html', name: 'Torrance Roofing', loc: 'Torrance, CA' },
  { file: 'udh-auto-repair-and-alignment.html', name: 'UDH Auto Repair', loc: 'Hawthorne, CA' },
];

// Output the search URLs for processing
businesses.forEach(b => {
  const q = encodeURIComponent(b.name);
  const loc = encodeURIComponent(b.loc);
  console.log(`${b.file}|https://www.yelp.com/search?find_desc=${q}&find_loc=${loc}`);
});
