import { useState, useContext } from "react";
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../../utils/firebase/firebase.utils";
import { UserContext } from "../../contexts/user.context";
import FormInput from "../form-input/form-input.component";
import Button from "../button/button.component";

import "./sign-up-form.styles.scss";

const defaultFormFields = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [passwordError, setPasswordError] = useState("");

  const { displayName, password, email, confirmPassword } = formFields;

  const { setCurrentUser } = useContext(UserContext);

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError(`Passwords do not match`);
      return;
    }
    setPasswordError("");

    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );
      setCurrentUser(user);
      await createUserDocumentFromAuth(user, { displayName });
      resetFormFields();
      setPasswordError("");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setPasswordError("Cannot create user, email already in use");
        return;
      }
      setPasswordError("User creation encounter an error");
      console.error("user creation encounter an error", error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  return (
    <div className="sign-up-container">
      <h2>Don't have an account?</h2>
      <span>Sign up with your email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          required
          type="text"
          name="displayName"
          label="Display Name"
          value={displayName}
          onChange={handleChange}
        />

        <FormInput
          required
          type="email"
          name="email"
          autoComplete="username"
          label="Email"
          value={email}
          onChange={handleChange}
        />

        <FormInput
          required
          type="password"
          name="password"
          autoComplete="new-password"
          label="Password"
          value={password}
          onChange={handleChange}
          minLength={6}
        />

        <FormInput
          required
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={handleChange}
          minLength={6}
        />
        {Boolean(passwordError) && (
          <p className="error-message">{passwordError}</p>
        )}

        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
};

export default SignUpForm;
