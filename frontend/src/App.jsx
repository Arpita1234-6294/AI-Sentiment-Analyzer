import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://ai-sentiment-analyzer-2-z67b.onrender.com";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // =========================
  // GET HISTORY
  // =========================

  const getHistory = async () => {
    try {
      const currentToken = localStorage.getItem("token");

      if (!currentToken) return;

      const response = await axios.get(
        `${API_URL}/history`,
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      setHistory(response.data);
    } catch (error) {
      console.log(
        "History Error:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
      }
    }
  };

  // =========================
  // LOGIN / REGISTER
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const response = await axios.post(
          `${API_URL}/login`,
          {
            email: email,
            password: password,
          }
        );

        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);

        setMessage("Login successful 🎉");

        setEmail("");
        setPassword("");
      } else {
        const response = await axios.post(
          `${API_URL}/register`,
          {
            name: name,
            email: email,
            password: password,
          }
        );

        setMessage(response.data.message);

        setName("");
        setEmail("");
        setPassword("");

        setIsLogin(true);
      }
    } catch (error) {
      console.log(
        "Auth Error:",
        error.response?.data || error.message
      );

      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong");
      }
    }
  };

  // =========================
  // SENTIMENT ANALYSIS
  // =========================

  const analyze = async () => {
    if (!text.trim()) {
      setMessage("Please enter some text first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const currentToken = localStorage.getItem("token");

      if (!currentToken) {
        setMessage("Please login first.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/predict`,
        {
          text: text,
        },
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      setResult(response.data.sentiment);
      setConfidence(response.data.confidence);

      await getHistory();
    } catch (error) {
      console.log(
        "Prediction Error:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setToken(null);

        setMessage(
          "Session expired. Please login again."
        );
      } else {
        setMessage(
          error.response?.data?.error ||
          "Prediction failed. Please try again."
        );
      }
    }

    setLoading(false);
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setResult("");
    setConfidence(null);
    setHistory([]);
    setText("");
  };

  // =========================
  // LOAD HISTORY
  // =========================

  useEffect(() => {
    if (token) {
      getHistory();
    }
  }, [token]);



  // ============================================================
  // LOGIN / REGISTER PAGE
  // ============================================================

  if (!token) {
    return (
      <div style={authPageStyle}>

        <div style={authCardStyle}>

          <div style={logoCircleStyle}>
            🤖
          </div>

          <h1 style={authTitleStyle}>
            AI Sentiment Analyzer
          </h1>

          <p style={authSubtitleStyle}>
            Understand the emotion behind your text
          </p>

          <h2 style={authHeadingStyle}>
            {isLogin
              ? "Welcome Back"
              : "Create Your Account"}
          </h2>

          <form onSubmit={handleSubmit}>

            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                style={inputStyle}
              />
            )}

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              style={inputStyle}
            />

            <button
              type="submit"
              style={primaryButtonStyle}
            >
              {isLogin
                ? "Login"
                : "Create Account"}
            </button>

          </form>

          {message && (
            <p style={messageStyle}>
              {message}
            </p>
          )}

          <div style={switchAuthStyle}>

            <span>
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>

            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
              }}
              style={linkButtonStyle}
            >
              {isLogin
                ? "Register"
                : "Login"}
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // DASHBOARD
  // ============================================================

  return (
    <div style={dashboardStyle}>

      {/* ================= HEADER ================= */}

      <div style={headerStyle}>

        <div>

          <h1
            style={{
              margin: 0,
              fontSize: "28px"
            }}
          >
            🤖 AI Sentiment Analyzer
          </h1>

          <p
            style={{
              marginTop: "8px",
              marginBottom: 0,
              color: "#9ca3af",
              fontSize: "15px"
            }}
          >
            AI-powered sentiment analysis using
            Machine Learning
          </p>

        </div>

        <button
          onClick={logout}
          style={logoutButtonStyle}
        >
          Logout
        </button>

      </div>

      {/* ================= MAIN CONTENT ================= */}

      <div style={mainContentStyle}>

        {/* HERO */}

        <div style={heroStyle}>

          <h2
            style={{
              marginTop: 0,
              fontSize: "28px"
            }}
          >
            Analyze Your Text
          </h2>

          <p
            style={{
              color: "#9ca3af",
              marginBottom: "25px"
            }}
          >
            Enter a review, feedback, or message
            and let AI determine its sentiment.
          </p>

          <textarea
            placeholder="Example: I really love this product..."
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
            rows="7"
            style={textareaStyle}
          />

          <button
            onClick={analyze}
            disabled={loading}
            style={{
              ...analyzeButtonStyle,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading
              ? "Analyzing..."
              : "✨ Analyze Sentiment"}
          </button>

          {message && (
            <p style={dashboardMessageStyle}>
              {message}
            </p>
          )}

        </div>

        {/* ================= RESULT ================= */}

        {result && (
          <div style={resultCardStyle}>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >

              <div>

                <p
                  style={{
                    color: "#9ca3af",
                    marginBottom: "8px"
                  }}
                >
                  Prediction Result
                </p>

                <h2
                  style={{
                    margin: 0,
                    fontSize: "30px"
                  }}
                >
                  {result === "positive"
                    ? "😊 Positive"
                    : "😞 Negative"}
                </h2>

              </div>

              <div style={confidenceCircleStyle}>
                {confidence}%
              </div>

            </div>

            <div style={progressBackgroundStyle}>

              <div
                style={{
                  ...progressStyle,
                  width: `${confidence}%`
                }}
              />

            </div>

            <p
              style={{
                marginTop: "12px",
                color: "#9ca3af"
              }}
            >
              Model confidence:{" "}
              <strong style={{ color: "white" }}>
                {confidence}%
              </strong>
            </p>

          </div>
        )}

        {/* ================= HISTORY ================= */}

        <div style={historySectionStyle}>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >

            <div>

              <h2
                style={{
                  marginBottom: "5px"
                }}
              >
                📜 Prediction History
              </h2>

              <p
                style={{
                  color: "#9ca3af",
                  marginTop: 0
                }}
              >
                Your previous sentiment analyses
              </p>

            </div>

            <div style={historyCountStyle}>
              {history.length}
            </div>

          </div>

          {history.length === 0 ? (

            <div style={emptyHistoryStyle}>
              <div
                style={{
                  fontSize: "40px"
                }}
              >
                📭
              </div>

              <p>
                No predictions yet.
              </p>

              <span
                style={{
                  color: "#6b7280",
                  fontSize: "14px"
                }}
              >
                Analyze your first text above.
              </span>
            </div>

          ) : (

            <div>

              {history.map((item) => (

                <div
                  key={item._id}
                  style={historyCardStyle}
                >

                  <div>

                    <p
                      style={{
                        marginTop: 0,
                        marginBottom: "10px",
                        lineHeight: "1.6"
                      }}
                    >
                      <strong>
                        Text:
                      </strong>{" "}
                      {item.text}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        flexWrap: "wrap"
                      }}
                    >

                      <span>
                        <strong>
                          Sentiment:
                        </strong>{" "}

                        {item.sentiment ===
                        "positive"
                          ? "😊 Positive"
                          : "😞 Negative"}
                      </span>

                      <span>
                        <strong>
                          Confidence:
                        </strong>{" "}
                        {item.confidence}%
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

// ============================================================
// STYLES
// ============================================================

const authPageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  boxSizing: "border-box",
  background:
    "linear-gradient(135deg, #0f172a, #111827, #172554)",
  color: "white"
};

const authCardStyle = {
  width: "100%",
  maxWidth: "420px",
  padding: "40px",
  borderRadius: "24px",
  background: "rgba(17, 24, 39, 0.95)",
  border: "1px solid #374151",
  boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
  boxSizing: "border-box"
};

const logoCircleStyle = {
  width: "70px",
  height: "70px",
  margin: "0 auto 20px",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "32px",
  background: "#18ac8e"
};

const authTitleStyle = {
  textAlign: "center",
  margin: 0,
  fontSize: "27px"
};

const authSubtitleStyle = {
  textAlign: "center",
  color: "#9ca3af",
  marginTop: "10px",
  marginBottom: "30px"
};

const authHeadingStyle = {
  textAlign: "center",
  marginBottom: "20px"
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "15px",
  boxSizing: "border-box",
  borderRadius: "10px",
  border: "1px solid #374151",
  background: "#1f2937",
  color: "white",
  outline: "none",
  fontSize: "15px"
};

const primaryButtonStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "22px",
  border: "none",
  borderRadius: "10px",
  background: "#18ac8e",
  color: "white",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer"
};

const messageStyle = {
  textAlign: "center",
  marginTop: "20px",
  color: "#34d399"
};

const switchAuthStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "5px",
  marginTop: "25px",
  color: "#9ca3af",
  fontSize: "14px"
};

const linkButtonStyle = {
  background: "none",
  border: "none",
  color: "#60a5fa",
  cursor: "pointer",
  fontSize: "14px"
};

const dashboardStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg, #0f172a, #111827, #172554)",
  color: "white",
  padding: "30px",
  boxSizing: "border-box"
};

const headerStyle = {
  maxWidth: "1050px",
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px"
};

const logoutButtonStyle = {
  padding: "11px 20px",
  border: "none",
  borderRadius: "9px",
  background: "#ef4444",
  color: "white",
  fontWeight: "600",
  cursor: "pointer"
};

const mainContentStyle = {
  maxWidth: "850px",
  margin: "55px auto"
};

const heroStyle = {
  padding: "30px",
  borderRadius: "20px",
  background: "rgba(17, 24, 39, 0.9)",
  border: "1px solid #374151",
  boxShadow: "0 15px 40px rgba(0,0,0,0.25)"
};

const textareaStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #374151",
  background: "#0f172a",
  color: "white",
  fontSize: "16px",
  lineHeight: "1.6",
  resize: "vertical",
  outline: "none",
  boxSizing: "border-box"
};

const analyzeButtonStyle = {
  marginTop: "18px",
  padding: "14px 25px",
  border: "none",
  borderRadius: "10px",
  background: "#18ac8e",
  color: "white",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer"
};

const dashboardMessageStyle = {
  marginTop: "15px",
  color: "#fbbf24"
};

const resultCardStyle = {
  marginTop: "25px",
  padding: "28px",
  borderRadius: "20px",
  background: "rgba(17, 24, 39, 0.9)",
  border: "1px solid #374151",
  boxShadow: "0 15px 40px rgba(0,0,0,0.2)"
};

const confidenceCircleStyle = {
  minWidth: "75px",
  height: "75px",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#18ac8e",
  fontSize: "18px",
  fontWeight: "700"
};

const progressBackgroundStyle = {
  width: "100%",
  height: "11px",
  marginTop: "25px",
  borderRadius: "10px",
  background: "#374151",
  overflow: "hidden"
};

const progressStyle = {
  height: "100%",
  borderRadius: "10px",
  background: "#18ac8e",
  transition: "width 0.5s ease"
};

const historySectionStyle = {
  marginTop: "45px"
};

const historyCountStyle = {
  minWidth: "35px",
  height: "35px",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#374151",
  color: "white",
  fontWeight: "600"
};

const emptyHistoryStyle = {
  marginTop: "20px",
  padding: "40px",
  textAlign: "center",
  borderRadius: "18px",
  background: "rgba(17, 24, 39, 0.8)",
  border: "1px solid #374151"
};

const historyCardStyle = {
  marginTop: "15px",
  padding: "20px",
  borderRadius: "14px",
  background: "rgba(17, 24, 39, 0.9)",
  border: "1px solid #374151",
  lineHeight: "1.5"
};

export default App;