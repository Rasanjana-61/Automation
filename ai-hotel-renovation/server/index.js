import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

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

const Hotel = mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);
const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

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

app.post("/api/bookings", async (req, res) => {
  const payload = req.body;
  if (dbReady) {
    const booking = await Booking.create(payload);
    return res.json({ id: booking._id, ...booking.toObject() });
  }
  const booking = { id: `b-${Date.now()}`, ...payload };
  memoryBookings.push(booking);
  return res.json(booking);
});

app.get("/api/bookings/user/:id", async (req, res) => {
  const { id } = req.params;
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
  } catch (error) {
    return res.status(500).json({ reply: "AI service error. Try again." });
  }
});

app.post("/api/ai/recommend", (req, res) => {
  const { budget, guests, dates, preferences } = req.body;
  const numericBudget = Number(budget) || 150;
  const match = sampleHotels.find((hotel) => hotel.pricePerNight <= numericBudget) ||
    sampleHotels[0];

  return res.json({
    hotel: match.name,
    message: `For ${guests || 2} guests during ${dates || "your dates"}, ${match.name} fits your budget and offers ${match.amenities[0]}. ${
      preferences ? `It also matches your preference for ${preferences}.` : ""
    }`
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
