

export const fetchWithAuth = async (url, options = {}) => {
    let res = await fetch(url, { ...options, credentials: "include" });

    if (res.status === 401) {
        // Try to refresh the token
        const refreshRes = await fetch(`${import.meta.env.VITE_SERVER_API_URL}/refresh-token`, {
        method: 'POST',
        credentials: 'include'
        });

        if (refreshRes.ok) {
        // Token refreshed successfully; retry original request
        res = await fetch(url, { ...options, credentials: "include" });
        } else {
        // Refresh failed; redirect to login
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
        }
    }

    return res;
};
