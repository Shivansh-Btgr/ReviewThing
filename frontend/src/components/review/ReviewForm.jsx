
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const ReviewForm = () => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const formik = useFormik({
    initialValues: {
      school_name: "",
      reviewer_name: "",
      rating: "",
      comment: "",
    },
    validationSchema: Yup.object({
      school_name: Yup.string()
        .trim()
        .max(100, "Max 100 characters")
        .required("School name is required"),
      reviewer_name: Yup.string()
        .trim()
        .max(100, "Max 100 characters")
        .required("Reviewer name is required"),
      rating: Yup.number()
        .typeError("Rating is required")
        .integer("Rating must be an integer")
        .min(1, "Min 1")
        .max(5, "Max 5")
        .required("Rating is required"),
      comment: Yup.string()
        .trim()
        .max(1000, "Max 1000 characters")
        .required("Comment is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setLoading(true);
      setSubmitError("");
      setSubmitSuccess("");
      try {
        const response = await fetch("http://127.0.0.1:5000/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            school_name: values.school_name.trim(),
            reviewer_name: values.reviewer_name.trim(),
            rating: Number(values.rating),
            comment: values.comment.trim(),
          }),
        });
        if (response.ok) {
          setSubmitSuccess("Review submitted successfully!");
          setTimeout(() => {
            window.location.href = "/reviews";
          }, 1200);
        } else {
          const data = await response.json();
          setSubmitError(data?.detail || "Failed to submit review");
        }
      } catch (err) {
        setSubmitError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="login-container">
      <h2 className="form-title">Add a School Review</h2>
      {submitError && <div className="error-message" style={{ marginBottom: 16 }}>{submitError}</div>}
      {submitSuccess && <div className="success-message" style={{ marginBottom: 16, color: 'green' }}>{submitSuccess}</div>}
      <form className="login-form" onSubmit={formik.handleSubmit} noValidate>
        <div className="input-wrapper">
          <label htmlFor="school_name">School Name</label>
          <input
            id="school_name"
            name="school_name"
            type="text"
            maxLength={100}
            placeholder=""
            className="input-field"
            value={formik.values.school_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.school_name && formik.errors.school_name && (
            <div className="error-message" style={{ float: 'right', minWidth: 120, textAlign: 'right' }}>{formik.errors.school_name}</div>
          )}
        </div>
        <div className="input-wrapper">
          <label htmlFor="reviewer_name">Reviewer Name</label>
          <input
            id="reviewer_name"
            name="reviewer_name"
            type="text"
            maxLength={100}
            placeholder=""
            className="input-field"
            value={formik.values.reviewer_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.reviewer_name && formik.errors.reviewer_name && (
            <div className="error-message" style={{ float: 'right', minWidth: 120, textAlign: 'right' }}>{formik.errors.reviewer_name}</div>
          )}
        </div>
        <div className="input-wrapper">
          <label htmlFor="rating">Rating</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {[1,2,3,4,5].map((star) => (
              <span
                key={star}
                style={{
                  cursor: 'pointer',
                  fontSize: 28,
                  color: formik.values.rating >= star ? '#FFD600' : '#C7C7C7',
                  transition: 'color 0.2s',
                  userSelect: 'none',
                }}
                onClick={() => formik.setFieldValue('rating', star)}
                onMouseEnter={() => formik.setFieldTouched('rating', true, true)}
                role="button"
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                ★
              </span>
            ))}
          </div>
          {formik.touched.rating && formik.errors.rating && (
            <div className="error-message" style={{ float: 'right', minWidth: 120, textAlign: 'right' }}>{formik.errors.rating}</div>
          )}
        </div>
        <div className="input-wrapper">
          <label htmlFor="comment">Comment</label>
          <textarea
            id="comment"
            name="comment"
            maxLength={1000}
            placeholder=""
            className="input-field"
            value={formik.values.comment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            rows={5}
          />
          {formik.touched.comment && formik.errors.comment && (
            <div className="error-message" style={{ float: 'right', minWidth: 120, textAlign: 'right' }}>{formik.errors.comment}</div>
          )}
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;
