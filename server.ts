import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Stripe (Lazy loading as per guidelines)
  let stripe: Stripe | null = null;
  const getStripe = () => {
    if (!stripe) {
      const secretKey = process.env.STRIPE_SECRET_KEY;
      if (!secretKey) {
        // Fallback for demo mode if no key is provided yet
        console.warn("STRIPE_SECRET_KEY is missing. Payment features will be in demo mode.");
        return null;
      }
      stripe = new Stripe(secretKey);
    }
    return stripe;
  };

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Stripe Checkout Session Creation
  app.post("/api/create-checkout-session", async (req, res) => {
    const { amount, userId, currency = "usd" } = req.body;
    
    const stripeClient = getStripe();
    if (!stripeClient) {
      return res.status(200).json({ 
        id: "demo_session_" + Math.random().toString(36).substring(7),
        url: "/payment-success?demo=true&amount=" + amount,
        message: "Demo mode: No actual payment will be processed."
      });
    }

    try {
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: "GMP Wallet Deposit",
                description: "Deposit funds into your Gaming Marketplace wallet.",
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.APP_URL || "http://localhost:3000"}/wallet?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_URL || "http://localhost:3000"}/wallet`,
        metadata: {
          userId,
        },
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Mock Withdrawal API
  app.post("/api/withdraw", async (req, res) => {
    const { amount, userId, destination } = req.body;
    // In a real app, you'd use Stripe Payouts or another service here.
    console.log(`Withdrawal requested: ${amount} for user ${userId} to ${destination}`);
    
    // Simulate processing
    setTimeout(() => {
      res.json({ status: "success", message: "Withdrawal processed. Funds should arrive shortly." });
    }, 1000);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GMP Server running on http://localhost:${PORT}`);
  });
}

startServer();
