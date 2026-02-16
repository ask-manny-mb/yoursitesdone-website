#!/usr/bin/env python3
"""Generate preview sites for top prospects from Notion database."""
import json, os, re, urllib.request

NOTION_API_KEY = os.environ.get("NOTION_API_KEY", "")
DB_ID = "3096b2ecc34a812d8f78dbf1c385c9a7"
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_PATH = os.path.join(SCRIPT_DIR, "template.html")
PREVIEWS_DIR = os.path.join(SCRIPT_DIR, "previews")

# Service data by business type
SERVICES_DATA = {
    "Plumber": [
        ("🔧", "Emergency Repairs", "24/7 emergency plumbing when you need it most"),
        ("🚿", "Drain Cleaning", "Professional drain clearing and maintenance"),
        ("🔥", "Water Heater Installation", "Tank and tankless water heater services"),
        ("🪠", "Pipe Repair & Replacement", "Expert pipe repair for any situation"),
        ("🚽", "Bathroom Remodeling", "Full bathroom renovation and upgrades"),
        ("💧", "Leak Detection", "Advanced leak detection and repair"),
    ],
    "Electrician": [
        ("⚡", "Electrical Repairs", "Fast, safe electrical repair services"),
        ("💡", "Lighting Installation", "Indoor and outdoor lighting solutions"),
        ("🔌", "Panel Upgrades", "Electrical panel upgrades and replacements"),
        ("🏠", "Whole-Home Rewiring", "Complete residential rewiring services"),
        ("🔋", "EV Charger Installation", "Electric vehicle charger setup"),
        ("🛡️", "Safety Inspections", "Comprehensive electrical safety inspections"),
    ],
    "Painter": [
        ("🏠", "Interior Painting", "Transform your rooms with expert interior painting"),
        ("🎨", "Exterior Painting", "Boost curb appeal with professional exterior work"),
        ("🪟", "Cabinet Refinishing", "Give your cabinets a brand new look"),
        ("🖌️", "Deck & Fence Staining", "Protect and beautify outdoor wood"),
        ("🏢", "Commercial Painting", "Professional commercial painting services"),
        ("✨", "Color Consultation", "Free expert color matching and consultation"),
    ],
    "Auto Repair": [
        ("🔧", "General Repair", "Complete auto repair for all makes and models"),
        ("🛞", "Brake Service", "Expert brake inspection, repair, and replacement"),
        ("🛢️", "Oil Changes", "Quick, affordable oil change services"),
        ("⚙️", "Engine Diagnostics", "Advanced computer diagnostics and repair"),
        ("❄️", "A/C Service", "Auto air conditioning repair and recharge"),
        ("🔩", "Transmission Service", "Transmission repair and maintenance"),
    ],
    "Locksmith": [
        ("🔑", "Emergency Lockout", "24/7 emergency lockout assistance"),
        ("🚗", "Auto Locksmith", "Car key replacement and programming"),
        ("🏠", "Residential Locks", "Home lock installation and rekeying"),
        ("🏢", "Commercial Security", "Business lock and access systems"),
        ("🔐", "Lock Rekeying", "Quick and affordable lock rekeying"),
        ("📱", "Smart Locks", "Smart lock installation and setup"),
    ],
    "Handyman": [
        ("🔨", "Home Repairs", "General home repair and maintenance"),
        ("🪚", "Carpentry", "Custom carpentry and woodwork"),
        ("🚿", "Plumbing Fixes", "Minor plumbing repairs and installation"),
        ("💡", "Electrical Work", "Light fixtures, outlets, and switches"),
        ("🏠", "Drywall Repair", "Drywall patching, repair, and finishing"),
        ("🪟", "Door & Window Repair", "Door and window installation and repair"),
    ],
    "Pressure Washing": [
        ("🏠", "House Washing", "Restore your home's exterior to like-new condition"),
        ("🚗", "Driveway Cleaning", "Remove stains and grime from driveways"),
        ("🪵", "Deck Cleaning", "Deep clean and restore wooden decks"),
        ("🏢", "Commercial Washing", "Professional commercial pressure washing"),
        ("🧱", "Concrete Cleaning", "Sidewalks, patios, and concrete surfaces"),
        ("🌿", "Fence Cleaning", "Clean and restore fences of all types"),
    ],
    "Carpet Cleaning": [
        ("🧹", "Deep Carpet Cleaning", "Professional deep steam cleaning"),
        ("🛋️", "Upholstery Cleaning", "Sofa, chair, and furniture cleaning"),
        ("💧", "Stain Removal", "Tough stain removal specialists"),
        ("🏠", "Whole-Home Cleaning", "Complete home carpet cleaning packages"),
        ("🏢", "Commercial Cleaning", "Office and commercial carpet care"),
        ("🐾", "Pet Stain Treatment", "Specialized pet stain and odor removal"),
    ],
    "Junk Removal": [
        ("🚚", "Full-Service Junk Removal", "We haul everything — you don't lift a finger"),
        ("🏠", "Estate Cleanouts", "Complete estate and home cleanout services"),
        ("🏢", "Commercial Cleanouts", "Office and business junk removal"),
        ("♻️", "Eco-Friendly Disposal", "Responsible recycling and donation"),
        ("🪵", "Yard Waste Removal", "Branches, debris, and yard cleanup"),
        ("🏗️", "Construction Debris", "Post-renovation cleanup and hauling"),
    ],
    "Fencing": [
        ("🏠", "Residential Fencing", "Beautiful fences for your home"),
        ("🪵", "Wood Fences", "Custom wood fence installation"),
        ("🔗", "Chain Link Fences", "Durable chain link fencing solutions"),
        ("🛡️", "Vinyl Fencing", "Low-maintenance vinyl fence installation"),
        ("🔧", "Fence Repair", "Fast, reliable fence repair services"),
        ("🚪", "Gates & Access", "Custom gate installation and automation"),
    ],
    "Towing": [
        ("🚗", "Emergency Towing", "24/7 fast-response towing services"),
        ("🔋", "Jump Starts", "Dead battery? We'll get you going"),
        ("🔧", "Roadside Assistance", "Flat tires, lockouts, and more"),
        ("🚚", "Long-Distance Towing", "Safe long-distance vehicle transport"),
        ("🏍️", "Motorcycle Towing", "Careful motorcycle and specialty towing"),
        ("🅿️", "Accident Recovery", "Professional accident scene recovery"),
    ],
    "Roofing": [
        ("🏠", "Roof Repair", "Fast, reliable roof leak repair"),
        ("🔨", "New Roof Installation", "Complete roof replacement services"),
        ("🔍", "Roof Inspections", "Thorough professional roof inspections"),
        ("🌊", "Gutter Services", "Gutter installation and repair"),
        ("☀️", "Solar-Ready Roofing", "Roofing prepared for solar installation"),
        ("🏢", "Commercial Roofing", "Commercial roof repair and installation"),
    ],
    "Cleaning Service": [
        ("🏠", "Residential Cleaning", "Professional home cleaning services"),
        ("✨", "Deep Cleaning", "Thorough deep cleaning for every room"),
        ("🏢", "Commercial Cleaning", "Office and business cleaning"),
        ("🚪", "Move-In/Move-Out", "Move-in and move-out cleaning packages"),
        ("🪟", "Window Cleaning", "Interior and exterior window cleaning"),
        ("📅", "Recurring Service", "Weekly, bi-weekly, and monthly plans"),
    ],
    "Flooring": [
        ("🪵", "Hardwood Flooring", "Installation, refinishing, and repair"),
        ("🏠", "Tile Installation", "Expert tile work for any room"),
        ("🧹", "Carpet Installation", "Professional carpet installation"),
        ("💎", "Luxury Vinyl Plank", "Beautiful, durable LVP flooring"),
        ("🔧", "Floor Repair", "Expert floor repair and restoration"),
        ("🏢", "Commercial Flooring", "Commercial flooring solutions"),
    ],
}

# Fallback for unknown types
DEFAULT_SERVICES = [
    ("⭐", "Professional Service", "Quality work you can count on"),
    ("🏠", "Residential", "Serving homeowners throughout the area"),
    ("🏢", "Commercial", "Commercial services for businesses"),
    ("🔧", "Repairs & Maintenance", "Expert repair and maintenance"),
    ("📞", "Emergency Service", "Available when you need us most"),
    ("💯", "Free Estimates", "Free, no-obligation estimates"),
]

COLOR_SCHEMES = {
    "Plumber": ("#2563eb", "#1d4ed8", "#dbeafe"),
    "Electrician": ("#f59e0b", "#d97706", "#fef3c7"),
    "Painter": ("#8b5cf6", "#7c3aed", "#ede9fe"),
    "Auto Repair": ("#dc2626", "#b91c1c", "#fee2e2"),
    "Locksmith": ("#059669", "#047857", "#d1fae5"),
    "Handyman": ("#ea580c", "#c2410c", "#ffedd5"),
    "Pressure Washing": ("#0891b2", "#0e7490", "#cffafe"),
    "Carpet Cleaning": ("#7c3aed", "#6d28d9", "#ede9fe"),
    "Junk Removal": ("#16a34a", "#15803d", "#dcfce7"),
    "Fencing": ("#92400e", "#78350f", "#fef3c7"),
    "Towing": ("#dc2626", "#b91c1c", "#fee2e2"),
    "Roofing": ("#1e40af", "#1e3a8a", "#dbeafe"),
    "Cleaning Service": ("#06b6d4", "#0891b2", "#cffafe"),
    "Flooring": ("#a16207", "#854d0e", "#fef9c3"),
}
DEFAULT_COLORS = ("#2563eb", "#1d4ed8", "#dbeafe")

TAGLINES = {
    "Plumber": "Your Trusted Local Plumber — Reliable Service, Fair Prices",
    "Electrician": "Licensed Electricians You Can Trust — Safety First, Always",
    "Painter": "Transform Your Space — Expert Painting, Stunning Results",
    "Auto Repair": "Honest Auto Repair — Keeping You on the Road",
    "Locksmith": "Locked Out? We're On Our Way — Fast, Reliable Locksmith",
    "Handyman": "No Job Too Small — Your Neighborhood Handyman",
    "Pressure Washing": "Restore Your Property's Beauty — Professional Pressure Washing",
    "Carpet Cleaning": "Deep Clean, Fresh Start — Professional Carpet Care",
    "Junk Removal": "Clutter Gone, Stress Gone — Fast & Eco-Friendly Junk Removal",
    "Fencing": "Beautiful Fences, Built to Last — Free Estimates",
    "Towing": "Stuck? We'll Be There — 24/7 Fast Towing Service",
    "Roofing": "Protecting What Matters Most — Expert Roofing Services",
    "Cleaning Service": "Spotless Results Every Time — Professional Cleaning You'll Love",
    "Flooring": "Beautiful Floors, Expert Installation — Transform Your Home",
}

# Fake but realistic review templates
REVIEW_TEMPLATES = {
    "Plumber": [
        ("Great service! They fixed our leaky faucet the same day we called. Very professional and fair pricing.", "Mike R."),
        ("Had an emergency pipe burst at midnight. They came out right away and saved us from major water damage. Highly recommend!", "Sarah L."),
        ("Best plumber in the area. Honest pricing and quality work. They've been our go-to for 3 years now.", "David K."),
    ],
    "Electrician": [
        ("Installed new lighting throughout our home. The work was clean, professional, and done on time. Great price too!", "Jennifer M."),
        ("Had a panel upgrade done — they were knowledgeable, fast, and left everything spotless. Will definitely call again.", "Robert T."),
        ("Fixed a tricky wiring issue that two other electricians couldn't figure out. These guys know their stuff!", "Amanda S."),
    ],
    "Painter": [
        ("They painted our entire interior and it looks absolutely stunning. Professional crew, clean work, and finished ahead of schedule!", "Lisa M."),
        ("Great attention to detail. They even helped us pick the perfect colors. Our house looks brand new!", "James W."),
        ("Used them for our exterior painting. The prep work was thorough and the results are beautiful. Fair price too.", "Karen P."),
    ],
    "Auto Repair": [
        ("Honest mechanics — they actually told me I didn't need a repair another shop quoted me $800 for. Earned a customer for life.", "Chris B."),
        ("Fast, affordable, and they explain everything in plain English. Best auto shop in town.", "Maria G."),
        ("Brought my car in with a weird noise — they diagnosed and fixed it same day. Excellent work and great prices.", "Tom H."),
    ],
    "default": [
        ("Excellent service from start to finish. Professional, on time, and fair pricing. Highly recommend!", "Michael R."),
        ("We've used them multiple times and they never disappoint. Quality work and great communication.", "Jennifer S."),
        ("Called them for an estimate and they were out the next day. Work was done perfectly. Will definitely use again!", "David L."),
    ],
}

def slugify(name):
    s = name.lower().strip()
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'[\s-]+', '-', s)
    return s.strip('-')

def stars_html(rating):
    full = int(rating)
    half = 1 if rating - full >= 0.3 else 0
    return "★" * full + ("½" if half else "") + "☆" * (5 - full - half)

def fetch_notion_prospects():
    all_results = []
    has_more = True
    start_cursor = None
    while has_more:
        body = {"sorts": [{"property": "Lead Score", "direction": "descending"}], "page_size": 100}
        if start_cursor:
            body["start_cursor"] = start_cursor
        data = json.dumps(body).encode()
        req = urllib.request.Request(
            f"https://api.notion.com/v1/databases/{DB_ID}/query",
            data=data,
            headers={
                "Authorization": f"Bearer {NOTION_API_KEY}",
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json",
            }
        )
        resp = urllib.request.urlopen(req)
        result = json.loads(resp.read())
        all_results.extend(result["results"])
        has_more = result.get("has_more", False)
        start_cursor = result.get("next_cursor")
    return all_results

def extract_prospect(page):
    p = page["properties"]
    def get_title():
        for k, v in p.items():
            if v.get("type") == "title":
                return "".join(t["plain_text"] for t in v.get("title", []))
        return ""
    def get_text(key):
        return "".join(t["plain_text"] for t in p.get(key, {}).get("rich_text", []))

    name = get_title()
    return {
        "name": name,
        "slug": slugify(name),
        "phone": p.get("Phone", {}).get("phone_number", "") or "",
        "city": get_text("Location/City"),
        "business_type": (p.get("Business Type", {}).get("select") or {}).get("name", ""),
        "score": p.get("Lead Score", {}).get("number", 0) or 0,
        "rating": p.get("Star Rating", {}).get("number", 0) or 4.8,
        "review_count": p.get("Review Count", {}).get("number", 0) or 0,
        "has_website": p.get("Has Website", {}).get("checkbox", False),
    }

def generate_services_html(business_type):
    services = SERVICES_DATA.get(business_type, DEFAULT_SERVICES)
    html = ""
    for icon, title, desc in services:
        html += f"""                <div class="service-card">
                    <div class="service-icon">{icon}</div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                </div>\n"""
    return html

def generate_reviews_html(business_type):
    reviews = REVIEW_TEMPLATES.get(business_type, REVIEW_TEMPLATES["default"])
    html = ""
    for text, author in reviews:
        html += f"""            <div class="review-card">
                <div class="review-stars">★★★★★</div>
                <p class="review-text">"{text}"</p>
                <p class="review-author">— {author}</p>
            </div>\n"""
    return html

def generate_preview(prospect, template):
    bt = prospect["business_type"]
    colors = COLOR_SCHEMES.get(bt, DEFAULT_COLORS)
    tagline = TAGLINES.get(bt, "Professional Service You Can Trust — Call Today for a Free Estimate")
    tagline = tagline.replace("[City]", prospect["city"] or "your area")

    replacements = {
        "{{BUSINESS_NAME}}": prospect["name"],
        "{{PHONE}}": prospect["phone"] or "(555) 000-0000",
        "{{CITY}}": prospect["city"] or "South Bay",
        "{{BUSINESS_TYPE}}": bt or "Service",
        "{{BUSINESS_TYPE_LOWER}}": (bt or "service").lower(),
        "{{HERO_TAGLINE}}": tagline,
        "{{RATING}}": str(prospect["rating"]),
        "{{REVIEW_COUNT}}": str(prospect["review_count"]),
        "{{STARS_HTML}}": stars_html(prospect["rating"]),
        "{{SERVICES_HTML}}": generate_services_html(bt),
        "{{REVIEWS_HTML}}": generate_reviews_html(bt),
        "{{HOURS_HTML}}": "",
        "{{PRIMARY_COLOR}}": colors[0],
        "{{PRIMARY_DARK}}": colors[1],
        "{{PRIMARY_LIGHT}}": colors[2],
    }

    html = template
    for key, value in replacements.items():
        html = html.replace(key, value)
    return html

def main():
    os.makedirs(PREVIEWS_DIR, exist_ok=True)

    with open(TEMPLATE_PATH, "r") as f:
        template = f.read()

    print("Fetching prospects from Notion...")
    pages = fetch_notion_prospects()
    print(f"Found {len(pages)} total prospects")

    prospects = [extract_prospect(p) for p in pages]
    # Filter: has phone and city, sort by score
    prospects = [p for p in prospects if p["phone"] and p["city"] and p["score"] >= 50]
    prospects.sort(key=lambda x: (-x["score"], -x["review_count"]))

    index = {}
    count = 0
    for prospect in prospects:
        if not prospect["slug"]:
            continue
        html = generate_preview(prospect, template)
        filepath = os.path.join(PREVIEWS_DIR, f"{prospect['slug']}.html")
        with open(filepath, "w") as f:
            f.write(html)
        # Index: lowercase name -> slug
        index[prospect["name"].lower()] = prospect["slug"]
        count += 1
        print(f"  ✅ {prospect['name']} → previews/{prospect['slug']}.html")

    # Write index.json
    index_path = os.path.join(PREVIEWS_DIR, "index.json")
    with open(index_path, "w") as f:
        json.dump(index, f, indent=2)

    print(f"\nGenerated {count} preview sites")
    print(f"Index saved to previews/index.json")

if __name__ == "__main__":
    main()
