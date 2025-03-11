import React from "react";
import "./../styles/Legend.scss";

const Legend: React.FC = () => {
  return (
    <>
      <div className="page-legend">
        <div className="page-legend-carbohydrates">
          <div className="page-legend-carbohydrates-color"></div>
          <p className="page-legend-carbohydrates-labe">Carbohydrates (g)</p>
        </div>
        <div className="page-legend-protein">
          <div className="page-legend-protein-color"></div>
          <p className="page-legend-protein-label">Protein (g)</p>
        </div>
        <div className="page-legend-fat">
          <div className="page-legend-fat-color"></div>
          <p className="page-legend-fat-label">Fat (g)</p>
        </div>
      </div>
    </>
  );
};

export default Legend;
