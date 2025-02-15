interface InputFieldProps {
  label: string;
  inputType: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputField({ label, inputType, onChange }: InputFieldProps) {
  return (
    <>
      <div className="text-left m-2">
        <label className="font-semibold">{label}</label>
        <input
          className="w-full border border-sky-900 rounded-md focus:ring-2 focus:ring-sky-900 outline-none mt-1 px-1"
          type={inputType}
          onChange={onChange}
        ></input>
      </div>
    </>
  );
}
