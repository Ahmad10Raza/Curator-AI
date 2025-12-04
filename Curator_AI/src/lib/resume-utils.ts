import { ParsedResume } from "@/server/services/resume-parser"

export function jsonToMarkdown(resume: ParsedResume): string {
    let md = `# ${resume.fullName}\n\n`
    md += `${resume.email} | ${resume.phone}\n\n`

    md += `## Summary\n\n${resume.summary}\n\n`

    md += `## Skills\n\n`
    md += resume.skills.join(", ") + "\n\n"

    if (resume.experience && resume.experience.length > 0) {
        md += `## Experience\n\n`
        resume.experience.forEach(exp => {
            md += `### ${exp.title} at ${exp.company}\n`
            md += `${exp.startDate} - ${exp.endDate}\n\n`
            md += `${exp.description}\n\n`
        })
    }

    if (resume.projects && resume.projects.length > 0) {
        md += `## Projects\n\n`
        resume.projects.forEach(proj => {
            md += `### ${proj.name}\n`
            md += `${proj.description}\n`
            md += `*Stack: ${proj.techStack.join(", ")}*\n\n`
        })
    }

    if (resume.education && resume.education.length > 0) {
        md += `## Education\n\n`
        resume.education.forEach(edu => {
            md += `### ${edu.degree}\n`
            md += `${edu.school}, ${edu.year}\n\n`
        })
    }

    return md
}
