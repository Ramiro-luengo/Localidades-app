const winston = require('winston');

const getLogger = (filename) => {
    const logger = winston.createLogger({
        format: winston.format.json(),
        defaultMeta: { module: filename },
        transports: [
            new winston.transports.File({ filename: 'logs/errors.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/all.log' }),
        ],
    });

    if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }));
    }

    return logger
}

module.exports = getLogger