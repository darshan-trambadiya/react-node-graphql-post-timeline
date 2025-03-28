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
 * Login Component
 *
 * A reusable login form component that handles user authentication.
 *
 * @param {Object} props - Component props
 * @param {Function} props.onLogin - Callback function triggered when the form is submitted
 * @param {boolean} [props.loading=false] - Whether the form is in a loading state
 * @returns {React.Element} - Rendered login form component
 */
const Login = ({ onLogin, loading = false }) => {
  // State for form fields and validation
  const [loginForm, setLoginForm] = useState({
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
  });

  const [formIsValid, setFormIsValid] = useState(false);

  // Handle input changes
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    let isValid = true;
    for (const validator of loginForm[name].validators) {
      isValid = isValid && validator(value);
    }

    const updatedForm = {
      ...loginForm,
      [name]: {
        ...loginForm[name],
        valid: isValid,
        value: value,
      },
    };

    let isFormValid = true;
    for (const inputName in updatedForm) {
      isFormValid = isFormValid && updatedForm[inputName].valid;
    }

    setLoginForm(updatedForm);
    setFormIsValid(isFormValid);
  };

  // Handle input blur
  const inputBlurHandler = (input) => {
    setLoginForm((prevForm) => ({
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
    onLogin(e, {
      email: loginForm.email.value,
      password: loginForm.password.value,
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
          value={loginForm.email.value}
          valid={loginForm.email.valid}
          touched={loginForm.email.touched}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          control="input"
          onChange={inputChangeHandler}
          onBlur={() => inputBlurHandler("password")}
          value={loginForm.password.value}
          valid={loginForm.password.valid}
          touched={loginForm.password.touched}
        />
        <Button
          design="raised"
          type="submit"
          disabled={!formIsValid}
          loading={loading}
        >
          Login
        </Button>
      </form>
    </Auth>
  );
};

export default Login;
