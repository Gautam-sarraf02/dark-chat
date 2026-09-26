const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000' : '');

export async function fetchAnonymousSession() {
  try {
    const res = await fetch(`${API_BASE}/api/session/generate`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (e) {
    console.warn('Backend session endpoint unreachable, generating local session:', e.message);
  }

  // Fallback generation if backend API is unreachable
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const prefixes = ['ShadowUser', 'NightFox', 'DarkUser', 'CyberPhantom', 'VortexGhost'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return {
    userId: `anon_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    username: `${prefix}${randomNum}`,
  };
}

export async function submitReport({ reporterId, reportedUserId, roomId, reason, details }) {
  const res = await fetch(`${API_BASE}/api/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reporterId,
      reportedUserId,
      roomId,
      reason,
      details,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit report');
  }
  return data;
}

export async function blockUserRest({ userId, targetUserId }) {
  const res = await fetch(`${API_BASE}/api/block`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, targetUserId }),
  });

  return res.json();
}

export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (e) {
    return { status: 'offline', error: e.message };
  }
}
