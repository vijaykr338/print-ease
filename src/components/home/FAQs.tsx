'use client';

import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: 'How long does processing take?',
    answer:
      "Most print jobs are processed within 30 minutes, depending on complexity and current demand. You'll receive a notification as soon as your document is ready.",
  },
  {
    question: 'What file formats are supported?',
    answer:
      'We support most common document formats including PDF, DOCX, PPT, TXT, and image files (JPG, PNG). If you have a special format, contact support.',
  },
  {
    question: 'Do I need to pay extra?',
    answer:
      "Not a penny!",
  },
  {
    question: 'Can I upload even when the shop is closed?',
    answer:
      'Absolutely, Just go and collect it the next day',
  },
];

const FaqSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Common Questions
          </h2>
          <p className="mt-4 text-lg leading-6 text-gray-400">
            Quick answers to frequently asked questions about our printing service.
          </p>
        </div>

        <div className='flex flex-col items-center'>
  {faqData.map((item, index) => (
    <Accordion
      key={index}
      question={item.question}
      answer={item.answer}
    />
  ))}
</div>
      </div>
    </section>
  );
};

export default FaqSection;


interface AccordionProps {
  question: string;
  answer: string;
}

const Accordion: React.FC<AccordionProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="bg-neutral-800 rounded-lg p-6 mb-4 w-[80vw]">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleOpen}
      >
        <h3 className="text-lg font-semibold leading-6 text-white">{question}</h3>
        <svg
          className={`w-6 h-6 text-white transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {isOpen && <p className="mt-2 text-base text-gray-300">{answer}</p>}
    </div>
  );
};
