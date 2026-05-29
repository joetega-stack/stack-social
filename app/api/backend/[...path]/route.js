const DEFAULT_BACKEND_BASE_URL = "https://social-fws6.onrender.com";

function getBackendBaseUrl() {
  const configuredUrl =
    process.env.SERVER_BASE_URL || process.env.NEXT_PUBLIC_SERVER_BASE_URL;

  try {
    const url = new URL(configuredUrl || DEFAULT_BACKEND_BASE_URL);

    if (url.hostname.endsWith(".vercel.app")) {
      return DEFAULT_BACKEND_BASE_URL;
    }

    return url.toString().replace(/\/+$/, "");
  } catch {
    return DEFAULT_BACKEND_BASE_URL;
  }
}

async function proxyRequest(request, { params }) {
  const { path } = await params;
  const requestUrl = new URL(request.url);
  const pathname = path.map(encodeURIComponent).join("/");
  const backendUrl = new URL(
    `${pathname}${requestUrl.search}`,
    `${getBackendBaseUrl()}/`,
  );

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");

  const upstreamRequest = new Request(backendUrl, {
    method: request.method,
    headers,
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : request.body,
    duplex: "half",
  });

  try {
    const upstreamResponse = await fetch(upstreamRequest);
    const responseHeaders = new Headers(upstreamResponse.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return Response.json(
      {
        message: "Backend request failed",
        detail: error?.message || "Unexpected network error",
      },
      { status: 502 },
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const HEAD = proxyRequest;
