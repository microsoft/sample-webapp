import React, { useState } from 'react';
import { useForm } from '../hooks/useForm';
import Toast from '../components/Toast';
import './Contact.css';

const initialValues = { name: '', email: '', message: '' };

const validate = (values) => {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.message.trim()) {
    errors.message = 'Message is required';
  } else if (values.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  return errors;
};

function Contact() {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  } = useForm(initialValues, validate);

  const [toast, setToast] = useState(null);

  const onSubmit = () => {
    setToast({ type: 'success', message: 'Thanks! Your message has been sent.' });
    reset();
  };

  return (
    <div className="contact">
      <h1>Contact Us</h1>
      <p className="contact-intro">
        Have a question or feedback? Fill out the form below and we&apos;ll get back to you.
      </p>

      <form
        id="contact-page-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit);
        }}
      >
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.name && errors.name)}
          />
          {touched.name && errors.name && (
            <span className="field-error" role="alert">{errors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.email && errors.email)}
          />
          {touched.email && errors.email && (
            <span className="field-error" role="alert">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            placeholder="Your message"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.message && errors.message)}
          />
          {touched.message && errors.message && (
            <span className="field-error" role="alert">{errors.message}</span>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Contact;
