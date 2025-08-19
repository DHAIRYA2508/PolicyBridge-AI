# generate_many_policies_inr.py
# Generate N (10–15) detailed insurance PDFs in INR with all crucial fields.
# Creates PDFs for Auto / Health / Life, plus a CSV summary and a ZIP bundle.

import os, random, zipfile, argparse, csv
from datetime import date
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.graphics.shapes import Drawing, Rect, String

# ------------------------ Config ------------------------
OUT_DIR = "out_policies"
ZIP_NAME = "policies_bundle.zip"
CSV_NAME = "policy_summary.csv"
README_NAME = "README.txt"
random.seed(1234)

AUTO_RATIO, HEALTH_RATIO, LIFE_RATIO = 0.4, 0.3, 0.3  # mix proportions
FY = 2024  # validity anchor (adjust if needed)

INSURERS = [
    ("SafeDrive Motors Insurance", "#4C8BF5", "auto"),
    ("AutoShield General", "#2A9D8F", "auto"),
    ("MediCare Health Co.", "#E76F51", "health"),
    ("WellLife Health Insurance", "#8E44AD", "health"),
    ("SecureLife Assurance", "#F4A261", "life"),
    ("Guardian Life Corp.", "#457B9D", "life"),
]

FIRST_NAMES = ["Ramesh","Priya","Amit","Neha","Vikas","Kavita","Ishaan","Pooja","Rahul","Sneha","Harsh","Dhruvi","Ankit","Meera","Saurabh","Divya"]
LAST_NAMES  = ["Kumar","Shah","Desai","Patel","Sharma","Mehta","Joshi","Bhatt","Rao","Iyer","Nair","Ghosh"]
CITIES      = ["Ahmedabad","Mumbai","Pune","Bengaluru","Delhi","Surat","Jaipur","Kolkata","Hyderabad","Chennai","Indore","Lucknow"]

# ------------------------ Helpers ------------------------
def fmt_inr(n: int) -> str:
    s = f"{n}"
    if len(s) <= 3: return f"₹ {s}"
    head, tail = s[:-3], s[-3:]
    parts = []
    while len(head) > 2:
        parts.insert(0, head[-2:])
        head = head[:-2]
    parts.insert(0, head)
    return "₹ " + ",".join(parts) + "," + tail

def fake_logo(text: str, color_hex: str = "#4C8BF5") -> Drawing:
    d = Drawing(160, 56)
    d.add(Rect(0, 0, 160, 56, fillColor=colors.HexColor(color_hex), strokeColor=colors.HexColor(color_hex)))
    d.add(String(10, 18, text, fontSize=16, fillColor=colors.white))
    return d

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="H1", fontSize=18, leading=22, spaceAfter=10, textColor=colors.HexColor("#1D3557")))
styles.add(ParagraphStyle(name="H2", fontSize=13, leading=18, spaceAfter=6, textColor=colors.HexColor("#264653")))
styles.add(ParagraphStyle(name="Body", fontSize=10.5, leading=15))
styles.add(ParagraphStyle(name="Note", fontSize=9, leading=13, textColor=colors.HexColor("#555")))

TERMS_LONG = [
    "Free-look period: 15 days from receipt of policy; refund after applicable deductions.",
    "Grace period: 30 days (annual/half-yearly/quarterly) or 15 days (monthly).",
    "Non-disclosure/misrepresentation may void the policy ab initio.",
    "Claims subject to investigation and verification of documents.",
    "Jurisdiction: Courts of the issuing city.",
    "Renewal subject to underwriting; premium/features may change with IRDAI approval.",
    "Waiting periods apply as specified for select benefits.",
    "Network provider list is dynamic and may change without notice.",
    "No benefits for losses arising from criminal acts or breach of law.",
    "Taxes (GST, etc.) are extra as per prevailing law.",
    "Portability allowed; apply ≥45 days before renewal date (health).",
    "Nomination/assignment as per Insurance Act and applicable rules.",
]

DOC_REQ_BASE = [
    "Duly filled & signed claim form.",
    "Photo ID & address proof.",
    "Original policy schedule and premium receipts.",
]

DOC_REQ_AUTO = [
    "FIR/Police intimation for theft/major accidents.",
    "Repair estimates, photographs, and garage invoice.",
    "Driving license, RC, and pollution certificate.",
]

DOC_REQ_HEALTH = [
    "Hospital bills, prescriptions, diagnostic reports, discharge summary.",
    "Pre-authorization approval (for planned hospitalization).",
]

DOC_REQ_LIFE = [
    "Death certificate and cause of death certificate (for death claims).",
    "KYC of nominee, bank details for NEFT.",
]

def rname():
    return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"

def raddr():
    return f"{random.randint(101,999)}/{random.randint(1,9)}, {random.choice(CITIES)}, India - {random.randint(110000,899999)}"

def policy_ids(prefix):
    return f"{prefix}-{random.randint(100000, 999999)}"

def header_block(story, company_name, color):
    story.append(fake_logo(company_name, color))
    story.append(Spacer(1, 8))
    story.append(Paragraph(company_name, styles["H1"]))
    story.append(Paragraph("Registered Office: 21/A, Corporate Park, Business District, Mumbai, India", styles["Note"]))
    story.append(Paragraph("Toll-free: 1800-000-000 | Email: care@" + company_name.lower().replace(" ", "") + ".com", styles["Note"]))
    story.append(Spacer(1, 10))

def details_table(meta):
    data = [
        ["Policy Number", meta["policy_no"]],
        ["Policy Type", meta["policy_type"]],
        ["Policyholder", meta["holder"]],
        ["Sum Insured", fmt_inr(meta["sum_insured"])],
        ["Annual Premium", fmt_inr(meta["premium"])],
        ["Deductible / Co-pay", fmt_inr(meta["deductible"]) if meta["deductible"] else "Nil"],
        ["Waiting Periods", meta["waiting_periods"]],
        ["Claim Settlement Ratio", f'{meta["claim_ratio"]:.1f}%'],
        ["Validity", f'{meta["valid_from"]} to {meta["valid_to"]}'],
        ["Insurer", meta["company"]],
    ]
    t = Table(data, colWidths=[160, 360])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.lightgrey),
        ("BOX", (0,0), (-1,-1), 0.8, colors.black),
        ("INNERGRID", (0,0), (-1,-1), 0.4, colors.grey),
        ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
        ("BOTTOMPADDING", (0,0), (-1,0), 8),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ]))
    return t

def list_section(title, points):
    elems = [Paragraph(title, styles["H2"])]
    for p in points:
        elems.append(Paragraph("• " + p, styles["Body"]))
    elems.append(Spacer(1, 6))
    return elems

def signature_block():
    return [
        Spacer(1, 14),
        Paragraph("For and on behalf of the Insurer", styles["Body"]),
        Spacer(1, 20),
        Paragraph("______________________________", styles["Body"]),
        Paragraph("Authorized Signatory", styles["Body"]),
        Spacer(1, 8),
        Paragraph("(Sample document for ML testing. Not a real policy.)", styles["Note"]),
    ]

def build_auto_blocks(meta):
    coverage = [
        "Own-damage for accident, fire, flood, earthquake, cyclone.",
        "Third-party liability for injury/death as per Motor Vehicles Act.",
        f"Property damage liability up to {fmt_inr(750_000)[2:]}.",
        f"Personal accident cover for owner-driver {fmt_inr(1_500_000)[2:]}.",
        f"Towing reimbursement up to {fmt_inr(5_000)[2:]} per event.",
        "Cashless repairs at network garages; reimbursement otherwise.",
        "Add-ons (optional): Zero Depreciation, Engine Protect, Return-to-Invoice, NCB Protect.",
    ]
    exclusions = [
        "Driving under influence of alcohol/drugs.",
        "No valid driving license / RC / PUC at time of incident.",
        "Consequential loss, normal wear & tear, depreciation (unless add-on).",
        "Use of vehicle for racing, pace-making or illegal activities.",
        "Mechanical/electrical breakdown not caused by insured peril.",
    ]
    claims = [
        "Intimate within 48 hours through app/helpline; obtain claim number.",
        "For accidents/theft, file FIR where applicable; do not dismantle before survey.",
        "Surveyor inspection; submit estimates, photos, DL, RC, PUC.",
        "Cashless at network garage or reimbursement; pay deductibles if applicable.",
        "Settlement target: 15 working days post final document submission.",
    ]
    docs = DOC_REQ_BASE + DOC_REQ_AUTO
    flexibility = [
        "Choose voluntary deductible to lower premium.",
        "Add/remove riders (Zero Dep, Engine Protect) at inception/renewal.",
        "Geographical extension endorsement available.",
    ]
    benefits = [
        "Roadside assistance 24x7; free towing up to 50 km.",
        "No Claim Bonus (NCB) up to 50% (as per grid).",
        "Wide network of 5000+ garages.",
    ]
    return coverage, exclusions, claims, docs, flexibility, benefits

def build_health_blocks(meta):
    coverage = [
        f"In-patient hospitalization up to {fmt_inr(meta['sum_insured'])[2:]}.",
        f"Room rent up to {fmt_inr(5_000)[2:]}/day; ICU up to {fmt_inr(10_000)[2:]}/day.",
        "Pre (30 days) and Post (60 days) hospitalization expenses.",
        "Daycare procedures covered; AYUSH treatments at govt/empanelled hospitals.",
        f"Ambulance cover up to {fmt_inr(5_000)[2:]} per hospitalization.",
        "No-Claim Bonus up to 50% of Sum Insured (as per grid).",
    ]
    exclusions = [
        "Pre-existing diseases for first 36 months from inception.",
        "Cosmetic/aesthetic treatments; dental & vision unless due to accident.",
        "Treatment for alcohol or drug abuse.",
        "Experimental/unproven therapies not supported by clinical evidence.",
    ]
    claims = [
        "For planned hospitalization, pre-authorize at least 48 hours in advance.",
        "For emergency, intimate within 24 hours; use TPA desk for cashless.",
        "Submit discharge summary, bills, prescriptions, diagnostics.",
        "Reimbursement timeline: 10–15 days after receiving final documents.",
    ]
    docs = DOC_REQ_BASE + DOC_REQ_HEALTH
    flexibility = [
        "Choose deductible/top-up options to optimize premium.",
        "Opt for room-rent waiver or restore benefit riders.",
        "Add family members at renewal (subject to underwriting).",
    ]
    benefits = [
        "Cashless across 10,000+ network hospitals.",
        "Wellness benefits and preventive health check-ups (as per plan).",
        "Cumulative bonus for claim-free years.",
    ]
    return coverage, exclusions, claims, docs, flexibility, benefits

def build_life_blocks(meta):
    coverage = [
        f"Death benefit: {fmt_inr(meta['sum_insured'])[2:]} payable to nominee.",
        f"Optional Accidental Death Benefit Rider up to {fmt_inr(int(meta['sum_insured']*0.5))[2:]}.",
        "Tax benefits under prevailing laws.",
    ]
    exclusions = [
        "Suicide within 12 months from policy inception or revival.",
        "Death due to participation in criminal acts or war/terrorism.",
        "Non-disclosure of material facts at proposal stage.",
    ]
    claims = [
        "Nominee intimates claim via portal/helpline and submits death certificate.",
        "Provide KYC, policy bond, and cause of death certificate.",
        "Target settlement within 30 days subject to verification.",
    ]
    docs = DOC_REQ_BASE + DOC_REQ_LIFE
    flexibility = [
        "Choose premium payment mode (annual/half-yearly/quarterly/monthly).",
        "Option to add riders (ADB, CI) at inception or renewal (as per product rules).",
        "Change of nominee/address allowed with endorsement.",
    ]
    benefits = [
        "High sum assured discounts (as per slab).",
        "Loan facility for eligible savings plans after specified period.",
        "Surrender value/paid-up benefits as per policy terms (non-term).",
    ]
    return coverage, exclusions, claims, docs, flexibility, benefits

def create_pdf(path, meta, blocks):
    coverage, exclusions, claims, doc_req, flexibility, benefits = blocks

    doc = SimpleDocTemplate(path, pagesize=A4, leftMargin=46, rightMargin=46, topMargin=50, bottomMargin=50)
    story = []

    # Header + details
    header_block(story, meta["company"], meta["color"])
    story.append(Paragraph(meta["policy_type"] + " Policy Document", styles["H1"]))
    story.append(details_table(meta))
    story.append(Spacer(1, 10))

    # Contact block
    story.append(Paragraph("Policyholder Contact", styles["H2"]))
    story.append(Paragraph(meta["holder"] + "<br/>" + meta["holder_addr"], styles["Body"]))
    story.append(Spacer(1, 8))

    # Sections (page 1)
    story += list_section("Coverage Details (Scope & Sub-limits)", coverage)
    story += list_section("Exclusions (Not Covered)", exclusions)

    # Page 2
    story.append(PageBreak())
    story += list_section("Claim Process (Steps & Timelines)", claims)
    story += list_section("Mandatory Documents for Claims", doc_req)
    story += list_section("Additional Benefits", benefits)
    story += list_section("Flexibility Options", flexibility)

    # Page 3 – Terms & Definitions
    story.append(PageBreak())
    story.append(Paragraph("Terms & Conditions", styles["H2"]))
    for clause in TERMS_LONG:
        story.append(Paragraph("• " + clause, styles["Body"]))
    story.append(Spacer(1, 6))

    story += list_section("Key Definitions", [
        "Pre-existing Disease – A condition that existed prior to policy effective date.",
        "Waiting Period – Time after policy start during which specified conditions are not covered.",
        "Sum Insured – Maximum liability of the insurer under the policy.",
        "Network Provider – Hospital/garage with a service agreement with the insurer.",
        "Deductible – Portion of claim payable by insured before insurer’s liability kicks in.",
    ])

    # Signature
    story += signature_block()
    doc.build(story)

def make_one(kind_hint):
    # Select insurer by kind
    candidates = [x for x in INSURERS if x[2] == kind_hint]
    company, color, _ = random.choice(candidates)

    # Validity
    valid_from = f"01-Apr-{FY}"
    valid_to   = f"31-Mar-{FY+1}"

    # Base meta by type
    if kind_hint == "auto":
        policy_type = random.choice(["Auto (Comprehensive)","Auto (Third-Party Only)"])
        policy_no = policy_ids("AUTO")
        sum_insured = random.choice([500_000, 700_000, 1_000_000])
        premium = random.choice([9_800, 12_500, 15_200, 18_500])
        deductible = random.choice([2_000, 3_500, 5_000])
        waiting = "30 days for add-ons (if opted)"
        claim_ratio = random.uniform(90.0, 97.0)

    elif kind_hint == "health":
        policy_type = random.choice(["Health (Family Floater)","Health (Individual)"])
        policy_no = policy_ids("HLT")
        sum_insured = random.choice([500_000, 1_000_000, 1_500_000])
        premium = random.choice([12_500, 14_200, 24_800, 31_500])
        deductible = random.choice([0, 10_000, 25_000])
        waiting = "Initial 30 days; 36 months for PED; specific waiting as per grid"
        claim_ratio = random.uniform(85.0, 95.0)

    else:  # life
        policy_type = random.choice(["Life (Term Plan)","Life (Endowment Plan)"])
        policy_no = policy_ids("LIF")
        sum_insured = random.choice([2_000_000, 5_000_000, 10_000_000])
        premium = random.choice([12_000, 18_000, 45_000, 65_000])
        deductible = 0
        # Life plans typically don't have waiting except suicide clause; still add clarity
        waiting = "No general waiting; suicide exclusion 12 months; rider-specific waiting may apply"
        claim_ratio = random.uniform(96.0, 99.5)

    meta = {
        "company": company,
        "color": color,
        "policy_type": policy_type,
        "policy_no": policy_no,
        "holder": rname(),
        "holder_addr": raddr(),
        "sum_insured": sum_insured,
        "premium": premium,
        "deductible": deductible,
        "waiting_periods": waiting,
        "claim_ratio": claim_ratio,
        "valid_from": valid_from,
        "valid_to": valid_to,
    }

    # Build blocks per type
    if kind_hint == "auto":
        blocks = build_auto_blocks(meta)
    elif kind_hint == "health":
        blocks = build_health_blocks(meta)
    else:
        blocks = build_life_blocks(meta)

    return meta, blocks

def generate_many(n_count: int):
    os.makedirs(OUT_DIR, exist_ok=True)

    # Decide counts by ratio
    n_auto = max(1, round(n_count * AUTO_RATIO))
    n_health = max(1, round(n_count * HEALTH_RATIO))
    n_life = max(1, n_count - n_auto - n_health)

    metas = []
    paths = []

    # Generate by type
    for kind, n in [("auto", n_auto), ("health", n_health), ("life", n_life)]:
        for _ in range(n):
            meta, blocks = make_one(kind)
            pdf_path = os.path.join(OUT_DIR, f"{meta['policy_no']}.pdf")
            create_pdf(pdf_path, meta, blocks)
            metas.append(meta)
            paths.append(pdf_path)

    # CSV summary
    with open(CSV_NAME, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow([
            "policy_no","policy_type","insurer","holder","sum_insured","premium",
            "deductible","waiting_periods","claim_settlement_ratio","valid_from","valid_to"
        ])
        for m in metas:
            w.writerow([
                m["policy_no"], m["policy_type"], m["company"], m["holder"],
                m["sum_insured"], m["premium"], m["deductible"], m["waiting_periods"],
                f"{m['claim_ratio']:.1f}%", m["valid_from"], m["valid_to"]
            ])

    # README
    with open(README_NAME, "w", encoding="utf-8") as f:
        f.write(
            "Sample Insurance Policies (INR) — Auto / Health / Life\n"
            "------------------------------------------------------\n"
            "This bundle contains synthetic policy PDFs for ML testing.\n"
            "Each PDF includes: coverage, exclusions, premiums (₹), sum insured, deductibles, waiting periods,\n"
            "claim settlement ratio, additional benefits, flexibility options, support contacts, validity dates,\n"
            "and authorized signatory.\n\n"
            "Files:\n"
            f"- Directory: {OUT_DIR}/ (PDFs)\n"
            f"- CSV: {CSV_NAME}\n"
            f"- README: {README_NAME}\n"
        )

    # Zip everything
    with zipfile.ZipFile(ZIP_NAME, "w", zipfile.ZIP_DEFLATED) as z:
        for p in paths:
            z.write(p, os.path.join(os.path.basename(OUT_DIR), os.path.basename(p)))
        z.write(CSV_NAME, CSV_NAME)
        z.write(README_NAME, README_NAME)

    print(f"✅ Generated {len(paths)} PDFs in '{OUT_DIR}', CSV '{CSV_NAME}', and ZIP '{ZIP_NAME}'.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate many detailed sample insurance policies (INR).")
    parser.add_argument("--count", type=int, default=12, help="Number of policies to generate (10–15 recommended).")
    args = parser.parse_args()
    n = args.count
    if n < 1:
        n = 12
    generate_many(n)
