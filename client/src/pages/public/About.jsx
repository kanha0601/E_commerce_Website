import React from "react";
import aboutData from "../../data/aboutData";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-16">

      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-3">
          {aboutData.title}
        </h1>

        <p className="text-xl text-gray-600">
          {aboutData.subtitle}
        </p>
      </div>

      {/* Description */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <p className="text-lg text-gray-700">
          {aboutData.description}
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mb-12">

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-3">🎯 Mission</h2>
          <p className="text-gray-600">
            {aboutData.mission}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-3">🚀 Vision</h2>
          <p className="text-gray-600">
            {aboutData.vision}
          </p>
        </div>

      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

        {aboutData.stats.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-lg shadow"
          >
            <h3 className="text-3xl font-bold text-blue-600">
              {item.value}
            </h3>

            <p className="text-gray-600">
              {item.label}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
};

export default About;