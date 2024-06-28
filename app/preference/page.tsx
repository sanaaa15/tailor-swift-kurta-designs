'use client'
import React, { useState } from 'react';
import NavBarHome from '../components/NavBarHome';

const questions = [
  {
    question: "1. For which occasions do you typically shop?",
    options: ["Festive", "Office Wear", "Everyday Comfort", "Formal Events"],
  },
  {
    question: "2. Which color palette do you usually lean towards?",
    options: ["Neutral(Beige, Cream, white)", "Bright (Red, Yellow, Orange)", "Pastel (Light Blue, Mint Green, Lavender)", "Dark (Navy Blue, Maroon, Black)"],
  },
  {
    question: "3. What type of designs do you prefer?",
    options: ["Sequins", "Embroidery", "Contemporary Printed Pattern", "Minimalist Plain Style"],
  },
  {
    question: "4. How do you like your kurta to fit?",
    options: ["Fitted silhouette tailored to your body shape", "A relaxed fit for comfortable wear", "A flared design that adds movement and volume"],
  },
  {
    question: "5. Which fabric best aligns with your style?",
    options: ["Silk for its luxurious feel", "Cotton for its comfort", "Linen for its light and airy texture", "Polyester for its durability and versatility"],
  },
];

function Preference() {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleStartDesigning = () => {
    window.location.href = '/recommendation';
  };

  return (
    <div>
      <div className="bg-navy min-h-screen">
        <div style={{ marginLeft: '2%'}}>
          <NavBarHome fontColor="text-beige" bgColor="bg-navy" />
        </div>
        <div className="flex flex-col items-center justify-center my-10">
          <div className="text-white text-center mb-10 w-[50%]">
            <p style={{fontSize: '120%'}}>We'd love to uncover your style: from fabric to color, design flair to fit preference, and the occasions that inspire your wardrobe. Share your preferences and let's craft a kurta that truly reflects you!</p>
          </div>
          <div
            key={currentQuestion}
            className="bg-beige text-navy p-10 rounded-lg shadow-lg transition-transform transform scale-100"
            style={{ width: '500px', animation: 'fadeIn 1s' }}
          >
            <h2 className="text-2xl font-bold mb-4">
              {questions[currentQuestion].question}
            </h2>
            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className="block w-full py-2 px-4 bg-navy text-beige rounded-md hover:bg-blue transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="mt-4">
              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="py-2 px-4 bg-navy text-beige rounded-md hover:bg-blue transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleStartDesigning}
                  className="py-2 px-4 bg-navy text-beige rounded-md hover:bg-blue transition-colors"
                >
                  Start Designing
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Preference;