interface HardSkill {
  name: string;
  description: string;
  icon: string;
}

const hardSkills: HardSkill[] = [
  {
    name: "LLM & AI Agent Prompting",
    description: "Built modular Trust & Safety LLM system with 95%+ accuracy and Spanish support AI",
    icon: "tools-fill"
  },
  {
    name: "Helpdesk Software",
    description: "6+ years using macros, rules, and advanced features for customer support",
    icon: "message-2-fill"
  },
  {
    name: "Workflow Automation",
    description: "Expert in Zapier, n8n, webhooks, and API integrations connecting multiple platforms",
    icon: "group-fill"
  },
  {
    name: "Technical Training & Documentation",
    description: "Created comprehensive Notion training materials and interactive tools for team adoption",
    icon: "time-fill"
  },
  {
    name: "HTML/CSS & Web Development",
    description: "Built custom report builder and full-stack SaaS platforms including Groovi (groovi.cc)",
    icon: "astro_dark"
  },
  {
    name: "Data Analysis & Reporting",
    description: "Support metrics analysis, visualization creation, and identifying patterns in customer data",
    icon: "mongodb"
  }
];

export default hardSkills;