# Trust & Safety Auto-Escalation Decision Flow Map
## Complete Implementation Guide for Chatbot Builder

---

## System Architecture Overview

```
Front Message Received
    ↓
┌─────────────────────────────────────┐
│ Step 1: Keyword Pre-Filter (Front) │
│ (No LLM - Rules-based)              │
└─────────────┬───────────────────────┘
              │
              ├─→ NO KEYWORDS → Route to Standard Support
              │
              ↓ KEYWORDS DETECTED
┌─────────────────────────────────────┐
│ Step 2: Intent Classification Bot   │
│ (Small LLM Call - Focused Prompt)   │
└─────────────┬───────────────────────┘
              │
              ├─→ SECURITY_QUESTION → Route to Product Support
              ├─→ FEATURE_REQUEST → Route to Product Support
              │
              ↓ INCIDENT_REPORT
┌─────────────────────────────────────┐
│ Step 3: Evidence Assessment Bot     │
│ (Detailed LLM Analysis)             │
└─────────────┬───────────────────────┘
              │
              ├─→ NO_EVIDENCE → Education Bot
              │
              ↓ EVIDENCE_FOUND
┌─────────────────────────────────────┐
│ Step 4: Information Gathering Bot   │
│ (Conversational - Multiple Turns)   │
└─────────────┬───────────────────────┘
              │
              ↓
┌─────────────────────────────────────┐
│ Step 5: Auto-Escalation Actions     │
│ (Tags, Slack, Handoff Package)      │
└─────────────────────────────────────┘
```

---

## STEP 1: Keyword Pre-Filter (Front Rules)

### Configuration Type: Front Rules (No Chatbot)

**Rule Name:** T&S Keyword Detection

**Trigger Conditions:**
```
Message received
AND
Body contains ANY of:
  - "hacked"
  - "compromised" 
  - "breach"
  - "unauthorized access"
  - "suspicious activity"
  - "scam" OR "scammy"
  - "bad actor"
  - "profile takeover"
  - "unauthorized login"
  - "suspicious profiles"
  - "suspicious group"
  - "unauthorized changes"
  - "someone else"
  - "didn't make"
  - "wasn't me"
```

**Actions:**
1. Add tag: `ts-auto-scan-required`
2. Trigger: Intent Classification Bot

**Decision Point:**
```
IF keywords detected
  → Apply tag, trigger Bot 2
ELSE
  → Route to standard support (no T&S involvement)
```

**Logging:**
```
LOG: Keyword filter triggered
- Matched keywords: [list]
- Message ID: {{message_id}}
- Next step: Intent Classification Bot
```

---

## STEP 2: Intent Classification Bot

### Bot Configuration

**Bot Name:** T&S Intent Classifier

**Trigger:** Tag `ts-auto-scan-required` applied to conversation

**Persona Settings:**
- Name: Intent Classifier
- Response Delay: 0s (internal only, no customer response)
- AI Typos: 0%
- Breakup Messages: 0%

**Why This Conversation is Happening:**
```
This message triggered our Trust & Safety keyword detection. We need to 
determine if the customer is reporting an incident that occurred, or asking 
a question about security features.
```

**Important Business Information:**
```
You are classifying support messages for Planning Center's Trust & Safety team.

Your ONLY job is to determine customer intent. You do NOT:
- Respond to the customer
- Gather information
- Assess severity
- Make escalation decisions

You ONLY classify intent into one of three categories.
```

---

### Job Flow: Intent Classification

**Objective 1: Classify Customer Intent**

```
Title: Determine Message Intent
Short Description: determine whether this is an incident report, security question, or feature request
Max Attempts: 1
Sensitivity: 70
Output Variable: {{custom_intent_category}}

Extra Prompt:
Classify into EXACTLY ONE category:

INCIDENT_REPORT - Customer reports something bad HAPPENED:
✓ "Someone hacked our account"
✓ "We're getting scam texts from fake pastor"
✓ "Unauthorized person joined our group"
✓ "I see logins I didn't make"
✓ "Suspicious profiles were created"
✓ "My profile was changed and I didn't do it"
✓ Past tense or present perfect tense (happened, was compromised, got hacked)

SECURITY_QUESTION - Customer asks HOW TO use security features:
✓ "How do I enable 2-step verification?"
✓ "What are best practices for passwords?"
✓ "Can I see who logged into my account?"
✓ "How do I check Security History?"
✓ "What permissions should I give?"
✓ Questions about features, not reporting incidents

FEATURE_REQUEST - Customer wants security features we don't have:
✓ "Can you add a way to log out all devices?"
✓ "I wish we had session timeout"
✓ "Can you build IP address restrictions?"
✓ Requests for capabilities that don't exist

Classify based on PRIMARY intent. If they mention an incident AND ask 
questions, classify as INCIDENT_REPORT.

Output format: Just the category name, nothing else.
```

---

### Switch: Route Based on Intent

```
Left Value: {{custom_intent_category}}
Operator: equals

Case 1: "SECURITY_QUESTION"
  ↓
  Action: Add tag "security-how-to-question"
  Action: Remove tag "ts-auto-scan-required"
  Action: Internal Note "Auto-classified as security feature question. 
          Routing to Product support. Customer asked: {{message_body}}"
  Action: Turn Agent Off (routes to Product queue)
  End Flow

Case 2: "FEATURE_REQUEST"
  ↓
  Action: Add tag "security-feature-request"
  Action: Remove tag "ts-auto-scan-required"
  Action: Internal Note "Auto-classified as feature request. 
          Routing to Product support. Customer requested: {{message_body}}"
  Action: Turn Agent Off (routes to Product queue)
  End Flow

Case 3: "INCIDENT_REPORT"
  ↓
  Action: Add tag "ts-incident-reported"
  Action: Internal Note "Intent classified as incident report. 
          Proceeding to evidence assessment."
  Continue to: Evidence Assessment Bot (Step 3)

Default (None match):
  ↓
  Action: Add tag "intent-unclear"
  Action: Internal Note "Could not clearly classify intent. 
          Sending to human triage."
  Action: Turn Agent Off (routes to general support for human review)
  End Flow
```

**Logging:**
```
LOG: Intent Classification Complete
- Intent: {{custom_intent_category}}
- Confidence: [from LLM]
- Message body: {{message_body}}
- Routing decision: [Product | Evidence Assessment | Human Triage]
- Processing time: [timestamp]
```

---

## STEP 3: Evidence Assessment Bot

### Bot Configuration

**Bot Name:** T&S Evidence Assessor

**Trigger:** Tag `ts-incident-reported` applied

**Persona Settings:**
- Name: Evidence Assessor
- Response Delay: 0s (internal only)
- AI Typos: 0%
- Breakup Messages: 0%

**Why This Conversation is Happening:**
```
The customer has reported a potential security incident. We need to assess 
whether there is clear evidence of a Planning Center breach/takeover, or if 
this appears to be social engineering from public information.

Customer: {{contact.name}}
Organization: {{contact.organization_name}}
Previous T&S tickets: {{contact.ts_ticket_count}}
Message: {{message_body}}
```

**Important Business Information:**
```
You are assessing evidence for Planning Center's Trust & Safety team.

Your ONLY job is to evaluate if there's evidence of a Planning Center breach.

Clear evidence of PC breach:
- Specific profiles compromised within Planning Center
- Unauthorized changes made in PC products
- Suspicious logins in Security History
- Unauthorized group access/joins
- Unauthorized directory exports
- Messages sent FROM Planning Center

NOT evidence of PC breach:
- Scam texts/emails with no PC system involvement
- Information available on social media
- Church website directory scraped
- Publicly available information used

You do NOT respond to customers or gather information yet.
```

---

### Job Flow: Evidence Assessment

**Objective 1: Evaluate Evidence Level**

```
Title: Assess Evidence Strength
Short Description: determine whether or not there is clear evidence of Planning Center breach or compromise
Max Attempts: 1
Sensitivity: 75 (fairly strict)
Output Variable: {{custom_evidence_level}}

Extra Prompt:
Analyze the message for evidence of Planning Center breach.

CLEAR_EVIDENCE indicators:
✓ Customer names specific profiles that were compromised IN Planning Center
✓ Mentions unauthorized changes to PC profiles, groups, or settings
✓ References Security History showing suspicious logins
✓ Describes unauthorized access to Planning Center features
✓ Mentions messages sent THROUGH Planning Center systems
✓ Reports data exports or directory access they didn't authorize
✓ Describes profile takeovers within PC

LIKELY_SOCIAL_SCRAPING indicators:
✓ Scam texts/emails but no mention of PC system access
✓ Information that could come from social media
✓ Church website or public directory information
✓ Generic phishing with no PC-specific details
✓ Vague concerns without specific PC breach indicators

INSUFFICIENT_INFO indicators:
✓ Very brief message without details
✓ Just says "hacked" with no specifics
✓ Unclear what system was involved
✓ Need more information to assess

Classify as: CLEAR_EVIDENCE | LIKELY_SOCIAL_SCRAPING | INSUFFICIENT_INFO
```

**Objective 2: Calculate Confidence Score**

```
Title: Confidence Assessment
Short Description: determine how confident you are in the evidence assessment
Max Attempts: 1
Sensitivity: 60
Output Variable: {{custom_confidence_score}}

Extra Prompt:
On a scale of 0-10, how confident are you in your evidence assessment?

10 = Absolutely certain (explicit PC breach details provided)
7-9 = Very confident (strong indicators present)
4-6 = Moderately confident (some indicators but not definitive)
1-3 = Low confidence (vague or unclear)
0 = Cannot assess

Output: Single number 0-10
```

---

### Switch: Route Based on Evidence

```
Left Value: {{custom_evidence_level}}
Operator: equals

Case 1: "CLEAR_EVIDENCE"
  ↓
  Branch: Check Confidence
    Left Value: {{custom_confidence_score}}
    Operator: greater than or equal
    Right Value: 6
    
    → TRUE (High confidence):
      Action: Add tag "ts-evidence-confirmed"
      Action: Internal Note "Evidence Assessment: CLEAR EVIDENCE of PC breach
              Confidence: {{custom_confidence_score}}/10
              Details: {{message_body}}
              Proceeding to information gathering."
      Continue to: Information Gathering Bot (Step 4)
    
    → FALSE (Low confidence):
      Action: Add tag "ts-evidence-uncertain"
      Action: Internal Note "Evidence suggests breach but confidence is low.
              Sending to human review."
      Action: Turn Agent Off (human triage)
      End Flow

Case 2: "LIKELY_SOCIAL_SCRAPING"
  ↓
  Action: Add tag "ts-likely-social-scraping"
  Action: Internal Note "Evidence Assessment: No PC breach detected
          Likely social media scraping. Proceeding to education."
  Continue to: Education Bot (Step 5-Alt)

Case 3: "INSUFFICIENT_INFO"
  ↓
  Action: Add tag "ts-needs-more-info"
  Action: Internal Note "Insufficient information to assess evidence.
          Proceeding to information gathering."
  Continue to: Information Gathering Bot (Step 4)

Default:
  Action: Add tag "evidence-assessment-failed"
  Action: Internal Note "Evidence assessment did not return expected value.
          Sending to human review."
  Action: Turn Agent Off (human triage)
  End Flow
```

**Logging:**
```
LOG: Evidence Assessment Complete
- Evidence Level: {{custom_evidence_level}}
- Confidence Score: {{custom_confidence_score}}/10
- Assessment: [detailed reasoning]
- Routing decision: [Information Gathering | Education | Human Triage]
- Processing time: [timestamp]
```

---

## STEP 4: Information Gathering Bot

### Bot Configuration

**Bot Name:** T&S Information Gatherer

**Trigger:** Tag `ts-evidence-confirmed` OR `ts-needs-more-info` applied

**Persona Settings:**
- Name: Security Specialist
- Response Delay: 2-3 seconds
- AI Typos: 5%
- Breakup Messages: Medium
- How to Respond: "Don't be exclamatory with your responses. Try to sound 
  natural and not like a typical formal assistant. If personal things come 
  up while chatting, be sincere and engaged. Be methodical and thorough - 
  security incidents require careful investigation."

**Why This Conversation is Happening:**
```
{{contact.name}} from {{contact.organization_name}} has reported a potential 
security incident involving their Planning Center account.

Initial assessment: {{custom_evidence_level}}
Confidence: {{custom_confidence_score}}/10

We need to gather specific details to investigate and document this incident 
properly. The customer is concerned and needs our help.

Previous T&S tickets: {{contact.ts_ticket_count}}
This conversation started via: {{channel}}
```

**Important Business Information:**
```
You work for Planning Center's Trust & Safety team investigating a potential 
security incident.

Your role is to gather specific information needed to investigate:
- Names of affected profiles
- Timeline of when suspicious activity occurred
- Specific suspicious behaviors observed
- Whether this is still ongoing

You cannot directly access accounts or make changes. You are gathering 
information that will be used by our Trust & Safety specialists to 
investigate and resolve the issue.

Be empathetic but focused. Security incidents are stressful for customers.
```

---

### Job Flow: Information Gathering

**Objective 1: Gather Affected Profile Names**

```
Title: Get Affected Names
Short Description: determine the names of people whose profiles were compromised or who received suspicious communications
Max Attempts: 3
Sensitivity: 50
Output Variable: {{custom_affected_names}}
Skip if Not Blank: false

Extra Prompt:
We need specific names to investigate. Ask for:
- Full names of profiles that were compromised in Planning Center
- Names of congregants who received scam messages
- Usernames of suspicious profiles that joined groups
- Any other specific people involved

If they already mentioned names in their initial message, extract them.
Otherwise, ask professionally: "To help investigate, can you share the 
names of the people whose profiles were affected or who received the 
suspicious messages?"

Get as many specific names as possible. Names are critical for investigation.
```

**Objective 2: Establish Timeline**

```
Title: Get Incident Timeline
Short Description: determine when the suspicious activity started and when it was discovered
Max Attempts: 3
Sensitivity: 40 (flexible on exact times)
Output Variable: {{custom_incident_timeline}}
Skip if Not Blank: false

Extra Prompt:
We need to know when this happened. Ask for:
- When did they first notice the suspicious activity?
- When did congregants start receiving messages?
- When were suspicious profiles created or updated?
- Is this still actively happening right now?

Accept approximate times like "last Tuesday", "about a week ago", or 
"this morning".

If urgent (happening now), make note of that.

If they already mentioned timing, extract it. Otherwise ask: "When did 
you first notice this activity?"
```

**Objective 3: Document Suspicious Behaviors**

```
Title: Get Behavior Details
Short Description: determine what specific suspicious behaviors or activities were observed
Max Attempts: 3
Sensitivity: 50
Output Variable: {{custom_suspicious_behaviors}}
Skip if Not Blank: false

Extra Prompt:
Get specific details about what happened:
- What did the suspicious messages say?
- What changes were made to profiles (email, phone, password)?
- What group requests came through?
- Were there unauthorized logins from unfamiliar locations?
- Any unusual exports, directory access, or data viewing?
- Were messages sent FROM Planning Center or just external texts/emails?

The more specific, the better for investigation.

If they already described behaviors, extract them. Otherwise ask: 
"Can you describe what suspicious activity you observed? What specifically 
made you concerned?"
```

**Objective 4: Verify Planning Center Involvement**

```
Title: Confirm PC System Access
Short Description: determine whether or not the suspicious activity involved Planning Center systems directly
Max Attempts: 2
Sensitivity: 60
Output Variable: {{custom_pc_systems_accessed}}
Skip if Not Blank: false

Extra Prompt:
This is critical: We need to know if Planning Center systems were accessed.

Ask or determine:
- Were profile changes made INSIDE Planning Center?
- Did messages come FROM Planning Center (Groups messages, etc)?
- Or were they external texts/emails that mentioned church info?
- Can they see suspicious activity in Security History?
- Were there unauthorized logins to Planning Center accounts?

If external texts/emails only (no PC system access), this is likely 
social media scraping, not a PC breach.

If they describe PC system access, this is a confirmed breach.
```

---

### Branch: Reassess Evidence After Information Gathering

```
Use AI to Power Decision: YES

Description for AI:
Now that we've gathered detailed information, reassess the evidence.

Based on all information gathered:
- Affected names: {{custom_affected_names}}
- Timeline: {{custom_incident_timeline}}
- Behaviors: {{custom_suspicious_behaviors}}
- PC systems accessed: {{custom_pc_systems_accessed}}

Is this a confirmed Planning Center breach, or social media scraping?

BREACH if:
- PC profiles were compromised
- PC systems showed unauthorized access
- Changes made inside Planning Center
- Security History shows suspicious logins
- Messages sent FROM Planning Center

SOCIAL_SCRAPING if:
- Only external texts/emails (not through PC)
- No PC system access mentioned
- Info available on social media
- No profile changes in PC

Categorize as: CONFIRMED_BREACH | SOCIAL_SCRAPING | STILL_UNCLEAR

Threshold: 6
```

**Switch: Final Routing Decision**

```
Left Value: [AI Decision Result]

Case 1: "CONFIRMED_BREACH"
  ↓
  Continue to: Auto-Escalation Flow (Step 5)

Case 2: "SOCIAL_SCRAPING"
  ↓
  Continue to: Education Bot (Step 5-Alt)

Case 3: "STILL_UNCLEAR"
  ↓
  Action: Add tag "ts-needs-human-review"
  Action: Internal Note "After information gathering, evidence is still 
          unclear. Collected info:
          Names: {{custom_affected_names}}
          Timeline: {{custom_incident_timeline}}
          Behaviors: {{custom_suspicious_behaviors}}
          PC Access: {{custom_pc_systems_accessed}}
          
          Human agent needed to make final determination."
  Action: Send Slack Message to #trust-and-safety
          "Unclear T&S case needs review - Ticket {{ticket_id}}"
  Action: Turn Agent Off
  End Flow

Default:
  Action: Add tag "info-gathering-failed"
  Action: Internal Note "Information gathering did not complete successfully.
          Sending to human review."
  Action: Turn Agent Off
  End Flow
```

---

### Custom Scenarios (Active During Information Gathering)

**Custom Scenario 1: Active Breach Right Now**

```
Description: The contact mentions this is happening RIGHT NOW or they cannot access their account currently

Threshold: 4 (easy to trigger)
Priority: 1 (highest)

Sub-Flow Actions:
1. Action: Add Tag "active-breach-urgent"
2. Action: Send Slack Message
   To: #trust-and-safety
   Message: "@here ACTIVE BREACH in progress
            Organization: {{contact.organization_name}}
            Customer: {{contact.name}}
            Ticket: {{ticket_id}}
            
            Customer reports ongoing unauthorized access.
            Information gathered so far:
            - Names: {{custom_affected_names}}
            - Timeline: {{custom_incident_timeline}}
            - Behaviors: {{custom_suspicious_behaviors}}"
3. Action: Message to Customer
   "I understand this is urgent since it's happening right now. I'm alerting 
   our Trust & Safety team immediately for emergency response. Someone will 
   contact you within 1 hour.
   
   In the meantime, if you have admin access:
   1. Change passwords for affected accounts
   2. Enable two-step verification if not already enabled
   3. Review Security History: https://accounts.planningcenter.com/security-history
   
   Our team has been notified and is responding now."
4. Action: Turn Agent Off
5. End Flow
```

**Custom Scenario 2: Customer Requests Human**

```
Description: This contact is explicitly asking to chat with a human or expressing they need to speak with someone directly

Threshold: 4
Priority: 1

Sub-Flow Actions:
1. Action: Add Tag "human-requested"
2. Action: Internal Note "Customer requested human agent during info gathering.
           Information collected so far:
           - Names: {{custom_affected_names}}
           - Timeline: {{custom_incident_timeline}}
           - Behaviors: {{custom_suspicious_behaviors}}
           - PC Access: {{custom_pc_systems_accessed}}"
3. Action: Message "I understand you'd like to speak with someone directly. 
           I'm connecting you with a Trust & Safety specialist who will 
           review your case and respond within 4 hours during business hours."
4. Action: Send Slack Message to #trust-and-safety
           "Human agent requested - T&S ticket {{ticket_id}}"
5. Action: Turn Agent Off
6. End Flow
```

**Aggression Detection (Built-In)**

```
Threshold: 5
Priority: 1

Sub-Flow Actions:
1. Action: Add Tag "aggressive-behavior"
2. Action: Internal Note "Aggression detected during T&S investigation.
           Partial information gathered:
           - Names: {{custom_affected_names}}
           - Timeline: {{custom_incident_timeline}}
           - Behaviors: {{custom_suspicious_behaviors}}"
3. Action: Message "I understand this is a stressful situation. Security 
           incidents can be very concerning. To help you most effectively, 
           I'm connecting you with a Trust & Safety specialist who will give 
           your case their full attention and respond within 4 hours."
4. Action: Send Slack Message "@here Aggression detected in T&S investigation
           Ticket {{ticket_id}} - {{contact.organization_name}}"
5. Action: Turn Agent Off
6. End Flow
```

**Logging:**
```
LOG: Information Gathering Complete
- Objectives Completed: [4/4 or list incomplete]
- Affected Names: {{custom_affected_names}}
- Timeline: {{custom_incident_timeline}}
- Behaviors: {{custom_suspicious_behaviors}}
- PC Systems Accessed: {{custom_pc_systems_accessed}}
- Conversation Turns: [count]
- Time Elapsed: [duration]
- Final Assessment: [CONFIRMED_BREACH | SOCIAL_SCRAPING | UNCLEAR]
- Next Step: [Escalation | Education | Human Review]
- Interruptions: [None | Active Breach | Human Request | Aggression]
```

---

## STEP 5: Auto-Escalation Flow

### Trigger Condition
Reached when reassessment after information gathering confirms: CONFIRMED_BREACH

### Action Sequence

**Action 1: Apply Escalation Tags**
```
Action: Add Tag "profile-takeover-confirmed"
Action: Add Tag "ts-escalated-auto"
Action: Add Tag "requires-human-investigation"
```

**Action 2: Create Handoff Package (Internal Note)**
```
Action: Internal Note

"T&S AUTO-ESCALATION - PROFILE TAKEOVER CONFIRMED

=== INVESTIGATION SUMMARY ===
Affected Individuals: {{custom_affected_names}}
Timeline: {{custom_incident_timeline}}
Suspicious Behaviors: {{custom_suspicious_behaviors}}
PC Systems Accessed: {{custom_pc_systems_accessed}}

Evidence Assessment:
- Initial Evidence Level: {{custom_evidence_level}}
- Initial Confidence: {{custom_confidence_score}}/10
- Post-Investigation Assessment: CONFIRMED BREACH
- Auto-escalation triggered

=== CUSTOMER DETAILS ===
Organization: {{contact.organization_name}}
Contact: {{contact.name}}
Email: {{contact.email}}
Subscription Tier: {{contact.subscription_tier}}
Previous T&S Tickets: {{contact.ts_ticket_count}}

=== NEXT STEPS FOR HUMAN AGENT ===

1. IMMEDIATE INVESTIGATION (Within 1 hour):
   - Use People Lists to identify suspicious profiles:
     * Profiles created/updated in timeframe: {{custom_incident_timeline}}
     * Check for Directory access on new profiles
     * Review Group join requests from new profiles
   
2. SECURITY HISTORY REVIEW:
   - Check Security History for affected profiles
   - Look for logins from unusual locations
   - Document IP addresses and timestamps
   
3. DOCUMENT IN PTO DATABASE:
   - Use macro: 'Trust and Safety > Populate Profile Takeover (PTO) Database'
   - Add full details to PTO database spreadsheet
   - Document all findings
   
4. CUSTOMER FOLLOW-UP:
   - Verify findings with customer
   - Provide specific guidance based on what was compromised
   - Document resolution steps taken

=== CONVERSATION LOG ===
[Full conversation transcript with timestamps]

=== AUTO-ESCALATION METADATA ===
Escalated at: {{timestamp}}
Escalation trigger: Evidence confirmed after information gathering
Bot confidence: HIGH
Recommended response time: Within 4 hours
Severity: {{custom_evidence_level}}"
```

**Action 3: Send Slack Notification**
```
Action: Send Slack Message
Channel: #trust-and-safety
Message: "🚨 AUTO-ESCALATED: Profile Takeover Confirmed

Organization: {{contact.organization_name}}
Customer: {{contact.name}}
Ticket: {{ticket_id}}

📋 SUMMARY:
Affected: {{custom_affected_names}}
When: {{custom_incident_timeline}}
What: {{custom_suspicious_behaviors}}

✅ EVIDENCE: Confirmed PC system access
📊 CONFIDENCE: HIGH (auto-escalation criteria met)

⏰ REQUIRED RESPONSE: Within 4 hours

👉 View ticket: [Front link]
📝 Investigation steps in internal notes
🔍 Use People Lists to identify suspicious profiles"
```

**Action 4: Send Customer Communication**
```
Action: Statement "Trust and Safety > Admin follow-up"

[This sends the prepared template:]

"Thank you for reporting this. Based on the information you've provided, 
I can confirm there are signs of unauthorized activity that require 
investigation.

Our Trust & Safety team has been alerted and is reviewing your case now. 
Here's what we recommend you do immediately:

**For affected accounts:**
1. Change passwords for any compromised profiles: {{custom_affected_names}}
2. Enable two-step verification for all Org Admins
3. Review who has Directory access and remove anyone you don't recognize
4. Check Groups for suspicious join requests or members

**To monitor ongoing:**
- Use People Lists to identify recently created or updated profiles
- Review Security History for unusual login locations: 
  https://accounts.planningcenter.com/security-history
- Check your Directory Privacy settings

A Trust & Safety specialist will follow up with you within 4 hours with 
investigation findings and next steps.

We take these reports seriously and appreciate you bringing this to our 
attention."
```

**Action 5: Turn Agent Off**
```
Action: Turn Agent Off
(Human agent takes over from here)
```

**Action 6: Mark for Follow-Up**
```
Action: Set Reminder
Time: 4 hours
Assignee: Trust & Safety team
Message: "Follow up on auto-escalated profile takeover - ensure investigation 
         complete and customer contacted"
```

**Logging:**
```
LOG: Auto-Escalation Complete
- Escalation Type: Profile Takeover Confirmed
- Evidence Level: CONFIRMED_BREACH
- Information Completeness: [list which objectives completed]
- Affected Parties: {{custom_affected_names}}
- Timeline: {{custom_incident_timeline}}
- Behaviors Documented: {{custom_suspicious_behaviors}}
- PC Systems Involved: {{custom_pc_systems_accessed}}
- Customer Notified: YES (Admin follow-up template)
- Human Team Notified: YES (Slack #trust-and-safety)
- Internal Documentation: Complete
- Tags Applied: profile-takeover-confirmed, ts-escalated-auto, requires-human-investigation
- Required Response Time: 4 hours
- Bot Status: Turned off (human takeover)
- Total Processing Time: [from initial message to escalation]
```

---

## STEP 5-ALT: Education Bot (No Breach Path)

### Trigger Condition
Reached when evidence assessment determines: LIKELY_SOCIAL_SCRAPING

### Bot Configuration

**Bot Name:** T&S Security Educator

**Persona Settings:**
- Name: Security Educator
- Response Delay: 2 seconds
- AI Typos: 3%
- Breakup Messages: Medium
- How to Respond: "Don't be exclamatory with your responses. Try to sound 
  natural and helpful. Be educational without being condescending. The 
  customer had a genuine concern even if there wasn't a Planning Center breach."

**Why This Conversation is Happening:**
```
{{contact.name}} reported concerns about suspicious activity, but our 
investigation found no evidence of Planning Center system compromise.

Evidence Assessment: {{custom_evidence_level}}
Confidence: {{custom_confidence_score}}/10
Assessment: Information likely obtained from public sources (social media, 
church website) rather than Planning Center breach.

The customer needs education about social media scraping and best practices 
to protect their congregation going forward.
```

**Important Business Information:**
```
You work for Planning Center's Trust & Safety team providing security education.

Your role is to:
- Explain that no Planning Center breach occurred
- Educate about social media scraping
- Provide actionable security best practices
- Help them monitor their account going forward

Be empathetic - even though there wasn't a PC breach, their concern was valid 
and these scams are stressful for churches.
```

---

### Job Flow: Security Education

**Action 1: Apply Tags**
```
Action: Add Tag "no-bad-actor-found"
Action: Add Tag "security-education-provided"
Action: Remove Tag "ts-auto-scan-required"
```

**Action 2: Send Education Template**
```
Action: Statement "Trust and Safety > no signs of bad actor (socials scraped)"

[Template content:]

"Thank you for reaching out about this concern. I've completed my 
investigation and I don't see evidence that anyone gained unauthorized 
access to your Planning Center account.

Based on what you've described, it appears the information was likely 
obtained from:
- Public social media profiles (Facebook, Instagram)
- Your church's public website directory
- Other publicly available sources

This is unfortunately common. Bad actors scrape public information and use 
it to send scam messages impersonating church leadership.

**To protect your congregation:**

1. **Educate members** - They should be suspicious of requests for money or 
   gift cards, even if messages appear to come from church leaders. Real 
   church leaders won't ask for gift cards via text.

2. **Review Directory Privacy** - Check your Church Center Directory settings 
   to control what information is publicly visible.

3. **Enable Two-Step Verification** - Protect admin accounts from actual 
   takeover attempts: https://support.planningcenteronline.com/hc/en-us/articles/6984288823579

4. **Be Cautious with Social Media** - Bad actors monitor public church social 
   accounts for names and relationships. Consider what you post publicly.

Would you like me to show you how to monitor your account for any unusual 
activity going forward?"
```

**Objective 1: Offer Monitoring Guidance**
```
Title: Check Interest in Monitoring
Short Description: determine whether or not the customer wants to learn how to monitor for suspicious activity
Max Attempts: 1
Sensitivity: 50
Output Variable: {{custom_wants_monitoring_info}}

Extra Prompt:
The customer was just educated about social scraping. Determine if they want 
to learn how to monitor their Planning Center account.

If they say yes, acknowledge you'll provide that info.
If they say no or seem satisfied, acknowledge and prepare to close.
If no response after a while, follow up once.
```

**Branch: Monitoring Interest**
```
Left Value: {{custom_wants_monitoring_info}}
Operator: equals
Right Value: "yes"

→ TRUE:
  Action: Statement "Trust and Safety > Use Lists to Monitor going forward"
  
  [Template content:]
  
  "Here's how you can monitor your account for suspicious activity using 
  People Lists:
  
  **Create a 'Recently Updated Profiles' list:**
  1. Navigate to People > Lists > Create List
  2. Add these rules:
     - 'Profiles created or updated in the last week'
     - 'AND has Directory access'
  
  **Create a 'Suspicious Group Activity' list:**
  1. Create another list with these rules:
     - 'Profiles created or updated recently'
     - 'AND requested to join a Group with any Status in the last month'
  
  **Check these lists weekly** to spot any profiles you don't recognize.
  
  You can also review Security History at any time to see login activity, 
  IP addresses, and locations for your account:
  https://accounts.planningcenter.com/security-history
  
  If you spot something suspicious, you can always reach back out to us."
  
  Continue to Resolution

→ FALSE:
  Continue to Resolution
```

**Action 3: Create Internal Note**
```
Action: Internal Note

"T&S INVESTIGATION - NO BREACH FOUND

=== INVESTIGATION SUMMARY ===
Initial Concern: {{initial_message}}
Evidence Assessment: {{custom_evidence_level}}
Confidence: {{custom_confidence_score}}/10
Conclusion: No Planning Center breach detected

Information Reviewed:
- Affected individuals mentioned: {{custom_affected_names}}
- Timeline reported: {{custom_incident_timeline}}
- Behaviors described: {{custom_suspicious_behaviors}}
- PC system access: {{custom_pc_systems_accessed}}

=== FINDINGS ===
No evidence of unauthorized Planning Center access. Information appears to 
have been obtained through:
- Public social media scraping
- Church website directory
- Other publicly available sources

=== EDUCATION PROVIDED ===
✅ Explained social media scraping
✅ Provided best practices for Directory privacy
✅ Recommended 2SV for admin accounts
✅ Showed how to monitor using People Lists
✅ Set expectations about public information

=== CUSTOMER OUTCOME ===
Customer educated on:
- Why this likely wasn't a PC breach
- How to protect congregation going forward
- How to monitor account
- When to contact us again

Monitoring guidance provided: {{custom_wants_monitoring_info}}

=== BOT PERFORMANCE ===
Auto-resolution: YES
Education delivery: Complete
Customer questions answered: [list any follow-ups]
Escalation avoided: YES (appropriate - no breach occurred)"
```

**Action 4: Mark Resolved**
```
Action: Mark Ticket "Resolved"
```

**Action 5: Turn Agent Off**
```
Action: Turn Agent Off
End Flow
```

**Logging:**
```
LOG: Education Flow Complete
- Determination: No Planning Center breach
- Evidence: Social media scraping likely
- Education Provided: Complete
  * Social scraping explanation
  * Directory privacy guidance
  * 2SV recommendations
  * Monitoring tools (People Lists)
  * Security History access
- Monitoring Guidance Requested: {{custom_wants_monitoring_info}}
- Customer Satisfaction: [inferred from responses]
- Tags Applied: no-bad-actor-found, security-education-provided
- Ticket Status: Resolved
- Escalation Avoided: YES (appropriate)
- Total Resolution Time: [from start to resolution]
- Auto-Resolution Success: YES
```

---

## Decision Tree Summary

### Quick Reference Decision Map

```
Message Arrives
    ↓
Keywords? → NO → Standard Support
    ↓ YES
Intent Classifier
    ↓
    ├─→ SECURITY_QUESTION → Product Support
    ├─→ FEATURE_REQUEST → Product Support
    ├─→ INCIDENT_REPORT ↓
    
Evidence Assessor
    ↓
    ├─→ CLEAR_EVIDENCE (high confidence) → Info Gathering
    ├─→ CLEAR_EVIDENCE (low confidence) → Human Triage
    ├─→ LIKELY_SOCIAL_SCRAPING → Education Bot
    ├─→ INSUFFICIENT_INFO → Info Gathering
    
Info Gathering (4 objectives)
    ↓
    [Custom Scenarios Active:]
    ├─→ Active Breach → Urgent Escalation
    ├─→ Human Request → Human Handoff
    ├─→ Aggression → Calm Transfer
    ↓
Reassess Evidence
    ↓
    ├─→ CONFIRMED_BREACH → Auto-Escalation
    ├─→ SOCIAL_SCRAPING → Education Bot
    ├─→ STILL_UNCLEAR → Human Review
```

---

## Bot-by-Bot Implementation Checklist

### Bot 1: Intent Classification Bot

**Setup Checklist:**
- [ ] Create persona: "Intent Classifier"
- [ ] Configure: No customer-facing responses
- [ ] Set trigger: Tag `ts-auto-scan-required`
- [ ] Add "Why Conversation" context
- [ ] Add "Important Business Info"
- [ ] Create Objective 1: Classify Intent
- [ ] Create Switch: Route on intent
- [ ] Test with sample tickets (security questions vs. incidents)
- [ ] Verify routing to correct queues
- [ ] Confirm logging is working

**Success Criteria:**
- Correctly identifies security questions 95%+ accuracy
- Correctly identifies incident reports 90%+ accuracy
- Low false positive escalation rate (<5%)

---

### Bot 2: Evidence Assessment Bot

**Setup Checklist:**
- [ ] Create persona: "Evidence Assessor"
- [ ] Configure: No customer-facing responses
- [ ] Set trigger: Tag `ts-incident-reported`
- [ ] Add context with message body and customer info
- [ ] Add business info about breach indicators
- [ ] Create Objective 1: Evaluate Evidence
- [ ] Create Objective 2: Confidence Score
- [ ] Create Switch: Route on evidence level
- [ ] Add Branch: Confidence check for CLEAR_EVIDENCE
- [ ] Test with known breach examples
- [ ] Test with social scraping examples
- [ ] Verify correct routing decisions
- [ ] Confirm logging captures reasoning

**Success Criteria:**
- Correctly identifies clear breach evidence 85%+ accuracy
- Correctly identifies social scraping 80%+ accuracy
- Appropriately flags uncertain cases for human review

---

### Bot 3: Information Gathering Bot

**Setup Checklist:**
- [ ] Create persona: "Security Specialist" (customer-facing)
- [ ] Configure: Natural response style, delays, typos
- [ ] Set trigger: Tags `ts-evidence-confirmed` OR `ts-needs-more-info`
- [ ] Add detailed "Why Conversation" context
- [ ] Add empathetic business info
- [ ] Create Objective 1: Affected Names
- [ ] Create Objective 2: Timeline
- [ ] Create Objective 3: Suspicious Behaviors
- [ ] Create Objective 4: PC System Access
- [ ] Add AI-Powered Branch: Reassess Evidence
- [ ] Create Switch: Final routing decision
- [ ] Add Custom Scenario: Active Breach
- [ ] Add Custom Scenario: Human Request
- [ ] Configure Aggression Detection
- [ ] Test conversational flow
- [ ] Verify all objectives complete properly
- [ ] Test scenario interruptions
- [ ] Confirm handoff packages are complete

**Success Criteria:**
- Gathers all 4 objectives in 80%+ of conversations
- Average conversation length: 3-6 turns
- Customer tone remains calm/cooperative
- Custom scenarios trigger appropriately
- Handoff packages contain complete information

---

### Bot 4: Auto-Escalation Actions

**Setup Checklist:**
- [ ] Configure trigger: Reassessment confirms breach
- [ ] Create tag application sequence
- [ ] Create internal note template with all required fields
- [ ] Configure Slack notification with formatting
- [ ] Add customer communication statement
- [ ] Configure "Turn Agent Off" action
- [ ] Set up 4-hour follow-up reminder
- [ ] Test complete escalation sequence
- [ ] Verify Slack notifications arrive correctly
- [ ] Verify customer receives appropriate message
- [ ] Confirm human agents see complete handoff package

**Success Criteria:**
- All escalation actions execute in sequence
- Slack notifications arrive within 30 seconds
- Customer message is empathetic and actionable
- Handoff package contains all investigation details
- Human agents can pick up without re-asking questions

---

### Bot 5: Education Bot

**Setup Checklist:**
- [ ] Create persona: "Security Educator"
- [ ] Configure: Helpful, non-condescending tone
- [ ] Set trigger: Evidence assessor routes to education
- [ ] Add context explaining the determination
- [ ] Add business info about education role
- [ ] Create action: Apply appropriate tags
- [ ] Create statement: Social scraping explanation
- [ ] Create objective: Check monitoring interest
- [ ] Create branch: Monitoring guidance decision
- [ ] Create statement: People Lists monitoring guide
- [ ] Create internal note: Document resolution
- [ ] Configure mark as resolved
- [ ] Test education flow
- [ ] Verify customer receives helpful information
- [ ] Confirm monitoring guidance is clear

**Success Criteria:**
- Customer understands no breach occurred
- Customer receives actionable security guidance
- Customer knows how to monitor going forward
- Ticket resolved without unnecessary escalation
- Education is empathetic not dismissive

---

## Testing Scenarios

### Test Case 1: Clear Profile Takeover
**Input:** "Someone hacked our church's Planning Center! John Smith and Mary Johnson started getting scam texts yesterday from our pastor asking for gift cards. When I checked, there were new profiles created that I don't recognize."

**Expected Flow:**
1. Keywords detected → ts-auto-scan-required
2. Intent Classification → INCIDENT_REPORT
3. Evidence Assessment → CLEAR_EVIDENCE (high confidence)
4. Information Gathering → Gathers names, timeline, behaviors
5. Reassess → CONFIRMED_BREACH
6. Auto-Escalation → Tags, Slack, handoff package

**Verify:**
- [ ] All 4 objectives complete
- [ ] Slack notification sent
- [ ] Customer receives admin follow-up template
- [ ] Internal note contains complete investigation summary
- [ ] Agent turned off for human takeover

---

### Test Case 2: Social Media Scraping
**Input:** "Our members are getting text messages from someone pretending to be Pastor Mike asking for iTunes gift cards. This is scary!"

**Expected Flow:**
1. Keywords detected → ts-auto-scan-required
2. Intent Classification → INCIDENT_REPORT
3. Evidence Assessment → LIKELY_SOCIAL_SCRAPING
4. Education Bot → Social scraping explanation
5. Monitoring guidance offered
6. Resolved with education

**Verify:**
- [ ] No unnecessary information gathering
- [ ] Customer receives clear explanation
- [ ] Education is empathetic not dismissive
- [ ] Monitoring guidance provided
- [ ] Ticket marked resolved appropriately

---

### Test Case 3: Security Feature Question
**Input:** "How do I enable two-step verification for my admin team?"

**Expected Flow:**
1. Keywords detected → ts-auto-scan-required
2. Intent Classification → SECURITY_QUESTION
3. Route to Product Support (no T&S involvement)

**Verify:**
- [ ] Correctly identified as not a T&S incident
- [ ] Routed to Product queue
- [ ] No unnecessary escalation
- [ ] Internal note explains routing decision

---

### Test Case 4: Active Breach Urgency
**Input:** "URGENT! Someone is logged into our account right now changing things. I can see them making profile edits as I'm typing this!"

**Expected Flow:**
1. Keywords detected → ts-auto-scan-required
2. Intent Classification → INCIDENT_REPORT
3. Evidence Assessment → CLEAR_EVIDENCE
4. Information Gathering starts
5. Custom Scenario: Active Breach triggers immediately
6. Urgent escalation with @here Slack alert

**Verify:**
- [ ] Active breach scenario interrupts normal flow
- [ ] Urgent Slack notification with @here
- [ ] Customer receives immediate response with action items
- [ ] Escalated within 1 minute
- [ ] Marked as urgent priority

---

### Test Case 5: Insufficient Initial Information
**Input:** "I think we got hacked. Can you help?"

**Expected Flow:**
1. Keywords detected → ts-auto-scan-required
2. Intent Classification → INCIDENT_REPORT
3. Evidence Assessment → INSUFFICIENT_INFO
4. Information Gathering → Asks clarifying questions
5. Gathers details through conversation
6. Reassess based on gathered info
7. Route to escalation OR education based on findings

**Verify:**
- [ ] Bot asks appropriate follow-up questions
- [ ] Gathers all 4 objectives
- [ ] Makes correct determination after gathering info
- [ ] Routes appropriately based on evidence

---

## Monitoring & Optimization

### Daily Monitoring

**Metrics to Track:**
- Total messages scanned
- Keyword filter triggers
- Intent classification distribution
- Evidence assessment outcomes
- Auto-escalation rate
- Education resolution rate
- False positive escalations
- False negative (missed breaches)

**Dashboards to Create:**
```
T&S Auto-Escalation Dashboard

📊 Volume Metrics:
- Messages scanned today: [count]
- Keyword triggers: [count] ([%] of total)
- Intent classifications:
  * Incident Reports: [count]
  * Security Questions: [count]
  * Feature Requests: [count]

🔍 Evidence Assessment:
- Clear Evidence: [count]
- Likely Social Scraping: [count]
- Insufficient Info: [count]
- Unclear (human review): [count]

⚡ Escalations:
- Auto-escalated breaches: [count]
- Education resolutions: [count]
- Human review needed: [count]
- Response time average: [duration]

✅ Quality Metrics:
- False positive rate: [%]
- False negative rate: [%]
- Customer satisfaction: [score]
- Human agent satisfaction: [score]
```

---

### Weekly Reviews

**Questions to Answer:**
1. Are we catching all genuine breaches? (Check false negatives)
2. Are we over-escalating? (Check false positives)
3. Are customers satisfied with bot interactions?
4. Are human agents getting complete handoff packages?
5. Which objectives are taking too many attempts?
6. Are custom scenarios triggering appropriately?

**Optimization Actions:**
- Adjust objective sensitivity scores
- Refine branch thresholds
- Update keyword list
- Improve prompt clarity
- Enhance education templates

---

### Monthly Deep Dives

**Analysis Areas:**
1. Review all escalated cases for accuracy
2. Review all education-resolved cases for appropriateness
3. Analyze conversation transcripts for improvement opportunities
4. Update personas based on customer feedback
5. Refine business information based on new threat patterns
6. Add new custom scenarios for recurring edge cases

---

## Cost Analysis

### Token Usage Estimates

**Step 1: Keyword Filter**
- Cost: $0 (Front rules only)
- Coverage: Filters out 90% of messages

**Step 2: Intent Classification**
- Input tokens: ~150 per message
- Output tokens: ~20 per message
- Cost per message: ~$0.0005
- Daily volume (est): 10 messages
- Daily cost: ~$0.005

**Step 3: Evidence Assessment**
- Input tokens: ~300 per message
- Output tokens: ~50 per message
- Cost per message: ~$0.001
- Daily volume (est): 7 messages (after filtering)
- Daily cost: ~$0.007

**Step 4: Information Gathering**
- Input tokens per turn: ~500
- Output tokens per turn: ~100
- Average turns: 4
- Cost per conversation: ~$0.008
- Daily volume (est): 4 conversations
- Daily cost: ~$0.032

**Step 5: Escalation/Education**
- Cost: Minimal (pre-written templates)
- Daily cost: ~$0.001

**Total Daily Cost:** ~$0.045
**Total Monthly Cost:** ~$1.35

**ROI Comparison:**
- Without automation: ~2 hours human agent time per day
- Human cost: ~$40/hour = $80/day = $2,400/month
- With automation: ~0.5 hours human time per day + $1.35
- Human cost: ~$20/day = $600/month + $1.35 = $601.35/month
- **Monthly Savings: ~$1,799**

---

## Implementation Timeline

### Week 1-2: Foundation
- Set up Front keyword rules
- Create Intent Classification Bot
- Test with historical tickets
- Refine intent classification accuracy

### Week 3-4: Evidence Assessment
- Create Evidence Assessment Bot
- Define evidence criteria clearly
- Test with known breach/non-breach examples
- Tune confidence thresholds

### Week 5-6: Information Gathering
- Create Information Gathering Bot (most complex)
- Build all 4 objectives
- Add custom scenarios
- Test conversational flow
- Refine persona tone

### Week 7: Escalation & Education
- Build auto-escalation action sequence
- Create education bot
- Set up Slack notifications
- Test end-to-end flows

### Week 8: Testing & Refinement
- Run parallel with human agents (shadow mode)
- Compare bot decisions to human decisions
- Gather agent feedback
- Refine based on results

### Week 9-10: Gradual Rollout
- Start with 25% of T&S tickets
- Monitor closely for issues
- Increase to 50% after successful week
- Increase to 100% after second successful week

### Week 11+: Optimization
- Weekly reviews and adjustments
- Monthly deep dives
- Continuous improvement based on data

---

## Success Criteria

### Phase 1 Success (Weeks 1-4)
- [ ] Intent classification accuracy > 90%
- [ ] Evidence assessment accuracy > 85%
- [ ] No major customer complaints
- [ ] Human agents understand the system

### Phase 2 Success (Weeks 5-8)
- [ ] Information gathering completes in 80%+ of cases
- [ ] Average conversation length: 3-6 turns
- [ ] Custom scenarios trigger appropriately
- [ ] Handoff packages are complete

### Phase 3 Success (Weeks 9-12)
- [ ] Auto-resolution rate: 40-50% of T&S tickets
- [ ] False positive escalation rate: <10%
- [ ] False negative rate: <5%
- [ ] Customer satisfaction: >4.0/5.0
- [ ] Human agent satisfaction with handoffs: >4.0/5.0
- [ ] Average time savings: 1.5+ hours per day

### Long-term Success (3+ Months)
- [ ] Sustained auto-resolution rate
- [ ] Improved response times on escalated cases
- [ ] Reduced human agent workload by 50%+
- [ ] Maintained quality with fewer human touches
- [ ] System pays for itself 180x over in time savings

---

This decision flow map provides everything needed to build the T&S auto-escalation system using modular, objective-driven workflows. Each bot has a single clear purpose, decisions are well-defined, and the system can be built incrementally and tested thoroughly before full deployment.
