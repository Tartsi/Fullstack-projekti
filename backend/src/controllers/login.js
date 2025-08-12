import { Router } from "express";

const router = Router();

export const login = async (req, res) => {
  // TODO: Replace with proper authentication logic!
  return res.status(200).json({
    ok: true,
    message: "Connection to frontend is working from backend!",
    at: new Date().toISOString(),
  });
};

router.post("/login", login);

export default router;
