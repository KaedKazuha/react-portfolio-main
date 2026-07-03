const THREAD_COLORS = ["#fdf2f8", "#fce7f3", "#e0e7ff", "#c7d2fe", "#fbcfe8", "#ddd6fe"];

export function drawChainThread(ctx, thread, time, reducedMotion) {
  if (thread.disconnected) return;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(thread.x0, thread.y0);
  ctx.bezierCurveTo(thread.x1, thread.y1, thread.x2, thread.y2, thread.x3, thread.y3);
  ctx.strokeStyle = THREAD_COLORS[thread.side === "left" ? 0 : 3];
  ctx.globalAlpha = thread.side === "left" ? 0.2 : 0.18;
  ctx.lineWidth = 0.85;
  ctx.setLineDash([2, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -time * 0.025;
  ctx.stroke();
  ctx.restore();
}

export function syncPakistaniEmbroidery(width, height, reducedMotion, state) {
  if (state.threads.length === 0 || Math.abs(width - state.lastWidth) > 80) {
    state.threads = state.buildThreads(width, height, reducedMotion);
  }

  state.lastWidth = width;
  state.lastHeight = height;
}

export function drawPakistaniEmbroidery(ctx, time, reducedMotion, state) {
  state.threads.forEach((thread) => drawChainThread(ctx, thread, time, reducedMotion));
}

export function disconnectThreads(state, threadIds) {
  const idSet = new Set(threadIds);
  state.threads.forEach((thread) => {
    if (idSet.has(thread.id)) thread.disconnected = true;
  });
}

export function createPakistaniEmbroideryState(buildThreads) {
  return {
    threads: [],
    lastWidth: 0,
    lastHeight: 0,
    buildThreads,
  };
}
