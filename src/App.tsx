import IndexPage from "@/pages/Index";
import { FileProvider } from "./contexts/FileContext";

const App = () => (
  <FileProvider>
    <IndexPage />
  </FileProvider>
);

export default App;
