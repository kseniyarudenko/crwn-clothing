import { useState } from "react";
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../../utils/firebase/firebase.utils";

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
        <label htmlFor="displayName">Display Name</label>
        <input
          required
          type="text"
          name="displayName"
          value={displayName}
          onChange={handleChange}
        />

        <label htmlFor="email">Email</label>
        <input
          required
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
        />

        <label htmlFor="password">Password</label>
        <input
          required
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          minLength={6}
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          required
          type="password"
          name="confirmPassword"
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
