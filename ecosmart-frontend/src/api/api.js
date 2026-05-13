const getToken = () => {
  try {
    const stored = localStorage.getItem('ecosmart_user');
    return stored ? JSON.parse(stored).token : null;
  } catch {
    return null;
  }
};

const request = async (method, path, body) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const err = await res.json();
      if (err.error) message = err.error;
    } catch {}
    throw new Error(message);
  }

  return res.json();
};

export const apiGet    = (path)       => request('GET',    path);
export const apiPost   = (path, body) => request('POST',   path, body);
export const apiPut    = (path, body) => request('PUT',    path, body);
export const apiDelete = (path)       => request('DELETE', path);
