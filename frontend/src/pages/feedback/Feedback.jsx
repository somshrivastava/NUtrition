import { useState } from "react";
import "./Feedback.css";
import TopNav from "../../components/TopNav.jsx";
import Footer from "../../components/Footer.jsx";


// USE FORM 2 NOT FEEDBACK FORM. THIS DOESNT WORK
function Feedback() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, feedback });
    alert("Thank you for your feedback!");
    setEmail(email);
    setFeedback(feedback);
  };

  const onSubmit = async;

  return (
    <div>
      <TopNav />
      <div id="feedback-container">
        <h1>Feedback Form</h1>
        <div>
          <form onSubmit={handleSubmit} className="feedback-form">
            <div>
              <label htmlFor="name">Name: </label>
              <input type="text" />
            </div>
            {/* Email Input */}
            <div className="input-group">
              <label
                htmlFor="email"
                className="input-label"
                style={{ margin: 2 }}
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="valid northeastern email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />{" "}
            </div>

            <br />
            {/* Feedback Input */}
            <div className="input-group">
              <label htmlFor="feedback" className="input-label">
                Feedback
              </label>
              <textarea
                id="feedback"
                name="feedback"
                placeholder="Enter your feedback here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
                rows="5"
                className="textarea-field"
              ></textarea>
            </div>

            {/* Submit Button */}

            <button type="submit">
              <span class="icon">▶</span> Submit
            </button>
          </form>
          <p className="thank-you-text">Thank you for your feedback!</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Feedback;
