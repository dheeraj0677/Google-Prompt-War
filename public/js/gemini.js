/**
 * ElectBot — Gemini AI Integration Module
 * 
 * This module handles all communication with the Google Gemini API,
 * including message formatting, error handling, and fallback responses.
 * 
 * @module gemini
 * @requires CONFIG - Global configuration object from config.js
 * @see https://ai.google.dev/gemini-api/docs
 */

'use strict';

/**
 * Gemini API key loaded from centralized configuration.
 * Falls back to placeholder if CONFIG is not available.
 * @type {string}
 */
const GEMINI_API_KEY = typeof CONFIG !== 'undefined' ? CONFIG.GEMINI_API_KEY : 'YOUR_GEMINI_API_KEY';

/**
 * System prompt that defines ElectBot's persona and behavioral guidelines.
 * This prompt is sent with every API request to maintain consistent responses.
 * @type {string}
 */
const SYSTEM_PROMPT = `You are ElectBot, a friendly, nonpartisan election assistant. Help users understand voter registration, polling, ballot casting, results, and democratic processes. Always be neutral, factual, and encouraging.

Key guidelines:
- Focus on Indian elections (with references to US processes when relevant)
- Explain complex processes in simple, clear language
- Use numbered steps when explaining procedures
- Always encourage civic participation
- Never show political bias or support any party/candidate
- If unsure, recommend checking official sources like eci.gov.in
- Keep responses concise but informative (under 300 words unless asked for detail)
- Use emoji sparingly for friendliness 🗳️`;

/**
 * Stores the ongoing conversation history for multi-turn context.
 * Each entry follows the Gemini API format: { role: string, parts: [{ text: string }] }
 * @type {Array<{role: string, parts: Array<{text: string}>}>}
 */
let conversationHistory = [];

/**
 * Maximum number of retry attempts for API failures.
 * @type {number}
 */
const MAX_RETRIES = 2;

/**
 * Send a message to the Gemini API and get an AI-generated response.
 * Implements retry logic with exponential backoff for transient failures.
 * Falls back to pre-built responses when the API is unavailable.
 * 
 * @param {string} userMessage - The user's message to send to the AI
 * @returns {Promise<string>} The AI-generated response text
 * @throws {Error} Only if all retries and fallback fail (should not happen)
 * 
 * @example
 * const response = await sendToGemini('How do I register to vote?');
 * console.log(response); // Detailed registration guide
 */
async function sendToGemini(userMessage) {
  conversationHistory.push({ role: 'user', parts: [{ text: userMessage }] });

  // Check if API key is configured
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    return getFallbackResponse(userMessage);
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: conversationHistory,
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: {
              temperature: 0.7,
              topP: 0.9,
              topK: 40,
              maxOutputTokens: 1024,
            },
            safetySettings: [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
            ]
          })
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'Unknown error');
        
        // Handle specific HTTP error codes
        if (response.status === 429) {
          console.warn(`Gemini API rate limited (attempt ${attempt + 1}/${MAX_RETRIES + 1})`);
          if (attempt < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            continue;
          }
        }
        
        if (response.status === 403) {
          console.error('Gemini API key is invalid or restricted.');
          return getFallbackResponse(userMessage);
        }

        throw new Error(`API Error ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      
      // Validate response structure
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!aiText) {
        console.warn('Empty response from Gemini API:', JSON.stringify(data));
        return getFallbackResponse(userMessage);
      }

      conversationHistory.push({ role: 'model', parts: [{ text: aiText }] });
      return aiText;

    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Gemini API request timed out');
      } else {
        console.error(`Gemini API Error (attempt ${attempt + 1}):`, error.message);
      }

      if (attempt === MAX_RETRIES) {
        return getFallbackResponse(userMessage);
      }

      // Exponential backoff before retry
      await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempt)));
    }
  }

  return getFallbackResponse(userMessage);
}

/**
 * Provides pre-built responses when the Gemini API is unavailable.
 * Uses keyword matching to route queries to relevant informational content.
 * 
 * @param {string} query - The user's original query
 * @returns {string} A markdown-formatted response matching the query topic
 */
function getFallbackResponse(query) {
  const q = query.toLowerCase();
  const responses = {
    register: `## How to Register as a Voter in India 🗳️

1. **Online Registration**: Visit the National Voters' Service Portal (NVSP) at [nvsp.in](https://nvsp.in)
2. **Fill Form 6**: Complete the voter registration form with your details
3. **Upload Documents**: Provide proof of age (birth certificate, Class 10 marksheet) and address proof
4. **Submit**: Your application will be verified by the Electoral Registration Officer
5. **Check Status**: Track your application online or visit your local BLO

**Required Documents:**
- Proof of Age (Aadhaar, Birth Certificate, Passport)
- Proof of Address (Utility bill, Bank statement, Aadhaar)
- Passport-size photograph

You can also register at your nearest Common Service Centre or through the Voter Helpline App.`,

    timeline: `## Indian General Election Timeline 📅

1. **Announcement** — Election Commission announces dates & Model Code of Conduct begins
2. **Nomination Filing** — Candidates file their nomination papers (7 days)
3. **Scrutiny** — Election Commission verifies nominations (1 day after filing)
4. **Withdrawal** — Last date for candidates to withdraw (2 days after scrutiny)
5. **Campaigning** — Political campaigning period (ends 48 hrs before polling)
6. **Polling Day** — Citizens cast their votes at designated polling stations
7. **Counting Day** — Votes are counted and results declared
8. **Results** — Election Commission announces official results
9. **Government Formation** — Winning party/alliance forms the government

The entire process typically spans 6-8 weeks for general elections.`,

    eligible: `## Voter Eligibility in India 🇮🇳

You are eligible to vote if:
- ✅ You are a **citizen of India**
- ✅ You are **18 years or older** on the qualifying date (January 1st of the year)
- ✅ You are a **resident** of the constituency where you want to vote
- ✅ You are **not disqualified** under any law
- ✅ You are **registered** in the electoral roll

**You cannot vote if:**
- ❌ You are not a citizen of India
- ❌ You are below 18 years of age
- ❌ You are of unsound mind as declared by a court
- ❌ You have been disqualified for corrupt practices or electoral offenses`,

    evm: `## Electronic Voting Machines (EVMs) 🖥️

**What is an EVM?**
An Electronic Voting Machine is a portable device used in Indian elections to record votes electronically.

**Components:**
1. **Balloting Unit** — Where voters press the button next to their chosen candidate
2. **Control Unit** — Operated by the presiding officer to enable voting
3. **VVPAT** — Voter Verifiable Paper Audit Trail (prints a slip showing your vote for 7 seconds)

**Security Features:**
- One-time programmable chips that cannot be reprogrammed
- No network connectivity (standalone device)
- Tamper-proof design with multiple seals
- Mock polls conducted before actual polling
- Random allocation of EVMs to constituencies

**Fun Fact:** India pioneered the use of EVMs in elections, fully transitioning from paper ballots by 2004.`,

    eci: `## Election Commission of India (ECI) 🏛️

The Election Commission of India is an autonomous constitutional authority responsible for administering election processes in India.

**Core Roles & Responsibilities:**
1. **Conducting Elections** — Directs and controls the entire process for Parliament and State Legislatures.
2. **Voter Lists** — Preparation and periodic revision of electoral rolls.
3. **Model Code of Conduct** — Enforces guidelines for political parties and candidates during elections.
4. **Party Registration** — Registers political parties and assigns election symbols.
5. **Voter Education** — Promotes awareness through programs like SVEEP.
6. **Polling Stations** — Decides the locations and ensures accessibility for all voters.

**Key Figures:**
- **Chief Election Commissioner (CEC)** — Leads the commission.
- **Election Commissioners** — Two other commissioners who assist the CEC.

**Official Website:** [eci.gov.in](https://eci.gov.in)`,

    default: `Welcome! 👋 I'm **ElectBot**, your AI election assistant.

I can help you with:
- 🗳️ **Voter Registration** — How to register, check status, update details
- 📅 **Election Timeline** — Key dates and phases
- 🏛️ **Election Process** — How voting, counting, and results work
- 📋 **Eligibility** — Who can vote and requirements
- 🔒 **EVM & Security** — How electronic voting works
- 📊 **Voter Turnout** — Historical data and statistics

**Try asking me:**
- "How do I register to vote?"
- "What are the election phases?"
- "Explain EVMs"
- "Am I eligible to vote?"

*Note: For live AI responses, please configure your Gemini API key. Currently showing pre-built responses.*`
  };

  if (q.includes('register') || q.includes('registration') || q.includes('sign up') || q.includes('enroll'))
    return responses.register;
  if (q.includes('timeline') || q.includes('phase') || q.includes('schedule') || q.includes('when') || q.includes('date'))
    return responses.timeline;
  if (q.includes('eligible') || q.includes('eligibility') || q.includes('can i vote') || q.includes('age') || q.includes('qualify'))
    return responses.eligible;
  if (q.includes('evm') || q.includes('machine') || q.includes('electronic') || q.includes('vvpat'))
    return responses.evm;
  if (q.includes('election commission') || q.includes('eci') || q.includes('commissioner') || q.includes('role'))
    return responses.eci;

  return responses.default;
}

/**
 * Clears the conversation history to start a fresh chat session.
 * This resets the multi-turn context sent to the Gemini API.
 */
function clearConversation() {
  conversationHistory = [];
}

/**
 * Converts a subset of markdown syntax to safe HTML for rendering in the chat.
 * Supports: headings (##), bold (**), italic (*), code (`), links, and lists.
 * 
 * @param {string} text - Markdown-formatted text from the AI response
 * @returns {string} HTML string safe for rendering in message bubbles
 * 
 * @example
 * markdownToHtml('**Hello** world');
 * // Returns: '<strong>Hello</strong> world'
 */
function markdownToHtml(text) {
  return text
    .replace(/## (.*?)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^- (.*?)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.*?)$/gm, '<li>$2</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

/**
 * Sanitizes user input to prevent Cross-Site Scripting (XSS) attacks.
 * Uses the browser's built-in DOM text encoding to escape dangerous characters.
 * Truncates input to a maximum of 2000 characters.
 * 
 * @param {string} input - Raw user input string
 * @returns {string} HTML-escaped, length-limited safe string
 * 
 * @example
 * sanitizeInput('<script>alert("xss")</script>');
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 */
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML.substring(0, 2000); // Limit to 2000 chars
}
