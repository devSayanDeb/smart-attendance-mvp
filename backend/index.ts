import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// In-memory DB
const sessions: any[] = [];
const attendance: any[] = [];

app.post("/session", (req, res) => {
  const { teacherId, startTime, endTime } = req.body;
  const session = {
    id: `session-${Date.now()}`,
    teacherId,
    startTime,
    endTime,
    otp: Math.floor(100000 + Math.random() * 900000).toString(),
    bluetoothBeaconId: `beacon-${Date.now()}`
  };
  sessions.push(session);
  res.json({ session });
});

app.post("/attendance", (req, res) => {
  const { sessionId, studentId, deviceId, otp, ip, browserFingerprint } = req.body;
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }
  if (session.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }
  attendance.push({ sessionId, studentId, deviceId, otp, ip, browserFingerprint, timestamp: Date.now() });
  res.json({ status: "Attendance marked" });
});

app.listen(5000, () => {
  console.log("Backend listening on port 5000");
});