# generate_insurance_policies_inr.py
# Creates 6 detailed sample insurance policies (Auto x2, Health x2, Life x2)
# in INR, each ~3–4 pages, with fake logos & realistic sections. Zips them.

import os, random, zipfile
from datetime import date

from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.graphics.shapes import Drawing, Rect, String

# ------------ Config ------------
OUTPUT_DIR = "sample_policies"
ZIP_NAME = "sample_insurance_policies.zip"

random.seed(42)  # reproducible names/IDs

# Helper: Indian number format (e.g., 50,00,000)
def fmt_inr(n: int) -> str:
    s = f"{n}"
    # Indian grouping: last 3, then groups of 2
    if len(s) <= 3: return f"₹ {s}"
    head = s[:-3]
    tail = s[-3:]
    parts = []
    while len(head) > 2:
        parts.insert(0, head[-2:])
        head = head[:-2]
    parts.insert(0, head)
    return "₹ " + ",".join(parts) + "," + tail

# Simple fake logo as a Flowable
def fake_logo(text: str, color_hex: str = "#4C8BF5") -> Drawing:
    d = Drawing(140, 52)
    d.add(Rect(0, 0, 140, 52, fillColor=colors.HexColor(color_hex), strokeColor=colors.HexColor(color_hex)))
    d.add(String(12, 18, text, fontSize=16, fillColor=colors.white))
    return d

# Styles
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="H1", fontSize=18, leading=22, spaceAfter=10, textColor=colors.HexColor("#1D3557")))
styles.add(ParagraphStyle(name="H2", fontSize=13, leading=18, spaceAfter=8, textColor=colors.HexColor("#264653")))
styles.add(ParagraphStyle(name="Body", fontSize=10.5, leading=15))
styles.add(ParagraphStyle(name="Note", fontSize=9, leading=13, textColor=colors.HexColor("#555")))

# Longer boilerplate to ensure multi-page docs
TERMS_LONG = [
    "Free-look period: 15 days from the receipt of policy. During this period, you may cancel and receive a refund after applicable deductions.",
    "Grace period for premium payment: 30 days for yearly/half-yearly/quarterly modes and 15 days for monthly mode.",
    "Non-disclosure or misrepresentation of material facts may render the policy void ab initio.",
    "All claims are subject to investigation and verification of submitted documents.",
    "Jurisdiction: Any disputes are subject to the courts situated in the policy issuing city.",
    "Renewal is subject to underwriting guidelines and may include change in premium/riders at renewal.",
    "Waiting periods: As specified for particular benefits (pre-existing diseases, specific illnesses).",
    "Network providers/hospitals list is dynamic and may change without prior notice.",
    "No benefits shall be payable where the loss arises out of criminal acts or breach of law by the insured.",
    "GST and other applicable taxes are extra and payable as per prevailing law.",
    "Portability: You may apply at least 45 days before renewal date to port this policy to another insurer.",
    "The company reserves the right to revise product features and premium rates with IRDAI approval.",
    "Nomination and assignment: As per the provisions of the Insurance Act and applicable rules.",
]

DOC_REQ = [
    "Duly filled and signed claim form.",
    "Valid photo identity proof and address proof.",
    "Original policy schedule and premium payment receipts.",
    "FIR/Police intimation for theft/accident cases, as applicable.",
    "Hospital bills, discharge summary, prescriptions, and diagnostic reports (for health claims).",
    "Repair estimates, photographs, and garage invoice (for motor claims).",
    "Death certificate, cause of death certificate, and KYC of nominee (for life claims).",
]

# Random data pools
FIRST_NAMES = ["Ramesh", "Priya", "Amit", "Neha", "Vikas", "Kavita", "Ishaan", "Pooja", "Rahul", "Sneha", "Harsh", "Dhruvi"]
LAST_NAMES  = ["Kumar", "Shah", "Desai", "Patel", "Sharma", "Mehta", "Joshi", "Bhatt", "Rao", "Iyer"]
CITIES      = ["Ahmedabad", "Mumbai", "Pune", "Bengaluru", "Delhi", "Surat", "Jaipur", "Kolkata", "Hyderabad", "Chennai"]

INSURERS = [
    ("SafeDrive Motors Insurance", "#4C8BF5"),
    ("AutoShield General", "#2A9D8F"),
    ("MediCare Health Co.", "#E76F51"),
    ("WellLife Health Insurance", "#8E44AD"),
    ("SecureLife Assurance", "#F4A261"),
    ("Guardian Life Corp.", "#457B9D"),
]

def random_name():
    return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"

def random_address():
    return f"{random.randint(101,999)}/{random.randint(1,9)}, {random.choice(CITIES)}, India - {random.randint(110000, 899999)}"

def header_block(story, company_name, color):
    story.append(fake_logo(company_name, color))
    story.append(Spacer(1, 10))
    story.append(Paragraph(company_name, styles["H1"]))
    story.append(Paragraph("Registered Office: 21/A, Corporate Park, Business District, Mumbai, India", styles["Note"]))
    story.append(Paragraph("Toll-free: 1800-000-000 | Email: care@" + company_name.lower().replace(" ", "") + ".com", styles["Note"]))
    story.append(Spacer(1, 12))

def details_table(policy_no, holder, sum_insured, premium, valid_from, valid_to, policy_type, insurer_name):
    data = [
        ["Policy Number", policy_no],
        ["Policy Type", policy_type],
        ["Policyholder", holder],
        ["Sum Insured", fmt_inr(sum_insured)],
        ["Annual Premium", fmt_inr(premium)],
        ["Validity", f"{valid_from} to {valid_to}"],
        ["Insurer", insurer_name],
    ]
    t = Table(data, colWidths=[140, 360])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.lightgrey),
        ("TEXTCOLOR", (0,0), (-1,0), colors.black),
        ("BOX", (0,0), (-1,-1), 0.8, colors.black),
        ("INNERGRID", (0,0), (-1,-1), 0.4, colors.grey),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
        ("BOTTOMPADDING", (0,0), (-1,0), 8),
    ]))
    return t

def section_list(title, items):
    elems = [Paragraph(title, styles["H2"])]
    for it in items:
        elems.append(Paragraph("• " + it, styles["Body"]))
    elems.append(Spacer(1, 8))
    return elems

def signature_block():
    return [
        Spacer(1, 16),
        Paragraph("For and on behalf of the Insurer", styles["Body"]),
        Spacer(1, 22),
        Paragraph("______________________________", styles["Body"]),
        Paragraph("Authorized Signatory", styles["Body"]),
        Spacer(1, 10),
        Paragraph("(This is a sample document for ML testing. Not a real policy.)", styles["Note"]),
    ]

def create_policy_pdf(path, company, color, policy_type, policy_no, holder, sum_insured, premium, valid_from, valid_to, coverage, exclusions, claims_steps):
    doc = SimpleDocTemplate(
        path, pagesize=A4, leftMargin=46, rightMargin=46, topMargin=50, bottomMargin=50
    )
    story = []

    # Cover / Header
    header_block(story, company, color)
    story.append(Paragraph(policy_type + " Policy Document", styles["H1"]))
    story.append(Spacer(1, 6))
    story.append(details_table(policy_no, holder, sum_insured, premium, valid_from, valid_to, policy_type, company))
    story.append(Spacer(1, 12))

    # Policyholder contact (adds detail/length)
    story.extend([
        Paragraph("Policyholder Contact Details", styles["H2"]),
        Paragraph(holder + "<br/>" + random_address(), styles["Body"]),
        Spacer(1, 8),
    ])

    # Coverage
    story += section_list("Coverage Benefits (Scope & Sub-limits)", coverage)

    # Exclusions
    story += section_list("Exclusions (What is not covered)", exclusions)

    # Page break to ensure multi-page
    story.append(PageBreak())

    # Claims section (detailed)
    story.append(Paragraph("Claim Process (Step-by-step with timelines)", styles["H2"]))
    for i, step in enumerate(claims_steps, 1):
        story.append(Paragraph(f"{i}. {step}", styles["Body"]))
    story.append(Spacer(1, 10))

    # Required documents
    story += section_list("Mandatory Documents for Claims", DOC_REQ)

    # T&Cs expanded (add lots to push length)
    story.append(Paragraph("Terms & Conditions", styles["H2"]))
    for clause in TERMS_LONG:
        story.append(Paragraph("• " + clause, styles["Body"]))
    story.append(Spacer(1, 8))

    # Another block of general definitions to add depth
    defs = [
        "Definition: Pre-existing Disease – Any condition, ailment, or injury that existed prior to the effective date of the policy.",
        "Definition: Waiting Period – The period from the commencement of the policy during which specified conditions are not covered.",
        "Definition: Sum Insured – The maximum amount payable by the company under the policy.",
        "Definition: Network Provider – A healthcare provider/garage with whom the insurer has a service level agreement.",
        "Definition: Deductible – The amount payable by the insured that is subtracted from a claim amount before settlement.",
    ]
    story += section_list("Key Definitions", defs)

    # Sign-off
    story += signature_block()

    doc.build(story)

def make_all():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Common validity (you can tweak as needed)
    # Using Indian financial year style for generality
    fy = 2024
    valid_from = f"01-Apr-{fy}"
    valid_to   = f"31-Mar-{fy+1}"

    # Define six policies (2 auto, 2 health, 2 life)
    policies = []

    # Auto 1
    policies.append(dict(
        company=INSURERS[0][0], color=INSURERS[0][1],
        policy_type="Auto (Comprehensive)",
        policy_no="AUTO-" + str(random.randint(100000, 999999)),
        holder=random_name(),
        sum_insured=700_000, premium=18_500,
        coverage=[
            "Own damage coverage for accidents, fire, flood, and natural calamities.",
            "Third-party property damage up to " + fmt_inr(750_000)[2:] + ".",
            "Personal accident cover for owner-driver " + fmt_inr(1_500_000)[2:] + ".",
            "Towing charges reimbursement up to " + fmt_inr(5_000)[2:] + " per event.",
            "Zero depreciation add-on (if opted) for eligible parts.",
        ],
        exclusions=[
            "Driving under the influence of alcohol or drugs.",
            "Driving without a valid driving license.",
            "Consequential loss and normal wear & tear.",
            "Use of vehicle for racing or illegal activities.",
            "Mechanical or electrical breakdown not arising from an insured peril.",
        ],
        claims_steps=[
            "Intimate the insurer within 48 hours of the incident via app/helpline.",
            "For accidents, obtain FIR if required. For theft, FIR is mandatory.",
            "Do not dismantle/repair vehicle before survey; await surveyor inspection.",
            "Submit estimates, photographs, and repair bills.",
            "Cashless facility available at network garages; reimbursement otherwise.",
            "Final settlement normally within 15 working days post document submission.",
        ],
        valid_from=valid_from, valid_to=valid_to
    ))

    # Auto 2
    policies.append(dict(
        company=INSURERS[1][0], color=INSURERS[1][1],
        policy_type="Auto (Third-Party Only)",
        policy_no="AUTO-" + str(random.randint(100000, 999999)),
        holder=random_name(),
        sum_insured=500_000, premium=9_800,
        coverage=[
            "Third-party legal liability for injury/death as per Motor Vehicles Act.",
            "Property damage liability up to " + fmt_inr(750_000)[2:] + ".",
            "Legal costs incurred with prior approval of the insurer.",
        ],
        exclusions=[
            "Own damage to the insured vehicle.",
            "Driving without valid license or outside geographical area (India).",
            "Use for hire/reward unless specifically endorsed.",
            "War, nuclear risks, and ionizing radiation.",
        ],
        claims_steps=[
            "Intimate immediately after the incident; provide accident details.",
            "Cooperate with legal proceedings and appointed surveyors.",
            "Submit claim form, DL, RC, FIR (if applicable), and other documents.",
            "Settlement per court/tribunal award; subject to policy terms.",
        ],
        valid_from=valid_from, valid_to=valid_to
    ))

    # Health 1
    policies.append(dict(
        company=INSURERS[2][0], color=INSURERS[2][1],
        policy_type="Health (Family Floater)",
        policy_no="HLT-" + str(random.randint(100000, 999999)),
        holder=random_name(),
        sum_insured=1_000_000, premium=31_500,
        coverage=[
            "In-patient hospitalization up to " + fmt_inr(1_000_000)[2:] + ".",
            "Pre-hospitalization (30 days) and post-hospitalization (60 days).",
            "Room rent up to " + fmt_inr(5_000)[2:] + " per day; ICU up to " + fmt_inr(10_000)[2:] + " per day.",
            "Daycare procedures (as listed) covered without 24-hour hospitalization.",
            "Ambulance cover up to " + fmt_inr(5_000)[2:] + " per hospitalization.",
            "Cashless treatment at network hospitals; reimbursement otherwise.",
        ],
        exclusions=[
            "Pre-existing diseases for first 36 months from inception.",
            "Cosmetic or aesthetic treatments, dental and vision (unless due to accident).",
            "Obesity/weight control treatments, hormone replacement therapy.",
            "Injuries due to self-harm, war, or participation in hazardous activities.",
        ],
        claims_steps=[
            "For planned hospitalization, obtain pre-authorization 48 hours prior.",
            "For emergency hospitalization, intimate within 24 hours.",
            "Submit discharge summary, prescriptions, bills, and diagnostic reports.",
            "Cashless subject to network hospital TPA approval; reimbursement in 10–15 days.",
        ],
        valid_from=valid_from, valid_to=valid_to
    ))

    # Health 2
    policies.append(dict(
        company=INSURERS[3][0], color=INSURERS[3][1],
        policy_type="Health (Individual)",
        policy_no="HLT-" + str(random.randint(100000, 999999)),
        holder=random_name(),
        sum_insured=500_000, premium=14_200,
        coverage=[
            "Hospitalization up to " + fmt_inr(500_000)[2:] + ".",
            "Organ donor expenses up to " + fmt_inr(100_000)[2:] + ".",
            "Domiciliary hospitalization (as per terms).",
            "AYUSH treatments at government/empanelled hospitals.",
            "No-Claim Bonus: 10% increase in Sum Insured per claim-free year (capped).",
        ],
        exclusions=[
            "Maternity expenses for first 36 months.",
            "Treatment for alcohol or drug abuse.",
            "Experimental or unproven treatments not supported by clinical evidence.",
        ],
        claims_steps=[
            "Use insurer app or TPA desk at network hospitals for cashless.",
            "Provide ID, policy e-card, and obtain pre-authorization.",
            "Submit all original bills within 7 days for reimbursement claims.",
        ],
        valid_from=valid_from, valid_to=valid_to
    ))

    # Life 1
    policies.append(dict(
        company=INSURERS[4][0], color=INSURERS[4][1],
        policy_type="Life (Pure Term Plan)",
        policy_no="LIF-" + str(random.randint(100000, 999999)),
        holder=random_name(),
        sum_insured=5_000_000, premium=12_000,
        coverage=[
            "Death benefit of " + fmt_inr(5_000_000)[2:] + " payable to the nominee.",
            "Optional Accidental Death Benefit Rider up to " + fmt_inr(2_500_000)[2:] + ".",
            "Tax benefits as per prevailing tax laws.",
        ],
        exclusions=[
            "Suicide within 12 months from policy inception or revival.",
            "Death due to war, terrorism, or participation in criminal acts.",
            "Non-disclosure of material facts at proposal stage.",
        ],
        claims_steps=[
            "Nominee to intimate claim via portal/helpline and submit death certificate.",
            "Provide KYC, policy bond, and cause of death certificate.",
            "Claim settlement targeted within 30 days subject to verification.",
        ],
        valid_from=valid_from, valid_to=str(int(valid_to[-4:])+19).join([valid_to[:-4], ""])  # extend to 20-year term visually
    ))

    # Life 2
    policies.append(dict(
        company=INSURERS[5][0], color=INSURERS[5][1],
        policy_type="Life (Endowment Plan)",
        policy_no="LIF-" + str(random.randint(100000, 999999)),
        holder=random_name(),
        sum_insured=2_000_000, premium=45_000,
        coverage=[
            "Maturity benefit: Sum Assured plus accrued bonuses (if any).",
            "Death benefit during term: higher of Sum Assured or 10x annual premium.",
            "Loan facility available after 3 full years of premium payment.",
        ],
        exclusions=[
            "Suicide within 12 months from policy inception or revival.",
            "Lapse due to non-payment beyond grace period; benefits as per paid-up value.",
        ],
        claims_steps=[
            "For maturity, submit discharge form with original policy bond.",
            "For death claim, nominee to submit proofs and bank details.",
            "Settlement subject to verification; NEFT to registered bank account.",
        ],
        valid_from=valid_from, valid_to=str(int(valid_to[-4:])+19).join([valid_to[:-4], ""])
    ))

    # Generate PDFs
    pdf_paths = []
    for i, p in enumerate(policies, 1):
        filename = f"{p['policy_no']}.pdf"
        path = os.path.join(OUTPUT_DIR, filename)
        create_policy_pdf(
            path,
            p["company"], p["color"],
            p["policy_type"], p["policy_no"], p["holder"],
            p["sum_insured"], p["premium"],
            p["valid_from"], p["valid_to"],
            p["coverage"], p["exclusions"], p["claims_steps"]
        )
        pdf_paths.append(path)

    # Zip them
    with zipfile.ZipFile(ZIP_NAME, "w", zipfile.ZIP_DEFLATED) as z:
        for p in pdf_paths:
            z.write(p, os.path.basename(p))

    print(f"✅ Generated {len(pdf_paths)} PDFs in '{OUTPUT_DIR}' and zipped to '{ZIP_NAME}'.")

if __name__ == "__main__":
    make_all()
