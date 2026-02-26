export default function InputField({ label, type, placeholder, value, setValue, className }) {
    return (
        <div className="mb-3">
            <label className={"mb-1 "+className}>{label}</label>
            <input 
                className="form-control"
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    )
}