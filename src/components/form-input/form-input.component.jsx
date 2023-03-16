import "./form-input.styles.scss";

const FormInput = ({ label, name, ...otherProps }) => {
  return (
    <div className="group">
      <input className="form-input" name={name} {...otherProps} />
      {label && (
        <label
          htmlFor={name}
          className={`${
            otherProps.value.length ? "shrink" : ""
          } form-input-label`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default FormInput;
