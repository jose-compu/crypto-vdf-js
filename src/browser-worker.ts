// Copyright 2025 VDF-JS Contributors
// Licensed under the Apache License, Version 2.0.
/**
 * Browser Web Worker entry (issue #9).
 * Bundle separately or load via webpack worker-loader / new URL pattern.
 */
import { handleWorkerRequest } from './worker-handler';
import type { WorkerRequest } from './worker-protocol';

const ctx: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope;

ctx.onmessage = async (ev: MessageEvent<WorkerRequest>) => {
  const res = await handleWorkerRequest(ev.data);
  ctx.postMessage(res);
};
