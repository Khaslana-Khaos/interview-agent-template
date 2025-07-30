import { useRef, useState } from "react";
import "./App.scss";
import { LiveAPIProvider } from "./contexts/LiveAPIContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import SidePanel from "./components/side-panel/SidePanel";
import ControlTray from "./components/control-tray/ControlTray";
import LandingPage from "./components/landing/LandingPage";
import { GrammarAssistant } from "./components/grammar-assistant/GrammarAssistant";
import cn from "classnames";
import { LiveClientOptions } from "./types";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY as string;
if (typeof API_KEY !== "string") {
  throw new Error("set REACT_APP_GEMINI_API_KEY in .env");
}

const apiOptions: LiveClientOptions = {
  apiKey: API_KEY,
};

const StreamingConsole = () => {
  const { user, logout } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  return (
    <div className="streaming-console">
      {/* Initialize Grammar Assistant Configuration */}
      <GrammarAssistant />

      <SidePanel />
      <main>
        <div className="main-app-area">
          {/* User info and logout button */}
          <div className="user-header">
            <div className="user-info">
              <span className="welcome-text">Welcome, {user?.name}</span>
              <button className="logout-button" onClick={logout}>
                Logout
              </button>
            </div>
          </div>

          {/* Grammar Assistant Information */}
          <div className="assistant-info">
            <div className="assistant-card">
              <h2 className="assistant-title">Grammar Assistant</h2>
              <p className="assistant-description">
                I'm here to help you improve your speech! Speak naturally and I'll provide friendly corrections and suggestions to help you improve your grammar and language skills.
              </p>
              <div className="assistant-features">
                <span className="feature-tag">✓ Grammar Correction</span>
                <span className="feature-tag">✓ Pronunciation Help</span>
                <span className="feature-tag">✓ Language Tips</span>
              </div>
            </div>
          </div>

          {/* Video stream */}
          <video
            className={cn("stream", {
              hidden: !videoRef.current || !videoStream,
            })}
            ref={videoRef}
            autoPlay
            playsInline
          />
        </div>

        <ControlTray
          videoRef={videoRef}
          supportsVideo={true}
          onVideoStreamChange={setVideoStream}
        >
          {/* put your own buttons here */}
        </ControlTray>
      </main>
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {isAuthenticated ? (
        <LiveAPIProvider options={apiOptions}>
          <StreamingConsole />
        </LiveAPIProvider>
      ) : (
        <LandingPage />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
