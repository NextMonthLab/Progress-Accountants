import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set custom CSS variables for the Progress Accountants brand colors
document.documentElement.style.setProperty('--navy', '#003865');
document.documentElement.style.setProperty('--orange', '#F27030');
document.documentElement.style.setProperty('--light-grey', '#F9F9F9');
document.documentElement.style.setProperty('--dark-grey', '#666666');
document.documentElement.style.setProperty('--divider', '#E6E6E6');

createRoot(document.getElementById("root")!).render(<App />);
