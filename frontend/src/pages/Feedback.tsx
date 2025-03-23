import React, { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router";

import { Toast } from "primereact/toast";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";

import { addFeedback } from "../services/feedback.service";

import "./../styles/Feedback.scss";

const Feedback: React.FC = () => {
  const navigate = useNavigate();
  const toastRef = useRef<any>(null);
  const userId = sessionStorage.getItem("userId");

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

  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId]);

  return (
    <>
      <Toast ref={toastRef} position="bottom-center" />

      <div className="page">
        <h1 className="page-title">Anonymous Feedback Form</h1>
        <div className="page-inputs">
          <div className="page-input">
            <p className="page-input-label">
              On a scale of 1-5, how satisfied are you with your overall experience using this
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
          <Button
            label="Submit"
            severity="danger"
            onClick={() => {
              addFeedback({
                satisfaction: question1,
                issues: question2,
                easiness: question3,
                features: question4,
                recommendation: question5,
              });
              toastRef.current.show({
                severity: "success",
                summary: "Feedback form submitted",
                detail: (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <Button
                      className="p-button-sm p-button-text"
                      label="Go to Menu"
                      severity="danger"
                      onClick={() => navigate("/menu")}
                    />
                  </div>
                ),
                life: 2500,
              });
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Feedback;
