from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from pdfminer.high_level import extract_text


@dataclass
class ParsedResume:
	summary: str | None
	skills: list[str]
	education: str | None
	experience_snippets: list[str]


def extract_resume_text(pdf_path: Path) -> str:
	return extract_text(str(pdf_path))


def parse_resume_text(text: str) -> ParsedResume:
	lines = [line.strip() for line in text.splitlines()]
	lines = [ln for ln in lines if ln]

	# Naive heuristic-based parsing
	summary_lines: list[str] = []
	skills: list[str] = []
	education_lines: list[str] = []
	experience_snippets: list[str] = []

	section = None
	for ln in lines:
		upper_ln = ln.upper()
		if any(h in upper_ln for h in ["SUMMARY", "PROFILE", "OBJECTIVE"]):
			section = "summary"
			continue
		if any(h in upper_ln for h in ["SKILLS", "TECHNICAL SKILLS", "CORE SKILLS"]):
			section = "skills"
			continue
		if any(h in upper_ln for h in ["EDUCATION"]):
			section = "education"
			continue
		if any(h in upper_ln for h in ["EXPERIENCE", "WORK EXPERIENCE", "PROFESSIONAL EXPERIENCE"]):
			section = "experience"
			continue

		if section == "summary":
			summary_lines.append(ln)
		elif section == "skills":
			# Split by commas or bullets
			for part in [p.strip("•- \t,;=") for p in ln.replace(";", ",").split(",")]:
				if part:
					skills.append(part)
		elif section == "education":
			education_lines.append(ln)
		elif section == "experience":
			# Keep short bullet-like lines
			if len(ln) <= 200:
				experience_snippets.append(ln)

	summary = " ".join(summary_lines).strip() or None
	education = " \n".join(education_lines).strip() or None
	# De-duplicate skills, preserve order
	seen = set()
	unique_skills: list[str] = []
	for s in skills:
		key = s.lower()
		if key not in seen:
			seen.add(key)
			unique_skills.append(s)

	return ParsedResume(
		summary=summary,
		skills=unique_skills[:50],
		education=education,
		experience_snippets=experience_snippets[:50],
	)


