# AWS Security Labs

Short description: Hands-on AWS security labs with IaC, detections, and evidence mapped to RMF.

## Purpose
Explain what this project demonstrates and how it fits your AWS Security & Compliance portfolio.

## Architecture
- Diagram: `diagrams/architecture.mmd`
- Decision: Mermaid for quick docs, draw.io for detailed views.

## Contents
- `labs/` lab guides and scripts
- `iac/` infrastructure as code
- `detections/` detection and monitoring content
- `docs/` markdown docs, RMF mappings
- `diagrams/` Mermaid `.md` or `.mmd` plus draw.io `.drawio`
- `.github/` issue templates and PR template

## Quickstart
1. Clone the repo.
2. Create a Python venv if needed.
3. If using Terraform, init in `iac/`.

```bash
git clone <repo-url>
cd aws-security-labs
python -m venv .venv && source .venv/bin/activate
```

## Project Skeleton
```text
aws-security-labs/
  ├─ labs/
  ├─ iac/
  ├─ detections/
  ├─ docs/
  ├─ diagrams/
  ├─ .github/
  ├─ .gitignore
  ├─ LICENSE
  └─ README.md
```

## RMF / Controls Mapping
- Controls addressed: list the NIST SP 800-53, DoD overlays, or CMMC practices.
- Include control IDs and evidence artifacts.
- Table example in `docs/controls-matrix.csv`.

## Evidence Artifacts
Place exports, screenshots, and reports in `docs/evidence/` with a short README that explains what each file shows.

## Blog / Portfolio Note
Cross-link to the blog post once published on Notes By Nisha.

## Status
- Week: 1
- State: scaffolded
- Next: implement first lab

## License
Apache 2.0