# Documentation Organization Guide

This document explains how documentation is organized in this project and what should/shouldn't be committed to git.

---

## Documentation Structure

```
/
├── README.md                     # Main project documentation (COMMIT)
├── .claude.md                    # AI context for Claude Code (COMMIT)
├── .env.example                  # Example environment variables (COMMIT)
├── .mcp.json                     # MCP server config with credentials (GITIGNORE)
└── docs/                         # Additional documentation (COMMIT)
    ├── SECURITY_AUDIT_REPORT.md  # Security best practices
    ├── NEW_SESSION_INSTRUCTIONS.md # Claude Code setup guide
    └── DOCUMENTATION_GUIDE.md     # This file
```

---

## What to Commit vs Gitignore

### ✅ COMMIT These (Helpful for collaborators)

**Root Level:**

- `README.md` - Main project documentation
- `.claude.md` - Project context for Claude Code users
- `.env.example` - Template for environment variables (NO SECRETS)

**`/docs` Directory:**

- `SECURITY_AUDIT_REPORT.md` - Security practices and patterns
- `NEW_SESSION_INSTRUCTIONS.md` - Claude Code setup guide
- `DOCUMENTATION_GUIDE.md` - This file
- Any other guides useful for collaborators

### ❌ GITIGNORE These (Personal or secret)

- `.mcp.json` - Contains your Supabase credentials
- `.env` - Contains actual secret keys
- Personal notes or scratch files
- Any file with actual credentials or API keys

---

## Documentation Conventions

### Root-Level Files

**README.md** - The main entry point for new developers

- Project overview
- Setup instructions
- Development commands
- Deployment guide
- Links to other docs

**.claude.md** - Context for Claude Code

- Project architecture
- Code conventions
- Tech stack details
- Development patterns
- Things Claude should know

**.env.example** - Environment variable template

- All required environment variables
- Placeholder values (NEVER real secrets)
- Comments explaining where to get values
- Links to relevant dashboards

### `/docs` Directory

Additional documentation that supports the README:

**SECURITY_AUDIT_REPORT.md**

- Security audit findings
- Best practices
- Common pitfalls to avoid
- How the security model works

**NEW_SESSION_INSTRUCTIONS.md**

- Claude Code setup guide
- Testing instructions
- MCP server configuration
- Post-setup verification

**Other Potential Docs:**

- `ARCHITECTURE.md` - System architecture diagrams
- `API.md` - API endpoint documentation
- `DEPLOYMENT.md` - Detailed deployment procedures
- `TROUBLESHOOTING.md` - Common issues and solutions

---

## Writing Documentation

### Best Practices

1. **Keep README concise** - Link to `/docs` for deep dives
2. **Use code blocks** - Show, don't just tell
3. **Include examples** - Real-world usage examples
4. **Link between docs** - Create a web of documentation
5. **Update as you go** - Don't let docs get stale

### Markdown Formatting

```markdown
# Main Heading (H1) - One per document

## Section Heading (H2)

### Subsection (H3)

**Bold** for emphasis
`code` for inline code
```

Code blocks for multi-line code

```

- Bullet lists
- For items

[Links](./other-doc.md) to other documentation
```

### Code Examples

Always include:

- Language identifier in code blocks
- Context about what the code does
- Any necessary setup or prerequisites

---

## Documentation Lifecycle

### When to Create New Docs

Create a new doc in `/docs` when:

- Topic is too detailed for README
- Information is reference material (vs. getting started)
- Content is specific to a workflow (like Claude Code)
- Security or architecture deep-dive needed

### When to Update Existing Docs

Update documentation when:

- Adding new features or dependencies
- Changing setup requirements
- Fixing errors or outdated information
- Adding new environment variables
- Changing deployment process

### When to Delete Docs

Delete or archive when:

- Information is completely outdated
- Feature was removed
- Doc was temporary (like onboarding guides after onboarding)

---

## Claude Code & Documentation

### Why `.claude.md` is Important

`.claude.md` serves as the "system prompt" for Claude when working on your project. It should contain:

- Project purpose and context
- Architecture decisions
- Code conventions
- File organization patterns
- Security considerations
- Deployment information

**This file makes Claude more effective** - keep it updated!

### AI-Assisted Documentation

Claude Code can help with documentation:

- "Update the README with the new deployment process"
- "Add this new environment variable to .env.example"
- "Explain how the webhook flow works in ARCHITECTURE.md"
- "Review the documentation for outdated information"

---

## Version Control Best Practices

### Commit Messages for Docs

```bash
# Good commit messages
git commit -m "docs: add Stripe webhook setup to README"
git commit -m "docs: update .env.example with new Supabase variables"
git commit -m "docs: create ARCHITECTURE.md for system overview"

# Less helpful
git commit -m "update docs"
git commit -m "fix typo"
```

### When to Commit

Commit documentation changes:

- With the feature they document (atomic commits)
- As soon as you clarify something confusing
- When onboarding reveals gaps
- Immediately after fixing security issues

---

## Documentation Review Checklist

Before committing documentation, verify:

- [ ] No secrets or credentials included
- [ ] Links work (especially to other docs)
- [ ] Code examples are tested and accurate
- [ ] Instructions are step-by-step and complete
- [ ] Formatting renders correctly (preview in GitHub/editor)
- [ ] References to project-specific values are placeholders
- [ ] Commands include expected output or results

---

## Questions About Documentation?

Ask Claude Code:

- "What should I document about this new feature?"
- "Is this the right place for this information?"
- "Review this documentation for clarity"
- "Should this go in README or a separate doc?"

---

**Remember**: Good documentation is a force multiplier for your team. The time spent writing it is repaid many times over in reduced onboarding time and fewer questions!
