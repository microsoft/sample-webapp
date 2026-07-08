import React, { useState } from 'react';

/**
 * Feedback page. Self-contained, testable feature: a rating (1-5) plus an
 * optional comment, with validation that a rating is chosen before submit.
 */
function Feedback() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5.');
      setSubmitted(false);
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="page feedback-page" style={{ maxWidth: 480, margin: '2rem auto', padding: '1rem' }}>
      <h1>Feedback</h1>
      <p>How would you rate your experience?</p>

      <form onSubmit={handleSubmit} aria-label="feedback-form" noValidate>
        <div role="radiogroup" aria-label="rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} style={{ marginRight: 8 }}>
              <input
                type="radio"
                name="rating"
                value={n}
                checked={rating === n}
                onChange={() => setRating(n)}
                data-testid={`feedback-rating-${n}`}
              />
              {n}
            </label>
          ))}
        </div>

        <label htmlFor="feedback-comment">Comment (optional)</label>
        <textarea
          id="feedback-comment"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          data-testid="feedback-comment"
        />

        <button type="submit" data-testid="feedback-submit">
          Send feedback
        </button>
      </form>

      {submitted && (
        <p role="status" data-testid="feedback-success" style={{ color: 'green' }}>
          Thanks for your feedback!
        </p>
      )}
      {error && (
        <p role="alert" data-testid="feedback-error" style={{ color: 'red' }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default Feedback;
