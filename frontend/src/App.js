import React, { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [data_url, setdata_url] = useState("");
  const [code, setcode] = useState("");
  const [verified, setVerified] = useState(false);
  const API_URL = "http://localhost:3001";
  const registerUser = async () => {
    try {
      const response = await axios.post(`${API_URL}/register`, { email });
      setSecret(response.data.userSecretKey);
      setdata_url(response.data.data_url);
    } catch (error) {
      console.error(error);
    }
  };

  const verifycode = async () => {
    try {
      const response = await axios.post(`${API_URL}/verify`, { email, code });
      setVerified(response.data.verified);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>2FA Demo</h1>
      <div>
        <input
          type="text"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={registerUser}>Register</button>
      </div>
      {secret && (
        <div>
          <img src={data_url} alt="QR Code" />
          <p>Scan the QR code using your authenticator app</p>
          <div style={{ padding: "5px" }}>{secret}</div>
        </div>
      )}
      {secret && (
        <div>
          <input
            type="text"
            placeholder="Enter your 2FA code"
            onChange={(e) => setcode(e.target.value)}
          />
          <button onClick={verifycode}>Verify</button>
        </div>
      )}
      {verified && <p>2FA verified successfully!</p>}
    </div>
  );
}

export default App;
