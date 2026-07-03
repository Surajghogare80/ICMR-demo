// src/utils/logger.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, '../../logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const levels = { ERROR: 'ERROR', WARN: 'WARN', INFO: 'INFO', DEBUG: 'DEBUG' };

const writeLog = (level, message, meta = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(meta && { meta }),
  };
  const logStr = JSON.stringify(logEntry);

  // Console output
  const colors = {
    ERROR: '\x1b[31m',
    WARN: '\x1b[33m',
    INFO: '\x1b[36m',
    DEBUG: '\x1b[37m',
  };
  const reset = '\x1b[0m';
  console.log(`${colors[level]}[${timestamp}] [${level}] ${message}${reset}`);

  // File output
  const logFile = path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(logFile, logStr + '\n');
};

const logger = {
  error: (message, meta) => writeLog(levels.ERROR, message, meta),
  warn: (message, meta) => writeLog(levels.WARN, message, meta),
  info: (message, meta) => writeLog(levels.INFO, message, meta),
  debug: (message, meta) => writeLog(levels.DEBUG, message, meta),
};

export default logger;
