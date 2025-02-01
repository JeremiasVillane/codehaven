export function sanitizeInput(
  e: React.ChangeEvent<HTMLInputElement>,
  setter: (value: string) => void
) {
  let inputValue = e.target.value;

  inputValue = inputValue.replace(/[^a-zA-Z0-9-_. ]/g, ""); // only letters, numbers, '-', '_', '.' and spaces
  inputValue = inputValue.replace(/\s+/g, " "); // delete multiple spaces

  setter(inputValue);
}
