import { useRef, useState } from 'react';

export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const valuesRef = useRef(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => {
      const nextValues = { ...prev, [name]: value };
      valuesRef.current = nextValues;

      if (touched[name] && validate) {
        const fieldErrors = validate(nextValues);
        setErrors(prevErrors => ({ ...prevErrors, [name]: fieldErrors[name] }));
      }

      return nextValues;
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    if (validate) {
      const fieldErrors = validate(valuesRef.current);
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  const handleSubmit = async (onSubmit) => {
    const currentValues = valuesRef.current;

    if (validate) {
      const formErrors = validate(currentValues);
      setErrors(formErrors);
      const allTouched = Object.keys(currentValues).reduce(
        (acc, key) => ({ ...acc, [key]: true }), {}
      );
      setTouched(allTouched);

      if (Object.values(formErrors).some(Boolean)) {
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await onSubmit(currentValues);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    valuesRef.current = initialValues;
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
}

export default useForm;
