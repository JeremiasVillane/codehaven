import IndexPage from "@/pages/Index";
import Providers from "./contexts/Providers";

const App = () => (
  <Providers>
    <IndexPage />
  </Providers>
);

export default App;
