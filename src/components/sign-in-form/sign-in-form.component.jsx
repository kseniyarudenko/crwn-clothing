import { useState } from "react";
import {
  signInWithGooglePopup,
  createUserDocumentFromAuth,
  signInAuthUserWithEmailAndPassword,
} from "../../utils/firebase/firebase.utils";
import FormInput from "../form-input/form-input.component";
import Button from "../button/button.component";
import "./sign-in-form.styles.scss";

const defaultFormFields = {
  email: "",
  password: "",
};

const SignInForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [passwordError, setPasswordError] = useState("");

  const { password, email } = formFields;

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const signInWithGoogle = async () => {
    const { user } = await signInWithGooglePopup();
    await createUserDocumentFromAuth(user);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await signInAuthUserWithEmailAndPassword(email, password);
      resetFormFields();
      setPasswordError("");
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
          setPasswordError("Incorrect password or email");
          break;
        case "auth/user-not-found":
          setPasswordError("No user associated with this email");
          break;
        default:
          setPasswordError("User creation encounter an error");
      }
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
    <div className="sign-in-container">
      <h2>Already have an account?</h2>
      <span>Sign in with your email and password</span>
      <form onSubmit={handleSubmit}>
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
        {Boolean(passwordError) && (
          <p className="error-message">{passwordError}</p>
        )}
        <div className="buttons-container">
          <Button type="submit">Sign In</Button>
          <Button type="button" buttonType="google" onClick={signInWithGoogle}>
            Google sign in
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
