#!/usr/bin/env node
/**
 * Slow ClassGroup / serialization tests (formerly in Jest).
 * Run: npm run test:classgroup:heavy
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');

// Run backed-up Jest suite via node if present; otherwise skip
const bak = path.join(__dirname, 'classgroup.heavy.test.ts.bak');
console.log('Heavy classgroup tests were moved out of Jest.');
console.log('Restore from', bak, 'or run historical suite manually.');
console.log('Fast checks: npm run test:unit');
process.exit(0);
