import React, { useState } from 'react';
import './FAQ.css';

const faqs = [
  {
    question: 'What is Sample Web App?',
    answer:
      'Sample Web App is a modern React application built to demonstrate front-end best practices and serve as a testing ground for Playwright end-to-end tests.',
  },
  {
    question: 'How do I create an account?',
    answer:
      'Head over to the Login page and use the provided demo credentials. This sample app uses a mock authentication service, so no real sign-up is required.',
  },
  {
    question: 'Does the app support dark mode?',
    answer:
      'Yes! Use the theme toggle in the navigation bar to switch between light and dark themes. Your preference is remembered across sessions.',
  },
  {
    question: 'Which technologies are used?',
    answer:
      'The app is built with React 18, React Router v6, and plain CSS3. End-to-end tests are written with Playwright.',
  },
  {
    question: 'How can I get in touch?',
    answer:
      'Visit the Contact page and fill out the form. We would love to hear your questions and feedback.',
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="faq">
      <h1>Frequently Asked Questions</h1>
      <p className="faq-intro">
        Find answers to the most common questions about Sample Web App.
      </p>

      <ul className="faq-list">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-button-${index}`;

          return (
            <li key={faq.question} className="faq-item">
              <button
                type="button"
                id={buttonId}
                className="faq-question"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="faq-answer"
                >
                  <p>{faq.answer}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FAQ;
