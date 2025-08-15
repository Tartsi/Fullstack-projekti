import pino from "pino";

/**
 * Creates a logger instance using the `pino` logging library.
 * The logger is configured with the following options:
 * - Pretty-printing is enabled using the `pino-pretty` transport.
 * - Logs are colorized for better readability.
 * - Timestamps are formatted as "dd-mm-yyyy HH:MM:ss".
 * - The `pid` and `hostname` fields are ignored in the log output.
 */
const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
      ignore: "pid,hostname",
    },
  },
});

export default logger;
