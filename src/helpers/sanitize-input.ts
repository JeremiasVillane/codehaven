export function sanitizeInput(value: string, setter: (value: string) => void) {
  let inputValue = value;

  inputValue = inputValue.replace(/[^a-zA-Z0-9-_. ]/g, ""); // only letters, numbers, '-', '_', '.' and spaces
  inputValue = inputValue.replace(/\s+/g, " "); // delete multiple spaces

  setter(inputValue);
}
