import React from "react";

function App() {
  return (
    <>
      <div className="p-8 space-y-4">
        <h1 className="text-brand-blue text-4xl font-bold">Vite + React</h1>
        <div className="space-y-2">
          <p className="text-brand-dark text-lg">Brand Dark Color - #7A5C58</p>
          <p className="text-brand-purple text-lg">
            Brand Purple Color - #8D80AD
          </p>
          <p className="text-brand-blue text-lg">Brand Blue Color - #99B2DD</p>
          <p className="text-brand-neon text-lg">Brand Neon Color - #9DFFF9</p>
          <p className="text-brand-green text-lg">
            Brand Green Color - #64F58D
          </p>
        </div>
        <div className="flex gap-4 mt-6">
          <div className="w-16 h-16 bg-brand-dark rounded"></div>
          <div className="w-16 h-16 bg-brand-purple rounded"></div>
          <div className="w-16 h-16 bg-brand-blue rounded"></div>
          <div className="w-16 h-16 bg-brand-neon rounded"></div>
          <div className="w-16 h-16 bg-brand-green rounded"></div>
        </div>
      </div>
    </>
  );
}

export default App;
