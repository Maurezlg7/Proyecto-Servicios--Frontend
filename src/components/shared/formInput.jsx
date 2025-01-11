import '../../assets/css/formInput.css';

const FormInput = ({ label, type, name, value, onChange, placeholder, error }) => {
    return (
        <div className="form-input">
            {label && <label htmlFor={name}>{label}</label>}
            <input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`input ${error ? "input-error" : ""}`}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default FormInput;
