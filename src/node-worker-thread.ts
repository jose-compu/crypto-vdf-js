// Copyright 2025 VDF-JS Contributors
// Licensed under the Apache License, Version 2.0.
/**
 * worker_threads entry script for Node (issue #10).
 */
import { parentPort } from 'worker_threads';
import { handleWorkerRequest } from './worker-handler';
import type { WorkerRequest } from './worker-protocol';

if (!parentPort) {
  throw new Error('node-worker-thread must run inside worker_threads');
}

parentPort.on('message', async (msg: WorkerRequest) => {
  const res = await handleWorkerRequest(msg);
  parentPort!.postMessage(res);
});
