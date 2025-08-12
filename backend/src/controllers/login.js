import { Router } from "express";

const router = Router();

export const login = async (req, res) => {
  // This is a temporary setup in order to deploy the application to fly and make sure frontend -> backend connection works!
  return res.status(200).json({
    ok: true,
    message: "Connection to frontend is working from backend!",
    at: new Date().toISOString(),
  });
};

router.post("/login", login);

export default router;
