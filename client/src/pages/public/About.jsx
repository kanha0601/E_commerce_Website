import React from "react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      
      <h1 className="text-5xl font-bold mb-6 text-gray-800">
        About Our Store
      </h1>

      <p className="text-lg text-gray-600 max-w-2xl mb-6">
        Welcome to our e-commerce website! We provide the best products and a smooth shopping experience for all our customers.
      </p>

      <p className="text-lg text-gray-600 max-w-2xl mb-6">
        Our mission is to make online shopping fast, safe, and enjoyable. We are committed to providing quality products at affordable prices.
      </p>

      <p className="text-lg text-gray-600 max-w-2xl">
        Join us today and experience the convenience of shopping from home with reliable customer support.
      </p>

    </div>
  );
};

export default About;