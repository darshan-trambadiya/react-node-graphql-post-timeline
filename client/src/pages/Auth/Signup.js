// external
import React, { useState } from "react";

// components
import Input from "../../components/Form/Input/Input";
import Button from "../../components/Button/Button";

// utils
import { required, length, email } from "../../utils/validators";

// Auth
import Auth from "./Auth";

/**
 * Signup Component
 *
 * A reusable signup form component that handles user registration.
 *
 * @param {Object} props - Component props
 * @param {Function} props.onSignup - Callback function triggered when the form is submitted
 * @param {boolean} [props.loading=false] - Whether the form is in a loading state
 * @returns {React.Element} - Rendered signup form component
 */
const Signup = ({ onSignup, loading = false }) => {
  // State for form fields and validation
  const [signupForm, setSignupForm] = useState({
    email: {
      value: "",
      valid: false,
      touched: false,
      validators: [required, email],
    },
    password: {
      value: "",
      valid: false,
      touched: false,
      validators: [required, length({ min: 5 })],
    },
    name: {
      value: "",
      valid: false,
      touched: false,
      validators: [required, length({ min: 2, max: 30 })],
    },
  });

  const [formIsValid, setFormIsValid] = useState(false);

  // Handle input changes
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    let isValid = true;
    for (const validator of signupForm[name].validators) {
      isValid = isValid && validator(value);
    }

    const updatedForm = {
      ...signupForm,
      [name]: {
        ...signupForm[name],
        valid: isValid,
        value: value,
      },
    };

    let isFormValid = true;
    for (const inputName in updatedForm) {
      isFormValid = isFormValid && updatedForm[inputName].valid;
    }

    setSignupForm(updatedForm);
    setFormIsValid(isFormValid);
  };

  // Handle input blur
  const inputBlurHandler = (input) => {
    setSignupForm((prevForm) => ({
      ...prevForm,
      [input]: {
        ...prevForm[input],
        touched: true,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSignup(e, {
      email: signupForm.email.value,
      password: signupForm.password.value,
      name: signupForm.name.value,
    });
  };

  return (
    <Auth>
      <form onSubmit={handleSubmit}>
        <Input
          id="email"
          label="Your E-Mail"
          type="email"
          control="input"
          onChange={inputChangeHandler}
          onBlur={() => inputBlurHandler("email")}
          value={signupForm.email.value}
          valid={signupForm.email.valid}
          touched={signupForm.email.touched}
        />
        <Input
          id="name"
          label="Your Name"
          type="text"
          control="input"
          onChange={inputChangeHandler}
          onBlur={() => inputBlurHandler("name")}
          value={signupForm.name.value}
          valid={signupForm.name.valid}
          touched={signupForm.name.touched}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          control="input"
          onChange={inputChangeHandler}
          onBlur={() => inputBlurHandler("password")}
          value={signupForm.password.value}
          valid={signupForm.password.valid}
          touched={signupForm.password.touched}
        />
        <Button
          design="raised"
          type="submit"
          disabled={!formIsValid}
          loading={loading}
        >
          Signup
        </Button>
      </form>
    </Auth>
  );
};

export default Signup;
