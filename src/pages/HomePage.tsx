import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto img-container">
      <h1 className="text-emerald-300 text-4xl font-bold text-center mt-10">
        Welcome to the Home Page
      </h1>
      <p className="text-emerald-300 text-center mt-4 text-lg">
        This is the home page of our application.
      </p>
    </div>
  );
};

export default HomePage;
