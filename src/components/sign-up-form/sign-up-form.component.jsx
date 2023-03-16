import { useState } from "react";
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../../utils/firebase/firebase.utils";
import FormInput from "../form-input/form-input.component";

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

      await createUserDocumentFromAuth(user, { displayName });
      resetFormFields();
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setPasswordError("Cannot create user, email already in use");
        return;
      }
      console.error("user creation encountere an error", error.message);
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
    <div>
      <h1>Sign Up with your email and password</h1>
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
        {Boolean(passwordError) && <span>{passwordError}</span>}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
