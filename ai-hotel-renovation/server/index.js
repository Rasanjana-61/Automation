import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const sampleHotels = [
  {
    id: "h1",
    name: "Aurora Bay Resort",
    location: "Goa, India",
    pricePerNight: 140,
    roomsAvailable: 9,
    rating: 4.7,
    description:
      "Ocean-facing suites with bamboo textures, rooftop pools, and sunset dining.",
    amenities: ["Infinity pool", "Spa", "Ocean view", "Airport shuttle"],
    roomTypes: ["Deluxe Suite", "Ocean Villa", "Family Studio"]
  },
  {
    id: "h2",
    name: "Skyline Atelier Hotel",
    location: "Dubai, UAE",
    pricePerNight: 210,
    roomsAvailable: 5,
    rating: 4.8,
    description:
      "Sky-lounge lobby with AI-powered lighting, smart rooms, and curated art walks.",
    amenities: ["Smart rooms", "Sky lounge", "Private dining", "Concierge"],
    roomTypes: ["Executive King", "Panorama Suite", "Residence Loft"]
  },
  {
    id: "h3",
    name: "Forestline Retreat",
    location: "Kandy, Sri Lanka",
    pricePerNight: 95,
    roomsAvailable: 12,
    rating: 4.5,
    description:
      "Wellness-forward cabins with biophilic design, yoga decks, and herbal cuisine.",
    amenities: ["Wellness deck", "Yoga studio", "Nature trails", "Tea lounge"],
    roomTypes: ["Garden Cabin", "Hilltop Suite", "Retreat Villa"]
  },
  {
    id: "h4",
    name: "Harborlight Boutique",
    location: "Lisbon, Portugal",
    pricePerNight: 160,
    roomsAvailable: 7,
    rating: 4.6,
    description:
      "Art-deco restoration with tiled courtyards, craft cocktails, and co-working.",
    amenities: ["Rooftop bar", "Coworking", "Boutique spa", "City tours"],
    roomTypes: ["Classic Queen", "Corner Suite", "Design Loft"]
  }
];

const bookingSites = [
  "Booking.com",
  "Agoda",
  "Trivago",
  "Expedia",
  "Hotels.com",
  "Kayak",
  "Trip.com",
  "MakeMyTrip"
];

const hotelSchema = new mongoose.Schema(
  {
    name: String,
    location: String,
    pricePerNight: Number,
    roomsAvailable: Number,
    rating: Number,
    description: String,
    amenities: [String],
    roomTypes: [String]
  },
  { timestamps: true }
);

const bookingSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    hotelId: String,
    roomType: String,
    checkIn: String,
    checkOut: String,
    guests: Number,
    total: Number,
    userId: String
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "guest" },
    lastLoginAt: Date
  },
  { timestamps: true }
);

const Hotel = mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);
const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_replace_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

let dbReady = false;
const mongoUri = process.env.MONGODB_URI;

if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(() => {
      dbReady = true;
      console.log("MongoDB connected");
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
    });
}

const memoryBookings = [];
const memoryUsers = [];
const bookingSessions = new Map();

const sanitizeUser = (user) => ({
  id: user.id || user._id?.toString(),
  fullName: user.fullName,
  email: user.email,
  role: user.role || "guest",
  createdAt: user.createdAt
});

const createToken = (user) =>
  jwt.sign({ userId: user.id || user._id?.toString(), email: user.email, role: user.role || "guest" }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });

const getBearerToken = (header) => {
  if (!header?.startsWith("Bearer ")) return null;
  return header.substring(7);
};

const requireAuth = (req, res, next) => {
  const token = getBearerToken(req.headers.authorization);
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.auth = payload;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const hashCode = (value) =>
  `${value}`
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

const getSitePrice = (hotel, siteName) => {
  const seed = hashCode(`${hotel.id}-${siteName}`) % 31;
  const modifier = (seed - 15) / 100;
  return Math.max(45, Math.round(hotel.pricePerNight * (1 + modifier)));
};

const enrichHotelWithComparisons = (hotel) => {
  const comparisons = bookingSites.map((site) => ({
    site,
    price: getSitePrice(hotel, site),
    bookingUrl: `https://example.com/book/${encodeURIComponent(hotel.name)}/${encodeURIComponent(
      site
    )}`
  }));
  const bestDeal = comparisons.reduce((best, current) =>
    current.price < best.price ? current : best
  );
  return { ...hotel, comparisons, bestDeal };
};

const getBookingStep = (session) => {
  if (!session.roomType) return "room_type";
  if (!session.checkIn || !session.checkOut) return "dates";
  if (!session.guests) return "guests";
  if (!session.guestName) return "guest_info";
  if (!session.confirmed) return "confirmation";
  return "completed";
};

const parseDates = (message) => {
  const rangeMatch = message.match(/(\d{4}-\d{2}-\d{2})\s*(to|-)\s*(\d{4}-\d{2}-\d{2})/i);
  if (!rangeMatch) return null;
  return { checkIn: rangeMatch[1], checkOut: rangeMatch[3] };
};

const parseGuests = (message) => {
  const match = message.match(/(\d+)\s*(guest|guests|adult|adults)/i);
  return match ? Number(match[1]) : null;
};

app.post("/api/auth/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  const normalizedEmail = (email || "").toLowerCase().trim();

  if (!fullName?.trim()) {
    return res.status(400).json({ message: "Full name is required" });
  }
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return res.status(400).json({ message: "Valid email is required" });
  }
  if (!PASSWORD_REGEX.test(password || "")) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, and number"
    });
  }

  if (dbReady) {
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash
    });
    const safeUser = sanitizeUser(user.toObject());
    const token = createToken(safeUser);
    return res.status(201).json({ token, user: safeUser });
  }

  const existing = memoryUsers.find((user) => user.email === normalizedEmail);
  if (existing) return res.status(409).json({ message: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = {
    id: `u-${Date.now()}`,
    fullName: fullName.trim(),
    email: normalizedEmail,
    passwordHash,
    role: "guest",
    createdAt: new Date().toISOString()
  };
  memoryUsers.push(user);
  const safeUser = sanitizeUser(user);
  const token = createToken(safeUser);
  return res.status(201).json({ token, user: safeUser });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = (email || "").toLowerCase().trim();

  if (!EMAIL_REGEX.test(normalizedEmail) || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (dbReady) {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    user.lastLoginAt = new Date();
    await user.save();

    const safeUser = sanitizeUser(user.toObject());
    const token = createToken(safeUser);
    return res.json({ token, user: safeUser });
  }

  const user = memoryUsers.find((item) => item.email === normalizedEmail);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  user.lastLoginAt = new Date().toISOString();
  const safeUser = sanitizeUser(user);
  const token = createToken(safeUser);
  return res.json({ token, user: safeUser });
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  const userId = req.auth.userId;
  if (dbReady) {
    const user = await User.findById(userId).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  }

  const user = memoryUsers.find((item) => item.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user: sanitizeUser(user) });
});

app.get("/api/hotels", async (_req, res) => {
  if (dbReady) {
    const hotels = await Hotel.find().limit(50);
    return res.json(hotels.map((hotel) => ({ ...hotel.toObject(), id: hotel._id })));
  }
  return res.json(sampleHotels);
});

app.get("/api/hotels/:id", async (req, res) => {
  const { id } = req.params;
  if (dbReady) {
    const hotel = await Hotel.findById(id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    return res.json({ ...hotel.toObject(), id: hotel._id });
  }
  const hotel = sampleHotels.find((item) => item.id === id);
  if (!hotel) return res.status(404).json({ message: "Hotel not found" });
  return res.json(hotel);
});

app.post("/api/bookings", requireAuth, async (req, res) => {
  const payload = { ...req.body, userId: req.auth.userId };
  if (dbReady) {
    const booking = await Booking.create(payload);
    return res.json({ id: booking._id, ...booking.toObject() });
  }
  const booking = { id: `b-${Date.now()}`, ...payload };
  memoryBookings.push(booking);
  return res.json(booking);
});

app.get("/api/bookings/user/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  if (req.auth.userId !== id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (dbReady) {
    const bookings = await Booking.find({ userId: id }).sort({ createdAt: -1 });
    return res.json(bookings.map((booking) => ({ ...booking.toObject(), id: booking._id })));
  }
  const bookings = memoryBookings.filter((booking) => booking.userId === id);
  return res.json(bookings);
});

app.post("/api/ai/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message is required" });

  if (!process.env.OPENAI_API_KEY) {
    return res.json({
      reply:
        "AI is offline. Add OPENAI_API_KEY in server/.env to enable live responses."
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful hotel concierge. Answer concisely and suggest best rooms."
          },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    return res.json({ reply: reply || "Sorry, I could not generate a reply." });
  } catch (_error) {
    return res.status(500).json({ reply: "AI service error. Try again." });
  }
});

app.post("/api/ai/recommend", (req, res) => {
  const { budget, guests, dates, preferences } = req.body;
  const numericBudget = Number(budget) || 150;
  const match =
    sampleHotels.find((hotel) => hotel.pricePerNight <= numericBudget) || sampleHotels[0];

  return res.json({
    hotel: match.name,
    message: `For ${guests || 2} guests during ${dates || "your dates"}, ${match.name} fits your budget and offers ${match.amenities[0]}. ${
      preferences ? `It also matches your preference for ${preferences}.` : ""
    }`
  });
});

app.post("/api/agent/search", (req, res) => {
  const query = `${req.body?.query || ""}`.trim();
  if (!query) return res.status(400).json({ message: "Search query is required" });

  const normalized = query.toLowerCase();
  const matched = sampleHotels
    .filter(
      (hotel) =>
        hotel.location.toLowerCase().includes(normalized) ||
        hotel.name.toLowerCase().includes(normalized) ||
        normalized.includes(hotel.location.toLowerCase().split(",")[0].trim().toLowerCase())
    )
    .slice(0, 15);

  const hotels = (matched.length ? matched : sampleHotels)
    .slice(0, 15)
    .map(enrichHotelWithComparisons);

  const prices = hotels.map((item) => item.bestDeal.price);
  const summary = {
    query,
    totalHotels: hotels.length,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    avgPrice: Math.round(prices.reduce((acc, value) => acc + value, 0) / prices.length)
  };

  return res.json({ summary, hotels });
});

app.post("/api/agent/booking/start", (req, res) => {
  const { hotelId } = req.body;
  if (!hotelId) return res.status(400).json({ message: "hotelId is required" });

  const hotel = sampleHotels.find((item) => item.id === hotelId);
  if (!hotel) return res.status(404).json({ message: "Hotel not found" });

  const sessionId = `s-${Date.now()}`;
  const session = {
    sessionId,
    hotelId: hotel.id,
    hotelName: hotel.name,
    roomType: "",
    checkIn: "",
    checkOut: "",
    guests: 0,
    guestName: "",
    confirmed: false,
    currentStep: "room_type"
  };
  bookingSessions.set(sessionId, session);

  return res.json({
    session,
    reply: `Booking started for ${hotel.name}. Choose room type: ${hotel.roomTypes.join(", ")}.`
  });
});

app.post("/api/agent/booking/message", (req, res) => {
  const { sessionId, message } = req.body;
  if (!sessionId || !message) {
    return res.status(400).json({ message: "sessionId and message are required" });
  }

  const session = bookingSessions.get(sessionId);
  if (!session) return res.status(404).json({ message: "Session not found" });

  const hotel = sampleHotels.find((item) => item.id === session.hotelId);
  const text = `${message}`.trim();
  const lower = text.toLowerCase();

  if (["cancel", "stop", "abort"].includes(lower)) {
    bookingSessions.delete(sessionId);
    return res.json({
      session: null,
      currentStep: "cancelled",
      reply: "Booking cancelled."
    });
  }

  if (["confirm", "yes", "confirm booking"].includes(lower) && getBookingStep(session) === "confirmation") {
    session.confirmed = true;
    session.currentStep = "completed";
    return res.json({
      session,
      currentStep: session.currentStep,
      reply: `Confirmed. Booking ID: BK-${Date.now()}.`
    });
  }

  const roomMatch =
    hotel?.roomTypes.find((room) => lower.includes(room.toLowerCase())) || null;
  if (roomMatch) session.roomType = roomMatch;

  const dateRange = parseDates(text);
  if (dateRange) {
    session.checkIn = dateRange.checkIn;
    session.checkOut = dateRange.checkOut;
  }

  const guestCount = parseGuests(text);
  if (guestCount) session.guests = guestCount;

  if (/name\s*[:\-]/i.test(text) || lower.startsWith("i am ") || lower.startsWith("my name is ")) {
    const cleaned = text
      .replace(/name\s*[:\-]/i, "")
      .replace(/my name is/i, "")
      .replace(/i am/i, "")
      .trim();
    if (cleaned) session.guestName = cleaned;
  }

  session.currentStep = getBookingStep(session);

  let reply = "";
  if (session.currentStep === "room_type") {
    reply = `Please select room type: ${hotel?.roomTypes.join(", ")}.`;
  } else if (session.currentStep === "dates") {
    reply = "Share dates in format YYYY-MM-DD to YYYY-MM-DD.";
  } else if (session.currentStep === "guests") {
    reply = "How many guests?";
  } else if (session.currentStep === "guest_info") {
    reply = "Please provide guest name (example: Name: Alex Morgan).";
  } else if (session.currentStep === "confirmation") {
    reply = `Summary: ${session.roomType}, ${session.checkIn} to ${session.checkOut}, ${session.guests} guests, guest ${session.guestName}. Type "confirm" to complete.`;
  } else {
    reply = "Booking completed.";
  }

  return res.json({
    session,
    currentStep: session.currentStep,
    reply
  });
});

app.post("/api/agent/booking/cancel", (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ message: "sessionId is required" });
  bookingSessions.delete(sessionId);
  return res.json({ message: "Booking session cancelled", currentStep: "cancelled" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
