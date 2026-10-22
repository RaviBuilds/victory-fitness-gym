# GYM RESEARCH PACKAGE — Victory Fitness Club, Punjagutta

Researched: October 22, 2026
Researcher: Gemini Deep Research
Phase: PROSPECT_DEMO
Source report: `Victory Fitness Research Plan.pdf`

> This file is the schema-normalized research package for the BLOGSPAGE AI gym website factory.
> It preserves the source report's findings while separating verified/publicly reported/inferred information. Non-`VERIFIED_OFFICIAL` fields require owner verification before final-client production.

> Factory-level content excluded from this research package: Hero content/artwork, transformation data, Training Intelligence, Between Sessions education, section headings/labels, and discount percentages are intentionally excluded. Generic educational ideas mentioned in the source report are not treated as gym-published content.

## Status and source conventions

- `VERIFIED_OFFICIAL`: Explicitly present in the source report's Google Business Profile screenshot/identity anchor, or owner-provided. The source report references a GBP screenshot but the actual screenshot is embedded in the PDF; fields sourced from that screenshot are identified accordingly.
- `PUBLICLY_REPORTED`: Reported by a third-party directory, aggregator, or user review; not confirmed directly by gym management.
- `INFERRED`: Interpretation or synthesis, not an explicit business fact.
- `NOT_FOUND`: Not located or not available in the source report; value is `null` unless the field is a documented empty collection.
- `CONFLICTING_SOURCES`: Material sources disagree; no value is selected as canonical.
- Source report claims labelled “verified” are not automatically treated as `VERIFIED_OFFICIAL` when the stated evidence is a directory or review. The report's own confidence language is retained as context, not as proof of official ownership.

## 1. BUSINESS

```yaml
BUSINESS:
  name:
    value: "Victory Fitness Club"
    source: "Google Business Profile screenshot/identity anchor; corroborated by Magicpin, Justdial, FITPASS, and OnePass"
    status: VERIFIED_OFFICIAL
  tagline:
    value: null
    source: "No official tagline identified in the source report"
    status: NOT_FOUND
  description:
    value: "A unisex commercial gym in Punjagutta, Hyderabad, publicly listed for strength training, cardio training, and personal training. The source report describes the facility as spacious and equipped with cardio machines and free-weight equipment; these details rely on public listings, reviews, and GBP visual evidence."
    source: "Google Business Profile screenshot/identity anchor; OnePass; FITPASS; Justdial; Gemini report synthesis"
    status: PUBLICLY_REPORTED
  category:
    value: "Gym / Fitness Centre / Commercial Gym"
    source: "Google Business Profile screenshot/identity anchor and public directory categorizations"
    status: VERIFIED_OFFICIAL
  primary_locality:
    value: "Punjagutta"
    source: "Google Business Profile screenshot/identity anchor; Magicpin; Justdial; FITPASS"
    status: VERIFIED_OFFICIAL
  branch_count:
    value: 1
    source: "Gemini report's branch discovery across directories and mapped listings; no corroborating evidence of other linked branches found"
    status: INFERRED
  year_established:
    value: null
    source: "Gemini report states founding year is not verified; an approximate '2 years' was inferred from directory tags but is not a confirmed establishment date"
    status: NOT_FOUND
```

## 2. CONTACT

```yaml
CONTACT:
  phone:
    value: "079899 04703"
    source: "Google Business Profile screenshot/primary identity anchor; secondary number +91 9177358685 appears on Magicpin/Justdial"
    status: VERIFIED_OFFICIAL
  whatsapp:
    value: null
    source: "Third-party directories report +91 8796576868 and/or 091773 58685; dedicated WhatsApp ownership is not confirmed"
    status: CONFLICTING_SOURCES
  email:
    value: null
    source: "Gemini report's public-source search; no email located"
    status: NOT_FOUND
  website:
    value: null
    source: "Gemini report's domain, search, social-bio, and aggregator cross-referencing; no standalone official website located"
    status: NOT_FOUND
  instagram_url:
    value: null
    source: "Gemini report's social profile discovery; no official profile located"
    status: NOT_FOUND
  instagram_handle:
    value: null
    source: "Gemini report's social profile discovery; no official profile located"
    status: NOT_FOUND
  facebook_url:
    value: null
    source: "Gemini report's social profile discovery; no official profile located"
    status: NOT_FOUND
  youtube_url:
    value: null
    source: "Gemini report's social profile discovery; no official profile located"
    status: NOT_FOUND
  booking_url:
    value: null
    source: "Report identifies Fitpass and OnePass aggregator access, but does not provide a confirmed gym-owned booking URL"
    status: NOT_FOUND
```

Known third-party listing URLs are recorded in `SOURCE_LOG`; they are not represented as official gym-owned contact or booking URLs.

## 3. LOCATION

```yaml
LOCATION:
  address_line:
    value: null
    source: "GBP identity anchor reports '1st Floor, Pillar No. A1109, Above Swayamvar, Opposite Reliance, Dwarakapuri'; Justdial reports an alternate door number/landmark"
    status: CONFLICTING_SOURCES
  locality:
    value: "Punjagutta"
    source: "Google Business Profile screenshot/identity anchor; public directories"
    status: VERIFIED_OFFICIAL
  city:
    value: "Hyderabad"
    source: "Google Business Profile screenshot/identity anchor; public directories"
    status: VERIFIED_OFFICIAL
  state:
    value: "Telangana"
    source: "Google Business Profile screenshot/identity anchor; public directories"
    status: VERIFIED_OFFICIAL
  postal_code:
    value: "500082"
    source: "Gemini report's branch inventory and directory listings"
    status: PUBLICLY_REPORTED
  landmark:
    value: null
    source: "GBP anchor says 'Pillar No. A1109, Above Swayamvar, Opposite Reliance'; Justdial uses 'Near Punjagutta Police Station' and Door No. 6-3-452/A"
    status: CONFLICTING_SOURCES
  map_url:
    value: null
    source: "Report says the Google Maps/GBP link was sourced through identity-anchor coordinates but provides no exact map URL"
    status: NOT_FOUND
  latitude:
    value: null
    source: "No numeric coordinates reproduced in the source report"
    status: NOT_FOUND
  longitude:
    value: null
    source: "No numeric coordinates reproduced in the source report"
    status: NOT_FOUND
```

## 4. HOURS

```yaml
HOURS:
  monday:
    open: null
    close: null
    source: "Justdial reports 05:00-22:30; FITPASS reports 06:00-22:00; GBP implication in report says closing at 22:00"
    status: CONFLICTING_SOURCES
  tuesday:
    open: null
    close: null
    source: "Justdial reports 05:00-22:30; FITPASS reports 06:00-22:00; GBP implication in report says closing at 22:00"
    status: CONFLICTING_SOURCES
  wednesday:
    open: null
    close: null
    source: "Justdial reports 05:00-22:30; FITPASS reports 06:00-22:00; GBP implication in report says closing at 22:00"
    status: CONFLICTING_SOURCES
  thursday:
    open: null
    close: null
    source: "Justdial reports 05:00-22:30; FITPASS reports 06:00-22:00; GBP implication in report says closing at 22:00"
    status: CONFLICTING_SOURCES
  friday:
    open: null
    close: null
    source: "Justdial reports 05:00-22:30; FITPASS reports 06:00-22:00; GBP implication in report says closing at 22:00"
    status: CONFLICTING_SOURCES
  saturday:
    open: null
    close: null
    source: "Justdial reports 05:00-22:30; FITPASS reports 06:00-22:00; GBP implication in report says closing at 22:00"
    status: CONFLICTING_SOURCES
  sunday:
    open: null
    close: null
    source: "Justdial reports 05:00-12:00; FITPASS reports closed; GBP hours not visible in the report"
    status: CONFLICTING_SOURCES
  split_shifts_reported:
    value: null
    source: "No split-shift schedule reported"
    status: NOT_FOUND
```

**Publication rule:** Do not publish operating hours until management confirms each day's opening and closing times, especially the weekday morning start and Sunday schedule.

## 5. ABOUT

```yaml
ABOUT:
  short_description:
    value: "A unisex commercial gym located in Punjagutta, Hyderabad, publicly listed for strength training, cardio training, and personal training."
    source: "GBP identity anchor and public directory listings"
    status: PUBLICLY_REPORTED
  positioning:
    value: "Accessible, general-purpose local gym; the report characterizes it as value-oriented rather than a luxury boutique or specialized performance facility."
    source: "Gemini report synthesis from public categorization, pricing listing, and reviews"
    status: INFERRED
  story:
    value: null
    source: "Mission, vision, training philosophy, founder, and brand story are not explicitly published in the source report"
    status: NOT_FOUND
  zones:
    - id: "strength"
      label: "Strength / Free Weights"
      value: "Free-weight area with dumbbells, benches, barbells and weight plates reported or visible in GBP images"
      source: "Google Business Profile visual evidence as described in the report; public service categorization"
      status: PUBLICLY_REPORTED
    - id: "cardio"
      label: "Cardio"
      value: "Cardio area with motorized treadmills visible in GBP images"
      source: "Google Business Profile visual evidence as described in the report"
      status: PUBLICLY_REPORTED
    - id: "general-floor"
      label: "General Training Floor"
      value: "Reviews describe the gym as spacious"
      source: "OnePass and Justdial user reviews as summarized in the report"
      status: PUBLICLY_REPORTED
  attributes:
    - id: "unisex-gym"
      label: "Unisex gym"
      value: true
      source: "Google Business Profile / public directory categorizations"
      status: PUBLICLY_REPORTED
    - id: "spacious-floor"
      label: "Spacious training floor"
      value: "Multiple reviews describe the gym as spacious and offering room to move"
      source: "OnePass and Justdial reviews summarized in the report"
      status: PUBLICLY_REPORTED
    - id: "air-conditioning"
      label: "Air conditioning"
      value: "The report describes air conditioning as implied by reviews of a comfortable environment; no direct owner confirmation is provided"
      source: "Gemini report interpretation of review wording"
      status: INFERRED
    - id: "changing-restrooms"
      label: "Changing / restrooms"
      value: "Reviews mention sanitized restrooms"
      source: "Justdial review quoted in the report"
      status: PUBLICLY_REPORTED
    - id: "flooring"
      label: "Rubberized flooring"
      value: "Red/black impact-absorbing interlocking tiles are described as visible in GBP images"
      source: "Google Business Profile visual evidence as described in the report"
      status: PUBLICLY_REPORTED
    - id: "lighting"
      label: "Lighting"
      value: "Bright LED track lighting and purple accent lighting above the cardio deck are described in GBP images"
      source: "Google Business Profile visual evidence as described in the report"
      status: PUBLICLY_REPORTED
    - id: "ventilation"
      label: "Ventilation"
      value: "Wall-mounted oscillating fans are described as visible in GBP images"
      source: "Google Business Profile visual evidence as described in the report"
      status: PUBLICLY_REPORTED
    - id: "free-parking"
      label: "Free parking"
      value: "A free parking lot is listed by an aggregator"
      source: "OnePass / public aggregator listing"
      status: PUBLICLY_REPORTED
    - id: "drinking-water"
      label: "Drinking water"
      value: "A water cooler is indicated in an aggregator amenity checklist"
      source: "FITPASS / public aggregator listing as summarized in the report"
      status: PUBLICLY_REPORTED
    - id: "accessibility"
      label: "Accessibility"
      value: null
      source: "Report states accessibility information is not verified"
      status: NOT_FOUND
    - id: "nutrition"
      label: "Diet / nutrition services"
      value: null
      source: "No dietitian or nutrition program documented in public sources"
      status: NOT_FOUND
    - id: "physiotherapy"
      label: "Physiotherapy / recovery"
      value: null
      source: "No physiotherapy or recovery service documented in public sources"
      status: NOT_FOUND
```

## 6. PROGRAMS

```yaml
PROGRAMS:
  - id: "strength-training"
    name: "Strength Training"
    description: "Public listings and GBP visual evidence indicate free-weight training equipment, including dumbbells, benches, barbells and plates."
    category: "strength"
    image_opportunity: "Training-floor or free-weight image from the operator-approved photo set."
    source: "Google Business Profile identity anchor/visual evidence; directory service categorization"
    status: PUBLICLY_REPORTED
  - id: "cardio-training"
    name: "Cardio Training"
    description: "Public listings and GBP visual evidence indicate cardio training with motorized treadmills."
    category: "conditioning"
    image_opportunity: "Cardio-equipment image from the operator-approved photo set."
    source: "Google Business Profile visual evidence; directory service categorization"
    status: PUBLICLY_REPORTED
  - id: "personal-training"
    name: "Personal Training"
    description: "Public listings report personal training services; coach identities, credentials, session structure, and availability are not verified."
    category: "personal"
    image_opportunity: "Coach assisting a member on the training floor, photographed with operator approval and accurate representation of the service."
    source: "OnePass / public directory service listings"
    status: PUBLICLY_REPORTED
  - id: "core-exercises"
    name: "Core Exercises"
    description: "Core exercises are listed as a FITPASS marketing/service tag; the exact format, class structure, and schedule are not documented."
    category: "conditioning"
    image_opportunity: "Authentic core-exercise training image from the operator-approved photo set, only if management confirms this offering."
    source: "FITPASS listing as summarized in the report"
    status: PUBLICLY_REPORTED
```

No evidence was reported for dedicated martial arts, yoga, or CrossFit-specific facilities. Do not create those program entries.

## 7. WHY_CHOOSE_US

```yaml
WHY_CHOOSE_US:
  - title: "Spacious training environment"
    description: "Multiple public reviews describe the gym as spacious and offering room to move."
    basis: "Repeated user-review wording; not a comparative claim against competitors"
    source: "OnePass and Justdial reviews summarized in the report"
    status: PUBLICLY_REPORTED
  - title: "Strength and cardio equipment"
    description: "Publicly reported equipment includes treadmills, dumbbells, benches, barbells, and weight plates."
    basis: "GBP visual evidence and service categorization described in the report"
    source: "Google Business Profile visual evidence; public listings"
    status: PUBLICLY_REPORTED
  - title: "Cleanliness and restroom hygiene"
    description: "Some reviews praise clean workout areas and sanitized restrooms."
    basis: "User-review comments; not a formal hygiene certification"
    source: "Justdial / OnePass review summaries"
    status: PUBLICLY_REPORTED
  - title: "Annual membership listed publicly"
    description: "A Justdial Q&A/listing reports an annual membership price of INR 11,000; management must reconfirm that this is current."
    basis: "Third-party listed price, not an owner-confirmed current offer"
    source: "Justdial, as cited by Gemini report"
    status: PUBLICLY_REPORTED
  - title: "Aggregator availability"
    description: "The gym is listed on FITPASS and OnePass."
    basis: "Third-party aggregator listings; access conditions may vary by platform"
    source: "FITPASS and OnePass listings"
    status: PUBLICLY_REPORTED
  - title: "Free parking listed"
    description: "OnePass is reported to list a free parking lot."
    basis: "Third-party amenity listing; current availability and conditions require confirmation"
    source: "OnePass listing as summarized in the report"
    status: PUBLICLY_REPORTED
```

## 8. REVIEWS

```yaml
REVIEWS:
  google_rating:
    value: 4.5
    source: "Google Business Profile screenshot/primary identity anchor, as reported by Gemini"
    status: VERIFIED_OFFICIAL
  google_review_count:
    value: 96
    source: "Google Business Profile screenshot/primary identity anchor, as reported by Gemini"
    status: VERIFIED_OFFICIAL
  google_profile_url:
    value: null
    source: "Report says the profile URL was sourced via identity-anchor coordinates but does not provide an exact URL"
    status: NOT_FOUND
  rating_read_on:
    value: "2026-10-22"
    source: "Gemini report date accessed / research date; rating and count extracted from primary identity anchor"
    status: PUBLICLY_REPORTED
  selected_reviews:
    - reviewer: "Rithik Singh"
      wording: "The best equipment. Very reasonable price. The best we can find in Punjagutta area."
      date: "2 years ago (as reported in source)"
      source: "OnePass / Google review, as reproduced in Gemini report"
      status: PUBLICLY_REPORTED
    - reviewer: "Deekshith"
      wording: "I had a great time at Victory Fitness Club Gym! The gym has personal trainers who are very helpful and knowledgeable. The area is always clean, and the restrooms are sanitized, which makes me feel safe."
      date: "Approximately October 2025 (as reported in source)"
      source: "Justdial review, as reproduced in Gemini report"
      status: PUBLICLY_REPORTED
    - reviewer: "Aditya Sankar"
      wording: "It's a perfect place to focus on your fitness goals!"
      date: "10 months ago (as reported in source)"
      source: "OnePass / Google review, as reproduced in Gemini report"
      status: PUBLICLY_REPORTED
    - reviewer: "Shibu Samuel"
      wording: "Excellent work palce for workout."
      date: "9 months ago (as reported in source)"
      source: "OnePass / Google review, as reproduced in Gemini report"
      status: PUBLICLY_REPORTED
  sentiment_summary:
    value: "Reported positive themes include equipment, spaciousness, value for money, and cleanliness. The report also records mixed feedback about trainer professionalism, including an isolated negative review. This is a synthesis of selected public review material, not a representative survey."
    source: "Gemini report synthesis of OnePass and Justdial reviews"
    status: INFERRED
```

**Rating conflict:** Justdial is reported as 5.0 with 99 ratings/reviews, while the GBP anchor is reported as 4.5 with 96 reviews. These are different platforms and must not be merged into a single metric.

## 9. PRICING

```yaml
PRICING:
  currency:
    value: "INR"
    source: "Currency used in the source report's price listing"
    status: VERIFIED_OFFICIAL
  publishes_pricing_publicly:
    value: true
    source: "Justdial reportedly contains an annual membership price; other plan prices are not disclosed"
    status: PUBLICLY_REPORTED
  plans:
    daily:
      value: null
      source: "No gym-specific daily price found in source report"
      status: NOT_FOUND
    weekly:
      value: null
      source: "No gym-specific weekly price found in source report"
      status: NOT_FOUND
    monthly:
      value: null
      source: "Source report says monthly pricing is not publicly disclosed; generic area prices are not gym-specific"
      status: NOT_FOUND
    quarterly:
      value: null
      source: "Source report says quarterly pricing is not publicly disclosed"
      status: NOT_FOUND
    half_year:
      value: null
      source: "No verified half-yearly price found; report lists it as information to collect from management"
      status: NOT_FOUND
    annual:
      value: 11000
      source: "Justdial Q&A/listing as cited in Gemini report; not owner-confirmed and may not be current"
      status: PUBLICLY_REPORTED
    special_training:
      value: null
      source: "Personal-training session/monthly pricing is not publicly disclosed"
      status: NOT_FOUND
  other_listed_prices:
    - item: "Aggregator access"
      value: null
      note: "Report mentions an example base of approximately INR 1,999/month but does not establish it as a gym-owned price or universal access rate. Do not publish as Victory Fitness Club membership pricing."
      source: "OnePass / FITPASS context as summarized in Gemini report"
      status: NOT_FOUND
  admission_or_joining_fee:
    value: null
    source: "No joining/admission fee documented"
    status: NOT_FOUND
```

**Pricing safety:** Do not estimate missing prices, derive a monthly equivalent from the annual fee for display, or use market-average pricing. Confirm whether INR 11,000/year is current, what it includes, and whether taxes or joining fees apply.

## 10. INSTAGRAM

```yaml
INSTAGRAM:
  profile_url:
    value: null
    source: "Gemini report's official social profile discovery; no official Instagram profile located"
    status: NOT_FOUND
  handle:
    value: null
    source: "Gemini report's official social profile discovery; no official Instagram handle located"
    status: NOT_FOUND
  follower_count:
    value: null
    source: "No official profile or follower count located"
    status: NOT_FOUND
  items:
      - url:
        value: "https://www.instagram.com/p/Dd7w8BFBy5D/?utm_source=ig_web_copy_link&xtok=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA=="
        source: "Official Instagram"
        status: VERIFIED_OFFICIAL
      type: "reel"
      posted_on:
        value: null
        source: null
        status: NOT_FOUND
      subject:
        value: "Strength training session inside the gym"
        source: "Official Instagram Reel"
        status: VERIFIED_OFFICIAL

    - url:
        value: "https://www.instagram.com/p/Dd2qGEtB3o7/?utm_source=ig_web_copy_link&psln=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA=="
        source: "Official Instagram"
        status: VERIFIED_OFFICIAL
      type: "reel"
      posted_on:
        value: null
        source: null
        status: NOT_FOUND
      subject:
        value: "Gym interior and equipment walkthrough"
        source: "Official Instagram Reel"
        status: VERIFIED_OFFICIAL

 - url:
        value: "https://www.instagram.com/p/DcmzYfYhiDi/?utm_source=ig_web_copy_link&mdxt=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA=="
        source: "Official Instagram"
        status: VERIFIED_OFFICIAL
      type: "reel"
      posted_on:
        value: null
        source: null
        status: NOT_FOUND
      subject:
        value: "Gym interior and equipment walkthrough"
        source: "Official Instagram Reel"
        status: VERIFIED_OFFICIAL

```

No individual Reel URLs were present in the source report. Do not invent Reel URLs. If management later supplies approved URLs, add them as operator-supplied content without altering unrelated research.

## 11. FAQ

```yaml
FAQ:
  - question: "Where is Victory Fitness Club located?"
    answer: "The public listing places Victory Fitness Club in Punjagutta, Hyderabad, near Pillar No. A1109 and above Swayamvar, opposite Reliance. Confirm the complete address and floor with management before publishing."
    topic: "location"
    source: "Google Business Profile identity anchor and public directories"
    status: PUBLICLY_REPORTED
  - question: "What are the gym's opening hours?"
    answer: null
    topic: "hours"
    source: "Justdial and FITPASS publish conflicting hours; Sunday is reported as 05:00-12:00 by Justdial and closed by FITPASS"
    status: CONFLICTING_SOURCES
  - question: "Does the gym have parking?"
    answer: "OnePass reportedly lists a free parking lot. Confirm current availability and conditions with management."
    topic: "parking"
    source: "OnePass listing as summarized in Gemini report"
    status: PUBLICLY_REPORTED
  - question: "What training services are listed?"
    answer: "Public listings mention strength/free-weight training, cardio training, personal training, and core exercises. Confirm current availability and formats with management."
    topic: "programs"
    source: "Google Business Profile identity anchor; FITPASS; OnePass and directory listings"
    status: PUBLICLY_REPORTED
  - question: "Does the gym offer nutrition consultation or physiotherapy?"
    answer: null
    topic: "nutrition_and_recovery"
    source: "Gemini report found no documented dietitian/nutrition program or physiotherapy/recovery service"
    status: NOT_FOUND
  - question: "What membership plans and prices are available?"
    answer: "A third-party Justdial listing reports an annual membership price of INR 11,000. Other gym-specific plan prices were not found; all prices must be confirmed with management."
    topic: "pricing"
    source: "Justdial as cited in Gemini report"
    status: PUBLICLY_REPORTED
  - question: "Can members access the gym through fitness aggregators?"
    answer: "The gym is listed on FITPASS and OnePass. Current eligibility, access rules, and availability depend on the relevant platform and should be confirmed."
    topic: "aggregator_access"
    source: "FITPASS and OnePass listings"
    status: PUBLICLY_REPORTED
  - question: "Is the gym accessible for people with mobility needs?"
    answer: null
    topic: "accessibility"
    source: "Accessibility information is not verified in the source report"
    status: NOT_FOUND
```

## 12. SEO

```yaml
SEO:
  gym_name:
    value: "Victory Fitness Club"
    source: "Google Business Profile identity anchor"
    status: VERIFIED_OFFICIAL
  locality:
    value: "Punjagutta"
    source: "Google Business Profile identity anchor"
    status: VERIFIED_OFFICIAL
  city:
    value: "Hyderabad"
    source: "Google Business Profile identity anchor"
    status: VERIFIED_OFFICIAL
  natural_location_wording:
    value:
      - "Gym in Punjagutta"
      - "Fitness centre near Punjagutta Metro Station"
      - "Spacious gym in Dwarakapuri"
      - "Unisex gym near Somajiguda"
    source: "Natural phrases proposed in Gemini report using researched locality and service terms; these are candidate phrases, not verified search-volume data"
    status: INFERRED
  title_candidate:
    value: "Victory Fitness Club | Strength & Cardio Training in Punjagutta, Hyderabad"
    source: "SEO candidate derived from reported business name, services, and location; not an existing official title"
    status: INFERRED
  description_candidate:
    value: "Explore Victory Fitness Club in Punjagutta, Hyderabad, with publicly listed strength training, cardio equipment, and personal training. Confirm current hours and membership details with the gym."
    source: "SEO candidate derived from public listing facts; not existing official copy"
    status: INFERRED
  alt_text_context:
    value:
      - "Victory Fitness Club strength-training area in Punjagutta, Hyderabad (use only with an approved photo that accurately shows this area)"
      - "Cardio treadmills at Victory Fitness Club in Punjagutta, Hyderabad (use only with an approved photo that accurately shows the equipment)"
    source: "Derived from GBP visual evidence described in the source report; alt text must describe the actual selected image"
    status: INFERRED
```

Do not imply that the gym is in Banjara Hills or Somajiguda; the report describes those as nearby/periphery areas or service-area context, not the primary locality. Do not publish “premium” unless management approves the positioning; the source report's primary characterization is accessible/general-purpose/value-oriented.

## 13. ASSET_MANIFEST

```yaml
ASSET_MANIFEST:
  logo:
    value: null
    source: "No downloadable gym-owned logo file or exact asset URL supplied in the source report"
    usable: "unknown"
    status: NOT_FOUND
  candidates:
    - role: "about_interior"
      url: null
      subject: "Authentic wide interior photograph showing the training floor"
      source: "Operator to collect manually; report references GBP photos but provides no exact image URL or reuse permission"
      usable: "unknown"
      status: NOT_FOUND
    - role: "why_choose_anchor"
      url: null
      subject: "Operator-approved photograph accurately showing free-weight equipment or spacious floor"
      source: "Operator to collect manually"
      usable: "unknown"
      status: NOT_FOUND
    - role: "gallery"
      url: null
      subject: "Approved photographs of cardio treadmills, strength equipment, and actual gym areas"
      source: "Operator to collect manually; GBP images are referenced in the report but no exact image URLs or usage rights are supplied"
      usable: "unknown"
      status: NOT_FOUND
    - role: "pricing_background"
      url: null
      subject: "Neutral gym interior or equipment image approved for a pricing section"
      source: "Operator to collect manually"
      usable: "unknown"
      status: NOT_FOUND
    - role: "faq_background"
      url: null
      subject: "Authentic, non-misleading interior image approved for FAQ section use"
      source: "Operator to collect manually"
      usable: "unknown"
      status: NOT_FOUND
    - role: "og_image"
      url: null
      subject: "Operator-approved brand/venue image for social sharing"
      source: "Operator to collect manually"
      usable: "unknown"
      status: NOT_FOUND
```

Do not download or claim ownership of third-party images. The report describes visual evidence from a GBP screenshot but does not provide individual image URLs, source files, or rights clearance.

## 14. SOURCE_LOG

```yaml
SOURCE_LOG:
  - id: "S1"
    priority: 1
    type: "Google Business Profile screenshot / primary identity anchor referenced in source PDF"
    url: null
    accessed: "2026-10-22"
    fields_supplied:
      - "Business name"
      - "Primary phone"
      - "Primary locality/address anchor"
      - "Reported Google rating and review count"
      - "Visual equipment/floor evidence described in report"
    notes: "The report cites a supplied GBP screenshot but does not reproduce a direct GBP profile URL. Treat only explicitly screenshot-derived fields as official-anchor evidence."
  - id: "S2"
    priority: 5
    type: "Third-party directory: Magicpin"
    url: "https://magicpin.in/Hyderabad/Hyderabad-Central-Mall/Fitness/Victory-Fitness-Club/store/1869057"
    accessed: "2026-10-22"
    fields_supplied:
      - "Secondary phone"
      - "Address wording / Swayamvar landmark"
    notes: "Third-party listing; not an official gym-owned source."
  - id: "S3"
    priority: 5
    type: "Third-party directory: Justdial"
    url: "https://www.justdial.com/Hyderabad/Victory-Fitness-Club-Above-Syambar-Showroom-Opposite-Reliance-Punjagutta/040PXX40-XX40-240209200815-M1X7_BZDET"
    accessed: "2026-10-22"
    fields_supplied:
      - "Alternative address and landmark"
      - "Opening hours"
      - "Reported annual membership price"
      - "Reviews and review themes"
      - "Secondary phone information"
    notes: "Third-party listing; reported annual price and hours require owner confirmation."
  - id: "S4"
    priority: 5
    type: "Fitness aggregator: FITPASS"
    url: "https://fitpass.co.in/studio/victory-fitness-club-punjagutta"
    accessed: "2026-10-22"
    fields_supplied:
      - "Core exercises / gym workout service tags"
      - "Opening hours"
      - "Aggregator listing presence"
    notes: "Third-party aggregator; its hours conflict with Justdial."
  - id: "S5"
    priority: 5
    type: "Fitness aggregator and review source: OnePass"
    url: "https://onepassgym.com/space/victory-fitness-club-hyderabad-telangana-india"
    accessed: "2026-10-22"
    fields_supplied:
      - "Free parking listing"
      - "Review wording"
      - "Reported rating/review count context"
      - "Aggregator listing presence"
    notes: "Third-party listing; ratings/reviews are platform-specific."
  - id: "S6"
    priority: 7
    type: "Industry report references summarized by Gemini"
    url: null
    accessed: "2026-10-22"
    fields_supplied:
      - "General Indian fitness industry context"
    notes: "Macro-market figures are not gym-specific and are excluded from the gym's verified business facts."
  - id: "S7"
    priority: 7
    type: "Academic / industry retention literature referenced by Gemini"
    url: null
    accessed: "2026-10-22"
    fields_supplied:
      - "General contextual discussion of trainer interactions and retention"
    notes: "Not evidence of gym-specific policies, outcomes, or capabilities."
```

## 15. VERIFICATION_NOTES

### conflicts

```yaml
conflicts:
  - field: "HOURS.monday-friday"
    values:
      - value: "05:00-22:30"
        source: "Justdial (S3)"
      - value: "06:00-22:00"
        source: "FITPASS (S4)"
      - value: "Closing at 22:00"
        source: "GBP implication as summarized in Gemini report (S1)"
    note: "Do not publish a canonical schedule until gym management confirms opening and closing times for each day."
    status: CONFLICTING_SOURCES
  - field: "HOURS.saturday"
    values:
      - value: "05:00-22:30"
        source: "Justdial (S3)"
      - value: "06:00-22:00"
        source: "FITPASS (S4)"
      - value: "Closing at 22:00"
        source: "GBP implication as summarized in Gemini report (S1)"
    note: "Owner must confirm Saturday hours."
    status: CONFLICTING_SOURCES
  - field: "HOURS.sunday"
    values:
      - value: "05:00-12:00"
        source: "Justdial (S3)"
      - value: "Closed"
        source: "FITPASS (S4)"
      - value: "Not visible"
        source: "GBP implication as summarized in Gemini report (S1)"
    note: "Do not assume Sunday is open or closed; obtain explicit confirmation."
    status: CONFLICTING_SOURCES
  - field: "LOCATION.address_line / landmark / floor"
    values:
      - value: "1st Floor, Pillar No. A1109, Above Swayamvar, Opposite Reliance, Dwarakapuri"
        source: "GBP identity anchor (S1)"
      - value: "Door No. 6-3-452/A, Near Punjagutta Police Station"
        source: "Justdial (S3)"
    note: "The report identifies differing address identifiers and landmark wording. Confirm exact address, floor, pillar number, and landmark with management. Do not silently combine conflicting identifiers into one canonical address."
    status: CONFLICTING_SOURCES
  - field: "CONTACT.whatsapp"
    values:
      - value: "+91 8796576868"
        source: "Third-party directory information summarized in report"
      - value: "091773 58685 / +91 9177358685"
        source: "Third-party directory information summarized in report"
    note: "Neither number is confirmed as the current dedicated WhatsApp Business number. Owner must identify the correct number."
    status: CONFLICTING_SOURCES
  - field: "REVIEWS.rating_and_count"
    values:
      - value: "4.5 stars, 96 reviews"
        source: "Google Business Profile identity anchor (S1)"
      - value: "5.0 stars, 99 ratings/reviews"
        source: "Justdial (S3)"
    note: "These are platform-specific values, not necessarily a direct contradiction. Keep them separate and label each platform; do not merge or substitute one for the other."
    status: CONFLICTING_SOURCES
```

### not_found

```yaml
not_found:
  - field: "BUSINESS.tagline"
    note: "No official tagline identified in the source report."
    sources_searched: "GBP anchor, directories, aggregator listings, general brand searches described in report"
    status: NOT_FOUND
  - field: "BUSINESS.year_established"
    note: "Founding year not verified. Approximate duration inferred from directory tags is not suitable as a fact."
    sources_searched: "Public directories and branch research summarized in report"
    status: NOT_FOUND
  - field: "BUSINESS.owner_or_founder"
    note: "Owner/founder and management names not found."
    sources_searched: "Public-source discovery summarized in report"
    status: NOT_FOUND
  - field: "CONTACT.email"
    note: "No public email found."
    sources_searched: "Public-source discovery summarized in report"
    status: NOT_FOUND
  - field: "CONTACT.website"
    note: "No standalone official website found; report states website discovery was unsuccessful."
    sources_searched: "Domain searches, exact-name/location/phone queries, social bios, directories and aggregators"
    status: NOT_FOUND
  - field: "CONTACT.instagram_url / instagram_handle"
    note: "No official Instagram account located."
    sources_searched: "General Instagram/Facebook brand searches described in report"
    status: NOT_FOUND
  - field: "CONTACT.facebook_url"
    note: "No official Facebook profile located."
    sources_searched: "General social profile searches described in report"
    status: NOT_FOUND
  - field: "CONTACT.youtube_url"
    note: "No official YouTube profile located."
    sources_searched: "Social profile discovery summarized in report"
    status: NOT_FOUND
  - field: "CONTACT.booking_url"
    note: "Aggregator presence is reported, but no exact gym-owned booking URL was supplied."
    sources_searched: "FITPASS and OnePass references in report"
    status: NOT_FOUND
  - field: "LOCATION.map_url / latitude / longitude"
    note: "Exact map URL and numeric coordinates are not reproduced in the PDF."
    sources_searched: "Identity-anchor mapping discussion in report"
    status: NOT_FOUND
  - field: "HOURS.split_shifts_reported"
    note: "No split shifts documented."
    sources_searched: "Hours table in source report"
    status: NOT_FOUND
  - field: "ABOUT.story"
    note: "Mission, vision, training philosophy, founder details, and brand story not explicitly published."
    sources_searched: "Public-source review summarized in report"
    status: NOT_FOUND
  - field: "ABOUT.accessibility"
    note: "Accessibility information not verified."
    sources_searched: "Branch-level facts in source report"
    status: NOT_FOUND
  - field: "ABOUT.nutrition"
    note: "No documented dietitian or nutrition program."
    sources_searched: "Public platforms summarized in report"
    status: NOT_FOUND
  - field: "ABOUT.physiotherapy"
    note: "No documented physiotherapy or recovery service."
    sources_searched: "Public platforms summarized in report"
    status: NOT_FOUND
  - field: "PROGRAMS.class_schedules"
    note: "No class schedule or detailed program methodology supplied."
    sources_searched: "Service and website content inventory in report"
    status: NOT_FOUND
  - field: "PRICING.plans.daily / weekly / monthly / quarterly / half_year"
    note: "Gym-specific prices not verified. Monthly and quarterly pricing are described as not publicly disclosed; half-yearly price is listed as a gap to collect."
    sources_searched: "Justdial, FITPASS, OnePass and pricing analysis in report"
    status: NOT_FOUND
  - field: "PRICING.plans.special_training"
    note: "Personal-training session or package prices not listed."
    sources_searched: "Pricing section in source report"
    status: NOT_FOUND
  - field: "PRICING.admission_or_joining_fee"
    note: "No joining/admission fee documented."
    sources_searched: "Pricing section in source report"
    status: NOT_FOUND
  - field: "TRAINERS.names_and_qualifications"
    note: "No individual trainer names, biographies, qualifications, or certifications found."
    sources_searched: "Public-source review summarized in report"
    status: NOT_FOUND
  - field: "INSTAGRAM.items"
    note: "No Reel URLs supplied; keep items empty."
    sources_searched: "Social profile discovery summarized in report"
    status: NOT_FOUND
  - field: "ASSET_MANIFEST.logo"
    note: "No exact logo asset URL or owner-provided logo file identified in the report."
    sources_searched: "Source PDF and referenced public listings"
    status: NOT_FOUND
  - field: "ASSET_MANIFEST.candidates"
    note: "No individual asset URLs, source files, or reuse permissions supplied; operator must collect approved imagery."
    sources_searched: "GBP visual evidence is described, but individual image URLs and rights are absent"
    status: NOT_FOUND
  - field: "TRANSFORMATION_DATA"
    note: "No verified quantitative transformation cases, before/after data, training duration, coach/diet details, or publication consent records available."
    sources_searched: "Directories and review aggregators summarized in report"
    status: NOT_FOUND
  - field: "REVIEWS.google_profile_url"
    note: "Exact Google Business Profile URL not supplied."
    sources_searched: "Identity-anchor mapping description in report"
    status: NOT_FOUND
```

### publicly_reported_only

```yaml
publicly_reported_only:
  - field: "BUSINESS.description"
    note: "Description combines public listing information and report synthesis; owner approval required."
  - field: "BUSINESS.branch_count"
    note: "Single-unit status is inferred from a lack of linked branch evidence; owner should confirm."
  - field: "BUSINESS.year_established"
    note: "No verified founding year; do not publish an estimated operating duration."
  - field: "CONTACT.phone.secondary"
    note: "Secondary number +91 9177358685 appears on third-party listings; confirm it remains active."
  - field: "CONTACT.whatsapp"
    note: "Third-party directories disagree on the number; owner confirmation required."
  - field: "LOCATION.address_line"
    note: "GBP anchor and Justdial use different address identifiers/landmarks; owner must confirm the correct floor and address wording."
  - field: "LOCATION.postal_code"
    note: "500082 is reported in the research; verify with management before final publication."
  - field: "HOURS.*"
    note: "OWNER VERIFICATION REQUIRED for every day due to source conflicts."
  - field: "ABOUT.*"
    note: "Public review and image-derived facility descriptions require owner confirmation and accurate approved photos."
  - field: "PROGRAMS.*"
    note: "Public directory/aggregator listings only; confirm that each program is currently offered and clarify format/schedule."
  - field: "WHY_CHOOSE_US.*"
    note: "Anchors derive from public reviews, listings, and report interpretation; owner approval required. Avoid comparative superiority claims."
  - field: "REVIEWS.selected_reviews"
    note: "Quoted reviews are reproduced from third-party sources in the research report; confirm permission/attribution and current availability before using on the website."
  - field: "REVIEWS.google_rating / google_review_count"
    note: "Values are from the report's GBP screenshot/identity anchor, not a live re-check; refresh at launch if permitted."
  - field: "FAQ.*"
    note: "Publicly reported answers require owner verification; conflicting/missing answers must remain unpublished until resolved."
  - field: "PRICING.plans.annual"
    note: "INR 11,000 is a third-party-reported annual price, not owner-confirmed; confirm current price and inclusions."
  - field: "ABOUT.attributes.free-parking"
    note: "Free parking is listed by OnePass; confirm current availability and conditions."
  - field: "ABOUT.attributes.drinking-water"
    note: "Water cooler is indicated by an aggregator checklist; confirm with management."
```

### owner_questions

1. What is the exact canonical address, including floor number, pillar number, door number if applicable, and landmark? The report has conflicting address/landmark identifiers.
2. What are the confirmed opening and closing times for Monday through Sunday, particularly weekday opening time and Sunday availability?
3. Which phone number should be published as the primary contact, and is `079899 04703` still active?
4. What is the correct dedicated WhatsApp Business number? Is it `+91 8796576868`, `+91 9177358685`, or another number?
5. What official email address, if any, should be published?
6. Is there an official website, Instagram, Facebook, or YouTube account not found by the report? If yes, provide exact URLs and handles.
7. Is the gym currently a single branch? What is the confirmed founding year?
8. Is the annual membership price of INR 11,000 current, and what exactly does it include?
9. What are the current daily, weekly, monthly, quarterly, half-yearly, annual, personal-training, and joining-fee prices? If a plan is not offered, confirm that explicitly.
10. Are strength training, cardio training, personal training, and core exercises all currently offered? What are the formats and schedules?
11. What are the names, roles, qualifications, and certifications of trainers who may be featured?
12. Are free parking, drinking water, changing facilities/restrooms, and air conditioning currently available? What are any conditions or restrictions?
13. What accessibility features are available, if any?
14. Is nutrition consultation or physiotherapy offered? If not, confirm so the website does not imply those services.
15. Can management provide the final approved logo and high-resolution photos of the actual facility/equipment, with permission for website use?
16. May selected public reviews be quoted on the website, and should reviewer names be shown exactly as on the source platform?
17. Can management provide exact Google Business Profile and map URLs?
18. Are there any approved transformation stories? If so, provide documented measurements and explicit written consent for publication; otherwise leave transformation content absent.

## 16. EXCLUDED_BY_CONTRACT

```yaml
EXCLUDED_BY_CONTRACT:
  - item: "Transformations"
    value: null
    status: NOT_FOUND
    note: "No verified, quantitative, consented transformation cases are available. Do not create before/after stories, weight-loss numbers, body-fat changes, or implied results."
  - item: "Hero copy and artwork"
    value: null
    status: "EXCLUDED_BY_CONTRACT"
    note: "Hero copy/artwork belongs to the factory/template layer and is not populated as gym-specific research."
  - item: "Training Intelligence"
    value: null
    status: "EXCLUDED_BY_CONTRACT"
    note: "Factory/template content; do not generate gym-specific claims from generic fitness knowledge."
  - item: "Between Sessions educational content"
    value: null
    status: "EXCLUDED_BY_CONTRACT"
    note: "Factory/template content; the report's generic educational topic ideas are not evidence that the gym publishes or provides such content."
  - item: "Discount percentages"
    value: null
    status: "EXCLUDED_BY_CONTRACT"
    note: "No discounts or promotional percentages are to be invented or populated."
  - item: "Promotional terms"
    value: null
    status: "EXCLUDED_BY_CONTRACT"
    note: "No promotion, offer, expiry, eligibility, or discount terms were verified."
  - item: "Unsupported health/nutrition/physiological claims"
    value: null
    status: "EXCLUDED_BY_CONTRACT"
    note: "Do not promise weight loss, fat loss, injury prevention, posture correction, recovery outcomes, calorie expenditure, medical benefits, or nutrition outcomes."
```

## Quality-control audit

- **Source attribution:** Each populated field identifies the source basis or explicitly states that the information was not found.
- **Status discipline:** Official-anchor facts are separated from third-party listings, review-derived material, and interpretation.
- **No invented values:** Missing values are `null` with `NOT_FOUND`; lists are empty where no items were supplied.
- **Conflicts preserved:** Hours, address/landmark/floor wording, WhatsApp contact, and platform-specific rating/count differences are recorded without selecting an unsupported canonical value.
- **Pricing uncertainty preserved:** INR 11,000 annual pricing remains third-party reported and requires owner confirmation. No market-average price is substituted.
- **Social uncertainty preserved:** No official Instagram profile or Reel URLs were found; `items: []`.
- **Transformation safety:** No transformation metrics or stories are created.
- **Factory exclusions:** Template-level content and unsupported health claims remain excluded.
- **Production gate:** Owner questions and public-only verification requirements must be resolved before final-client production.
