import React from "react";
import { createClient } from "@connect2ic/core";
import { defaultProviders } from "@connect2ic/core/providers";
import { ConnectDialog, Connect2ICProvider } from "@connect2ic/react";
import Profile from "./components/Profile";
import Login from "./components/Login";
import { UserDetailsProvider } from "./components/Context/UserContext";
import Layout from "./components/Layout";
// import "@connect2ic/core/style.css";

function App() {
  return (
    <UserDetailsProvider>
      <Layout>
        <>
          <Login />
          <Profile />
        </>
      </Layout>
    </UserDetailsProvider>
  );
}

const client = createClient({
  // @ts-ignore
  providers: defaultProviders,
});

export default () => (
  <Connect2ICProvider client={client}>
    <App />
  </Connect2ICProvider>
);
