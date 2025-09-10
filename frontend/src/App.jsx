import React from "react";
import Layout from "./components/Layout";
import { LanguageProvider } from "./i18n/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
