const pino = require( "pino");;

const transport = pino.transport({
    targets: [
        {
            level: process.env.LOG_LEVEL || "info",
            target: "pino-pretty",
            options: {}
        },
        {
            level: "trace",
            target: "pino/file",
            options: {
                destination: "logs/logger.log",
                filters: {
                    info: "info.log",
                    warn: "warn.log",
                    error: "error.log"
                }
            }
        }
    ]
});

const pinoLogger = pino(transport);

module.exports = pinoLogger;