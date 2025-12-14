import React, { useState } from "react";

const faqData = [
  {
    question: "How do I participate in a contest?",
    answer:
      "Simply register on ContestHub, browse available contests, and click 'Join' to participate. Make sure to follow the contest rules.",
  },
  {
    question: "Is there any fee to join contests?",
    answer:
      "Most contests are free to join. Some premium contests may require a small entry fee which will be mentioned on the contest page.",
  },
  {
    question: "How are winners selected?",
    answer:
      "Winners are selected based on the contest criteria, which can include creativity, accuracy, or votes. Details are provided in each contest description.",
  },
  {
    question: "Can I participate in multiple contests?",
    answer:
      "Yes! You can participate in as many contests as you like. Just make sure you meet the eligibility requirements for each contest.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 ">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-indigo-700 mb-3"> Frequently Asked Questions</h2>
        <p className="text-gray-600 text-lg">Answers to common questions about ContestHub.</p>
      </div>

      {/* FAQ Items */}
      <div className="flex flex-col space-y-6">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-md overflow-hidden transition-transform transform hover:scale-[1.02] hover:shadow-xl duration-300"
          >
            <button
              className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
              onClick={() => toggleAnswer(index)}
            >
              <span className="font-medium text-indigo-600 text-lg">{item.question}</span>
              <span
                className={`text-indigo-600 text-2xl font-bold transform transition-transform duration-300 ${
                  activeIndex === index ? "rotate-45" : "rotate-0"
                }`}
              >
                +
              </span>
            </button>

            <div
              className={`px-6 text-gray-600 overflow-hidden transition-all duration-500 ease-in-out ${
                activeIndex === index ? "max-h-72 py-4 opacity-100" : "max-h-0 py-0 opacity-0"
              }`}
            >
              <p className="text-gray-700 leading-relaxed">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
