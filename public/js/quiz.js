/**
 * ElectBot — Quiz Engine
 * Manages election knowledge quiz with scoring and explanations.
 * @module quiz
 * @version 2.0.0
 */

'use strict';

/**
 * Quiz questions array with options, correct index, and explanations.
 * @type {Array<{question: string, options: string[], correct: number, explanation: string}>}
 */
const QUIZ_QUESTIONS = [
  {
    question: "What is the minimum age to vote in Indian elections?",
    options: ["16 years", "18 years", "21 years", "25 years"],
    correct: 1,
    explanation: "The minimum voting age in India is 18 years. This was reduced from 21 years to 18 years by the 61st Amendment to the Constitution in 1988. A citizen must be 18 years or older on January 1st of the year the electoral roll is being prepared."
  },
  {
    question: "Which body is responsible for conducting elections in India?",
    options: ["Supreme Court", "Parliament", "Election Commission of India", "President of India"],
    correct: 2,
    explanation: "The Election Commission of India (ECI) is an autonomous constitutional body responsible for administering union and state election processes. It was established on 25th January 1950 under Article 324 of the Constitution."
  },
  {
    question: "What does EVM stand for?",
    options: ["Electronic Vote Monitor", "Electronic Voting Machine", "Electoral Voting Method", "Electronic Verification Module"],
    correct: 1,
    explanation: "EVM stands for Electronic Voting Machine. India pioneered the use of EVMs, transitioning completely from paper ballots by 2004. EVMs are designed and manufactured by Bharat Electronics Limited (BEL) and Electronics Corporation of India Limited (ECIL)."
  },
  {
    question: "What is NOTA in the context of Indian elections?",
    options: ["A political party", "None Of The Above option", "A voting document", "A constituency type"],
    correct: 1,
    explanation: "NOTA stands for 'None Of The Above'. It was introduced by the Supreme Court in 2013, allowing voters to reject all candidates. If NOTA gets the highest votes, the candidate with the next highest votes still wins — NOTA doesn't invalidate the election."
  },
  {
    question: "How many constituencies are there in the Lok Sabha?",
    options: ["435", "500", "543", "650"],
    correct: 2,
    explanation: "The Lok Sabha has 543 constituencies. Of these, 412 are General, 84 are reserved for Scheduled Castes (SC), and 47 are reserved for Scheduled Tribes (ST). A party needs 272 seats (simple majority) to form the government."
  },
  {
    question: "What is the Model Code of Conduct (MCC)?",
    options: ["The Constitution of India", "Guidelines for political parties during elections", "Rules for counting votes", "A training manual for election officers"],
    correct: 1,
    explanation: "The Model Code of Conduct is a set of guidelines issued by the ECI to regulate political parties and candidates during elections. It comes into force from the date of election announcement and remains until results are declared."
  },
  {
    question: "What does VVPAT stand for?",
    options: ["Voter Verification and Polling Audit Trail", "Voter Verifiable Paper Audit Trail", "Vote Validation Paper Authentication Tool", "Verified Voter Paper Audit Technique"],
    correct: 1,
    explanation: "VVPAT stands for Voter Verifiable Paper Audit Trail. It's a machine attached to EVMs that prints a slip showing the voter's choice for 7 seconds, allowing verification."
  },
  {
    question: "Which form is used for new voter registration in India?",
    options: ["Form 2", "Form 6", "Form 8", "Form 10"],
    correct: 1,
    explanation: "Form 6 is used for new voter registration. Form 7 is for objections to inclusion of a name, Form 8 is for corrections/updates to existing entries, and Form 8A is for transposition."
  },
  {
    question: "What is the 'silence period' before an election?",
    options: ["24 hours before polling", "48 hours before polling", "72 hours before polling", "1 week before polling"],
    correct: 1,
    explanation: "The silence period is 48 hours before polling day, during which all campaigning must stop. This gives voters time to reflect on their choices without external influence."
  },
  {
    question: "What is the maximum expenditure limit for a Lok Sabha candidate?",
    options: ["₹40 lakh", "₹70 lakh", "₹95 lakh", "₹1 crore"],
    correct: 2,
    explanation: "As per the ECI's 2022 revision, the maximum election expenditure for a Lok Sabha candidate is ₹95 lakh (₹75 lakh in smaller states). The ECI appoints expenditure observers to monitor compliance."
  }
];

/** @type {number} Index of the currently displayed question */
let currentQuestion = 0;

/** @type {number} User's current score */
let score = 0;

/** @type {boolean} Whether the current question has been answered */
let answered = false;

/** @type {Array<{question: number, selected: number, correct: boolean}>} */
let userAnswers = [];
