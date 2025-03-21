// On a scale of 1-10, how satisfied are you with your overall experience using this application?
// Did you encounter any issues or bugs while using the application? If yes, please describe them.
// How easy was it to navigate through the application? (Very easy – Very difficult)
// What features did you find most useful, and what features do you think could be improved?
// Would you recommend this application to others? Why or why not?

import { Rating } from "primereact/rating";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";
import "./../styles/Feedback.scss";
import { Button } from "primereact/button";

const Feedback: React.FC = () => {
  const [question1, setQuestion1] = useState<any>();
  const [question2, setQuestion2] = useState<any>();
  const [question3, setQuestion3] = useState<any>();
  const [question4, setQuestion4] = useState<any>();
  const [question5, setQuestion5] = useState<any>();

  const question3Options = [
    { name: "Very Easy" },
    { name: "Easy" },
    { name: "Neutral" },
    { name: "Difficult" },
    { name: "Very Difficult" },
  ];

  return (
    <>
      <div className="page">
        <h1 className="page-title">Anonymous Feedback Form</h1>
        <div className="page-inputs">
          <div className="page-input">
            <p className="page-input-label">
              On a scale of 1-10, how satisfied are you with your overall experience using this
              application?
            </p>
            <Rating value={question1} onChange={(e) => setQuestion1(e.value)} cancel={false} />
          </div>
          <div className="page-input">
            <p className="page-input-label">
              Did you encounter any issues or bugs while using the application? If yes, please
              describe them.
            </p>
            <InputTextarea
              className="page-input-text"
              value={question2}
              onChange={(e) => setQuestion2(e.target.value)}
              rows={5}
              cols={30}
            />
          </div>
          <div className="page-input">
            <p className="page-input-label">How easy was it to navigate through the application?</p>
            <Dropdown
              className="page-input-text"
              value={question3}
              onChange={(e) => setQuestion3(e.value)}
              options={question3Options}
              optionLabel="name"
              placeholder="Select an option"
            />
          </div>
          <div className="page-input">
            <p className="page-input-label">
              What features did you find most useful, and what features do you think could be
              improved?
            </p>
            <InputTextarea
              className="page-input-text"
              value={question4}
              onChange={(e) => setQuestion4(e.target.value)}
              rows={5}
              cols={30}
            />
          </div>
          <div className="page-input">
            <p className="page-input-label">
              Would you recommend this application to others? Why or why not?
            </p>
            <InputTextarea
              className="page-input-text"
              value={question5}
              onChange={(e) => setQuestion5(e.target.value)}
              rows={5}
              cols={30}
            />
          </div>
          <Button label="Submit" severity="danger" />
        </div>
      </div>
    </>
  );
};

export default Feedback;
