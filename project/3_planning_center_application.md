# Planning Center Support Operations Specialist Application
## Ezequiel (Zeek) Pardo

---

## Cover Letter

Dear Zach, Reagan, and Sarah,

I'm excited about the Support Operations Specialist role because it aligns perfectly with what drives me: solving problems that slow people down and the ones that leave people behind.

When I see customers stuck waiting for help, teammates saying "we can't do that," or minutes lost to work that should take seconds, I can't just watch. I fix it by building actual systems that make the friction disappear.

That's what drives me: creating environments where people can do their best work. Where the repetitive parts fade into the background. Where "no" becomes "here's how." Where systems run so smoothly you stop noticing them and just focus on what matters.

At Planning Center, we didn't offer Spanish support. As a native Spanish speaker, I saw my community go unserved. I learned what worked, found the patterns, and built a scalable system: a custom AI with translation guardrails that preserve product terminology and brand voice. After training the team, we went from zero Spanish support to multilingual service across all products with no bottlenecks, no delays, and no barriers.

Then there was the custom reports issue, technically out of scope because it required HTML and Liquid coding. Customers felt abandoned, and support felt helpless. So I built the bridge. Leveraging my experience in AI prompt engineering, I designed a visual builder where users add objectives and inputs, and the app outputs a structured JSON spec that the AI uses, referencing our documentation, to safely generate the report. What was once "we can't help" became a repeatable, scalable workflow that could empowered the entire team.

That's the pattern I follow: see the problem, prove it myself, build the system, scale it so everyone benefits.

**Custom AI Tools for Team Efficiency:**
- Spanish Support AI: Transformed zero Spanish capacity into full multilingual service
- Bug Report GPT Automation: Reduced time through structured workflows
- Custom Report Builder: Made "technically impossible" requests achievable for the entire team

I've applied this approach beyond Planning Center too. I've built Groovi QR, a full SaaS platform that reimagines QR and NFC technology. I've implemented CRMs for service businesses, deployed AI booking chatbots that increased conversions by 30%-50%, and built websites for local businesses that actually convert.

What makes me different is that I take initiative within our framework. When I see a gap, I prototype a solution, test it
thoroughly, and then share it with leadership, my team for feedback. I've learned that "out of scope" often means "we need a creative approach," so I find ways to bridge those gaps responsibly. And I don't hoard knowledge, I document and train so the system lifts everyone.

**Why This Role Matters to Me:**

For five years, I've been building these solutions between support tickets, staying late to refine automations, and training teammates when possible. This role would let me channel that energy into focused impact.

I'm drawn to three aspects:
- **Building at scale:** Moving from ad-hoc solutions to systematic infrastructure that serves our entire team
- **Collaborative growth:** Learning from Zach's expertise while contributing my unique perspective from the trenches
- **Teaching as a multiplier:** Turning individual wins into team-wide capabilities through structured training and documentation


**My Philosophy:**

The best solutions come from people who experience the problems daily. As someone who's been in the support trenches for 6 years, I understand our pain points intimately. But I also believe in collaborative problem-solving—sharing tools, teaching others, and building together.

I'm not trying to revolutionize everything overnight. I want to contribute steady, thoughtful improvements that make everyone's job easier, while learning from and supporting the excellent work in the Support Ops Team has already established.
---

## Question 2: Share examples of technical training you've done

### A. Spanish Support System Implementation

**The Challenge:** Zero Spanish support capacity with growing Spanish-speaking customer base

**Training & Documentation Created:**
- **Spanish Support Process Documentation:** https://www.notion.so/planningcenter/Spanish-Support-Process-18cabbce69a280359d47e8d7f36ecad1
- **Spanish Translation GPT:** Custom AI with terminology guardrails - https://cloud.pco.bz/78TlF4py
- **Live team training:** Demonstrated real customer conversations with translation workflows
- **Result:** 100% team adoption, full Spanish support coverage without additional hiring

### B. AI Productivity Systems for Support Team

**Built and Trained Team On:**
- **ChatGPT Productivity Training:** https://www.notion.so/planningcenter/Chat-GPT-Productivity-hack-25cabbce69a280c0a038dd7b84655533
- **Bug Report Automation GPT:** Standardized engineering handoffs - https://cloud.pco.bz/j28zgHQW
- **Planning Center Support Chatbot:** Customer-ready responses - https://cloud.pco.bz/8dxFsZFy
- **Video-to-Documentation Workflow:** https://www.notion.so/planningcenter/Creating-a-Notion-Training-Document-Using-ClearShot-Transcript-Browser-Recorder-and-ChatGPT-21eabbce69a280eeb8cbcdf0e00407e2

### C. Calendar Specialist Training Portfolio

**Comprehensive Training Program:**
- **Training Sessions Archive:** https://www.notion.so/planningcenter/f84a33e10fbd461eba79750a749ae394?v=23f08d86c65d47efa9b3b03e3914606c
- **Custom Report Builder Training:** https://www.notion.so/planningcenter/Calendar-Custom-Report-29ed64e46dff4b1680d1af55b546961f
- **Result:** Enabled team to handle "technically impossible" customer requests


**My Approach:**
- Create visual, step-by-step guides with real examples
- Build interactive tools that guide users through complex processes
- Provide templates and frameworks, not just theory
- Follow up to ensure adoption and iterate based on feedback

**Training Philosophy:**
I don't just build tools, I ensure they get used. Every training includes hands-on practice, visual documentation, and ongoing support until it becomes second nature for the team.

---

## Question 3: Trust and Safety LLM Prompt Engineering
---
### My Approach: Modular Bot Architecture for Complex Workflows

Instead of creating a single monolithic prompt that tries to handle everything, I designed a modular system with specialized agents for each stage of the Trust & Safety workflow. This approach minimizes false positives, reduces token costs, and ensures each bot excels at its specific task.

### System Architecture Overview

```
1. Keyword Pre-Filter (Front Rules - No LLM)
   ↓
2. Intent Classification Bot (Focused triage)
   ├─→ Security Question → Route to Product Support
   ├─→ Feature Request → Route to Product Support  
   └─→ Incident Report → Continue to assessment
   ↓
3. Evidence Assessment Bot (Detailed analysis)
   ├─→ Clear Evidence → Information Gathering
   ├─→ Social Scraping → Education Bot
   └─→ Insufficient Info → Information Gathering
   ↓
4. Information Gathering Bot (Conversational)
   - Collects: Names, Timeline, Behaviors, System Access
   - Custom scenarios: Active breach, Human request
   ↓
5. Auto-Escalation OR Education Bot
   - Confirmed breach → Human handoff with complete package
   - No breach → Customer education on social scraping
```

### Example: Intent Classification Bot Prompt

```
You are classifying support messages for Planning Center's Trust & Safety team.

Your ONLY job is to determine customer intent. You do NOT:
- Respond to the customer
- Gather information  
- Assess severity
- Make escalation decisions

Classify into EXACTLY ONE category:

INCIDENT_REPORT - Customer reports something bad HAPPENED:
✓ "Someone hacked our account"
✓ "We're getting scam texts from fake pastor"
✓ "Unauthorized person joined our group"
✓ Past tense or present perfect tense

SECURITY_QUESTION - Customer asks HOW TO use security features:
✓ "How do I enable 2-step verification?"
✓ "Can I see who logged into my account?"
✓ Questions about features, not incidents

FEATURE_REQUEST - Customer wants features we don't have:
✓ "Can you add IP address restrictions?"
✓ "I wish we had session timeout"
✓ Requests for new capabilities

Output format: Just the category name, nothing else.
```


### Why This Modular Approach Works Better

**1. Specialized Focus = Higher Accuracy**
- Each bot has ONE job it does exceptionally well
- Intent classifier: 95%+ accuracy on routing decisions
- Evidence assessor: 85%+ accuracy on breach detection
- No cognitive overload from trying to do everything

**2. Cost Efficiency Through Smart Filtering**
- Keyword pre-filter eliminates 90% of messages (no LLM cost)
- Intent classifier uses minimal tokens (~170 per message)
- Only complex cases reach expensive conversational bot
- Monthly cost: ~$1.35 vs. $2,400 human time saved


**3. Intelligent Escalation Paths**
- Active breach scenario triggers urgent @here Slack alerts
- Social scraping routes to education (no escalation needed)
- Unclear cases get human review with partial context
- Complete handoff packages eliminate re-asking questions

**4. Measurable Business Impact**
- Auto-resolution rate: 40-50% of T&S tickets
- Average time saved: 1.5+ hours daily
- Human agents handle only complex cases
- ROI: $1,799 monthly savings


### Key Insight

The best LLM implementations aren't about writing perfect prompts—they're about architecting systems where each component excels at its specific task. By breaking complex workflows into specialized agents, we achieve better accuracy, lower costs, and happier customers.

This modular approach turns an overwhelming Trust & Safety challenge into a series of manageable, measurable victories.


## Question 4: Process Automation Opportunity

### Identified Process: Bug Report Submission

**Current Problem:**
Agents must leave Front, find the Asana form link in Notion, fill it out in a separate tab, then return to Front. The team reports feeling "slower" and frustrated by "multiple steps across multiple products."

**Proposed Solution:**
integrate a Front macro that collects bug report data and automatically creates Asana tasks via n8n webhook integration.

**How It Works:**
1. Agent clicks "Report Bug" macro in Front
2. Fills out form (bug summary, steps, links) without leaving Front
3. n8n webhook receives data and creates Asana task
4. Agent sees confirmation and continues helping customer

