/**
 * Interface representing work experience details.
 *
 * @property {string} title - The job title of the position.
 * @property {string} startDate - The start date of the position in the format YYYY-MM-DD.
 * @property {string} [endDate] - The end date of the position in the format YYYY-MM-DD.
 *                                Optional, can be omitted if the position is current.
 * @property {string} company - The name of the company where the position was held.
 * @property {string} location - The geographic location of the company (e.g., city, state, country).
 * @property {string} description - A brief description of the roles and responsibilities
 *                                   associated with the position.
 * @property {string[]} goals - A list of professional goals achieved or targeted during the position.
 * @property {boolean} currentJob - Indicates whether the position is the current job.
 */
interface WorkExperience {
    title: string;
    startDate: string;
    endDate?: string;
    company: string;
    location: string;
    description: string;
    goals: string[];
    currentJob: boolean;
}

/**
 * Represents an array of work experiences.
 *
 * Each work experience object contains details about
 * a job position including the title, start and end dates,
 * company name, job location, description of the role,
 * a list of goals or achievements, and a flag indicating
 * if it is the current job.
 *
 * @type {Array<Object>}
 * @property {string} title - The job title.
 * @property {string} startDate - The start date of the job in YYYY-MM-DD format.
 * @property {string} [endDate] - The end date of the job in YYYY-MM-DD format. Optional for current jobs.
 * @property {string} company - The name of the company.
 * @property {string} location - The location of the job.
 * @property {string} description - A brief description of the job responsibilities.
 * @property {Array<string>} goals - A list of goals or achievements within the job.
 * @property {boolean} currentJob - A flag indicating if the job is the current one.
 */
const workExperience:WorkExperience[] = [
    // {
    //     title: "Customer Support Agent → Support Operations Specialist Applicant",
    //     startDate: "2019-12-01",
    //     company: "Planning Center",
    //     location: "Remote (Carlsbad, CA)",
    //     description: "6+ years supporting 50,000+ churches worldwide while building AI systems and automation workflows that solve team-wide challenges. Currently applying for Support Operations Specialist role to formalize my expertise in workflow automation, AI chatbot implementation, and technical training.",
    //     goals: [
    //         "Built Spanish Support AI system transforming zero Spanish capacity into full multilingual service coverage",
    //         "Engineered modular Trust & Safety LLM architecture with 95%+ intent classification accuracy and 40-50% auto-resolution",
    //         "Created custom report builder enabling team to handle 'technically impossible' HTML/Liquid coding requests",
    //         "Trained entire support team on AI productivity workflows including ChatGPT systems and automation tools",
    //         "Developed comprehensive Notion documentation and interactive training reducing team onboarding time",
    //         "Proposed Front macro integration with n8n webhooks to streamline bug report submission workflow"
    //     ],
    //     currentJob: true,
    // },
    // {
    //     title: "Full-Stack Business Systems Architect (Side Business)",
    //     startDate: "2023-01-01",
    //     company: "Groovy Marketing",
    //     location: "Bakersfield, CA (Remote)",
    //     description: "Building complete business automation systems while maintaining full-time Planning Center role. Specializing in CRM implementation, AI chatbot deployment, and workflow automation for service businesses.",
    //     goals: [
    //         "Built and shipped Groovi QR/NFC SaaS platform (groovi.cc) demonstrating full-stack development capabilities",
    //         "Implemented GoHighLevel CRM automation systems with multi-channel campaigns and intelligent routing",
    //         "Deployed AI booking chatbots achieving 30-50% conversion increases and 40% reduction in missed leads",
    //         "Created production websites with conversion optimization and lead capture integration",
    //         "Developed training materials and troubleshooting guides reducing client support requests 40%"
    //     ],
    //     currentJob: true,
    // }
];
export default workExperience;