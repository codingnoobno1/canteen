"use client";

import { ClerkProvider } from "@clerk/nextjs"; // Import ClerkProvider
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { useState } from "react";
import { Container, Box, Button, Paper } from "@mui/material";
import Register from "./Register";
import Login from "./Login";

export default function Page() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <ClerkProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Container
            maxWidth="sm"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              width: "100%",
              position: "relative",
            }}
          >
            {/* Toggle Button */}
            <Box
              sx={{
                position: "absolute",
                top: 20,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <Button
                variant="contained"
                onClick={() => setIsRegister(!isRegister)}
                sx={{ width: "fit-content", paddingX: 3 }}
              >
                {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register"}
              </Button>
            </Box>

            {/* Auth Forms */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                mt: 8,
              }}
            >
              <Paper
                elevation={4}
                sx={{
                  width: "100%",
                  maxWidth: "400px",
                  borderRadius: 2,
                  padding: 4,
                }}
              >
                {isRegister ? <Register /> : <Login />}
              </Paper>
            </Box>
          </Container>
        </PersistGate>
      </Provider>
    </ClerkProvider>
  );
}
