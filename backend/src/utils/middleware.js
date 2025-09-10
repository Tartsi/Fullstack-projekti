import logger from "./logger.js";

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Save body for logging request 'payload'
  const oldSend = res.send;
  res.send = function (body) {
    res.locals.body = body;
    return oldSend.call(this, body);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      {
        method: req.method,
        url: req.url,
        data: res.locals.body, // log what was sent
        status: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get("User-Agent"),
        ip: req.ip,
      },
      "HTTP Request"
    );
  });

  next();
};

// Error logging middleware
export const errorLogger = (err, req, res, next) => {
  logger.error(
    {
      error: err.message,
      stack: err.stack,
      method: req.method,
      url: req.url,
      ip: req.ip,
    },
    "Error occurred"
  );

  next(err);
};

// Authentication logging
export const authLogger = {
  loginAttempt: (username, ip) => {
    logger.info({ username, ip }, "Login attempt");
  },

  loginSuccess: (username, ip) => {
    logger.info({ username, ip }, "Login successful");
  },

  loginFailure: (username, ip, reason) => {
    logger.warn({ username, ip, reason }, "Login failed");
  },

  logout: (username, ip) => {
    logger.info({ username, ip }, "User logged out");
  },

  registration: (username, email, ip) => {
    logger.info({ username, email, ip }, "User registered");
  },

  userDeleted: (username, ip) => {
    logger.warn({ username, ip }, "User account deleted");
  },
};

// Authentication middleware for protected routes
export const requireAuth = (req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Attach user info to request for downstream handlers
  req.user = {
    id: req.session.userId,
    email: req.session.email,
  };

  next();
};
