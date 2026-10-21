# Local dev server with caching disabled, so edits show up on every reload.
import http.server, functools

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

http.server.ThreadingHTTPServer(("", 5179), functools.partial(NoCache, directory=".")).serve_forever()
