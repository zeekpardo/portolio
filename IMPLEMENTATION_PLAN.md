# Portfolio Customization Implementation Plan
## Zeek Pardo - Technical Operations & Automation Specialist

---

## Phase 1: Basic Information Update

### 1.1 Personal Information (`src/config.ts`)

**Current Template Values → New Values:**

```typescript
export const SITE = {
    website: "https://zeekpardo.dev", // Update when deployed
    title: "Zeek Pardo - Technical Operations Specialist",
    description: "Full-Stack Business Systems Architect | AI Automation Expert",
    tags: ["portfolio", "automation", "AI systems"],
    ogImage: "/og-image.webp",
    logo: "logo",
    logoText: "ZeekPardo",
    lang: "en",
    favicon: "/favicon.png",
    repository: "https://github.com/zeekpardo/portfolio",
    author: "Zeek Pardo",
    profile: "https://www.linkedin.com/in/zeekpardo/",
}

export const ME = {
    name: "Zeek Pardo",
    profession: "Technical Operations & Automation Specialist | AI Systems Architect",
    profileImage: "zeek-avatar.png", // New image needed
    profileFacts: [
        {
            value: 6,
            description: "Years at Planning Center"
        },
        {
            value: 8,
            description: "AI Systems Built"
        },
        {
            value: 12,
            description: "Organizations Automated"
        }
    ],
    contactInfo: {
        email: "zeekpardo@gmail.com",
        linkedin: "https://www.linkedin.com/in/zeekpardo",
        resumeDoc: "zeek-pardo-resume.pdf", // New resume needed
    },
    aboutMe: "I solve problems that slow people down by building actual systems that make friction disappear. From scaling Spanish support from zero to full coverage using custom AI, to architecting automation workflows for 500+ organizations, I turn 'we can't do that' into 'here's how.' My specialty is creating environments where people can do their best work while the repetitive parts fade into the background.",
}

export const SOCIALS = [
    {
        name: "Twitter",
        url: "https://x.com/groovizeek",
        icon: "twitter-x-fill",
        show: true
    },
    {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/zeekpardo",
        icon: "linkedin-fill", // Need to add this icon
        show: true
    },
    {
        name: "GitHub",
        url: "https://github.com/zeekpardo",
        icon: "github-fill",
        show: true
    },
    {
        name: "Email",
        url: "mailto:zeekpardo@gmail.com",
        icon: "message-2-fill",
        show: true
    }
]
```

### 1.2 Assets Needed
- **Profile Image:** Download from LinkedIn URL and save as `src/assets/zeek-avatar.png`
- **Resume:** Create updated resume as `public/zeek-pardo-resume.pdf`
- **LinkedIn Icon:** Add to `src/icons/linkedin-fill.svg` if not present

---

## Phase 2: Projects Section Transformation

### 2.1 Remove Template Projects
**Files to modify:**
- `src/content/projects/finance-app.mdx` → Replace or remove
- `src/content/projects/pro-accountant.mdx` → Replace or remove
- `src/content/projects/images/` → Clean up template images

### 2.2 Create New Project Showcases

#### Project 1: Planning Center Application Showcase
**File:** `src/content/projects/planning-center-application.mdx`

```mdx
---
title: Planning Center Support Operations Application
summary: Comprehensive application showcasing 6+ years of technical operations excellence, AI system building, and automation expertise at Planning Center.
tags:
    - AI Systems
    - Automation
    - Support Operations
    - Spanish Localization
    - LLM Engineering
startDate: 2024-11-01
endDate: 2024-11-24
author: Zeek Pardo
url: https://planningcenter.com/careers
cover: './images/planning-center/cover.webp'
ogImage: './images/planning-center/og-cover.webp'
---

## Application Highlights

This application demonstrates my evolution from support agent to technical operations specialist, building AI systems that scale multilingual support and automate complex workflows.

### Key Achievements

**Spanish Support Scaling**
- Built custom AI translation system with terminology guardrails
- Scaled from zero Spanish capacity to full multilingual service
- 100% team adoption without additional hiring

**AI Automation Systems**
- Bug Report GPT: Automated engineering handoffs
- Custom Report Builder: Made "impossible" requests achievable
- Support Chatbots: Customer-ready AI responses

**Process Innovation**
- Modular Trust & Safety LLM architecture
- 40-50% auto-resolution rate for T&S tickets
- $1,799 monthly savings through intelligent automation

### Technical Implementation Details

[Include detailed sections from the application about LLM prompt engineering, system architecture, and measurable business impact]
```

#### Project 2: AI Automation Portfolio
**File:** `src/content/projects/ai-automation-systems.mdx`

Focus on the Spanish Support AI, Custom GPTs, and automation workflows with technical details and measurable outcomes.

#### Project 3: Full-Stack Business Systems
**File:** `src/content/projects/groovi-platform.mdx`

Showcase Groovi QR/NFC platform and other full-stack projects mentioned in applications.

---

## Phase 3: About Section Integration

### 3.1 Update About Me Component
**File:** `src/components/AboutMeCC.astro`

**Strategy:** Replace template about section with condensed version of Planning Center cover letter, focusing on:
- Problem-solving philosophy
- System-building approach
- Key achievements and impact
- Technical expertise

**Content Structure:**
1. **Opening Hook:** "I solve problems that slow people down..."
2. **Core Philosophy:** Building systems that make friction disappear
3. **Key Examples:** Spanish support scaling, AI automation
4. **Unique Value:** From support trenches to technical architecture

---

## Phase 4: Skills and Experience Updates

### 4.1 Update Skills Data Files

#### Hard Skills (`src/data/hardSkills.ts`)
```typescript
const hardSkills = [
    {
        name: "AI System Architecture",
        description: "Building modular LLM systems for complex business workflows",
        icon: "ai-icon"
    },
    {
        name: "GoHighLevel",
        description: "Expert-level CRM automation and multi-channel campaign design",
        icon: "ghl-icon"
    },
    {
        name: "Planning Center API",
        description: "6+ years architecting automation for 500+ organizations",
        icon: "planning-center-icon"
    },
    {
        name: "Full-Stack Development",
        description: "AI-assisted development, Astro.build, modern web stack",
        icon: "astro_dark"
    },
    {
        name: "Spanish Localization",
        description: "Custom AI translation systems with terminology guardrails",
        icon: "translation-icon"
    }
]
```

#### Soft Skills (`src/data/softSkills.ts`)
```typescript
const softSkills = [
    {
        name: "System Thinking",
        icon: "tools-fill"
    },
    {
        name: "Process Automation",
        icon: "group-fill"
    },
    {
        name: "Technical Training",
        icon: "time-fill"
    },
    {
        name: "Cross-Cultural Communication",
        icon: "message-2-fill"
    }
]
```

### 4.2 Update Experience Data (`src/data/Jobs.ts`)
```typescript
const workExperience = [
    {
        title: "Technical Operations & Automation Specialist",
        startDate: "2019-12-01",
        endDate: "",
        company: "Planning Center",
        location: "Remote (Carlsbad, CA)",
        description: "Evolved from support to technical operations, architecting AI systems and automation workflows for 50,000+ organizations.",
        goals: [
            "Built Spanish support AI system scaling multilingual service from zero to full coverage",
            "Architected modular Trust & Safety LLM system with 40-50% auto-resolution rate",
            "Created bug report automation reducing engineering handoff time by 75%",
            "Trained entire support team on AI productivity workflows",
            "Built custom report builder enabling 'technically impossible' customer requests"
        ],
        currentJob: true,
    },
    {
        title: "Full-Stack Business Systems Architect",
        startDate: "2023-01-01",
        endDate: "",
        company: "Groovy Marketing",
        location: "Bakersfield, CA (Remote)",
        description: "Building complete business systems for service companies and SaaS products from concept to production.",
        goals: [
            "Built and shipped Groovi QR/NFC SaaS platform (groovi.cc)",
            "Implemented GoHighLevel CRM systems for 8+ businesses",
            "Deployed AI booking chatbots increasing conversions by 30-50%",
            "Created production websites with conversion optimization"
        ],
        currentJob: true,
    }
]
```

---

## Phase 5: Blog Integration

### 5.1 Create Application-Based Blog Posts

#### Post 1: Technical Implementation Deep Dive
**File:** `src/content/posts/spanish-support-ai-system.md`
- Detailed technical breakdown of Spanish support AI
- System architecture and prompt engineering
- Business impact and lessons learned

#### Post 2: LLM Automation Case Study
**File:** `src/content/posts/trust-safety-llm-architecture.md`
- Modular bot architecture approach
- Cost efficiency and accuracy improvements
- Implementation methodology

---

## Phase 6: Visual Assets and Branding

### 6.1 Image Assets Needed
- **Profile photo:** Professional headshot from LinkedIn
- **Project screenshots:** Groovi platform, AI system interfaces
- **Cover images:** For each project showcase
- **Icons:** Custom icons for specialized skills

### 6.2 Color Scheme Considerations
- Professional but approachable
- Tech-forward aesthetic
- Maintain accessibility standards

---

## Implementation Timeline

### Week 1: Foundation
- [ ] Update `src/config.ts` with personal information
- [ ] Add profile image and resume
- [ ] Update social media links

### Week 2: Content Creation
- [ ] Create Planning Center application project
- [ ] Write AI automation systems project
- [ ] Update About section with cover letter content

### Week 3: Technical Content
- [ ] Update skills and experience data
- [ ] Create technical blog posts
- [ ] Add project images and assets

### Week 4: Polish and Deploy
- [ ] Review all content for consistency
- [ ] Optimize images and performance
- [ ] Deploy to production
- [ ] Test all links and functionality

---

## Success Metrics

### Portfolio Effectiveness
- [ ] Clear value proposition on first view
- [ ] Technical expertise demonstrated through real projects
- [ ] Professional presentation of application materials
- [ ] Strong SEO for relevant technical operations keywords

### Content Quality
- [ ] Cover letter content engaging and persuasive
- [ ] Technical implementations clearly explained
- [ ] Measurable business impact highlighted
- [ ] Professional yet personal tone maintained

---

## Next Steps

1. **Approve this plan** - Review and confirm approach
2. **Gather assets** - Collect images, resume, additional content
3. **Begin implementation** - Start with Phase 1 basic information updates
4. **Iterate and refine** - Adjust based on results and feedback

This implementation transforms the template from a generic portfolio into a specialized showcase of technical operations expertise, positioning you as a unique candidate who builds systems that solve real business problems.