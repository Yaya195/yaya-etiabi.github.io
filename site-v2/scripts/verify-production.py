import json
import re
import time
import urllib.request
from urllib.error import HTTPError, URLError
from pathlib import Path

BASE = "https://yaya-etiabi.github.io"
ROUTES = {
    "/": ("text/html", "Yaya Etiabi, PhD"),
    "/research/": ("text/html", "Research directions"),
    "/projects/": ("text/html", "Research projects"),
    "/projects/locllm/": ("text/html", "LocLLM:"),
    "/projects/radio-slam/": ("text/html", "Under Review"),
    "/projects/factorized-transformer/": ("text/html", "Factorized Transformer"),
    "/publications/": ("text/html", "Preprints"),
    "/teaching-outreach/": ("text/html", "Teaching &amp; Outreach"),
    "/talks/": ("text/html", "Talks"),
    "/about/": ("text/html", "International Network"),
    "/contact/": ("text/html", "Get in touch"),
    "/sitemap.xml": ("application/xml", "<urlset"),
    "/robots.txt": ("text/plain", "Sitemap:"),
    "/portrait.webp": ("image/webp", None),
}
REDIRECTS = {
    "/about.html": "/about/",
    "/contact.html": "/contact/",
    "/portfolio/semi-marathon-participation/": "/about/#half-marathons",
}
results = []
errors = []

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

opener = urllib.request.build_opener(NoRedirect)

def fetch(path):
    req = urllib.request.Request(BASE+path, headers={
        'User-Agent': 'AstroV2ReleaseSmoke/1.0 (site owner release check)',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
    })
    try:
        with opener.open(req, timeout=22) as r:
            return r.status, r.headers, r.read(2000000)
    except HTTPError as e:
        return e.code, e.headers, e.read(5000)

for path, (mime, marker) in ROUTES.items():
    status, headers, raw = fetch(path)
    body = raw.decode('utf-8',errors='replace') if mime.startswith('text/') or mime.endswith('xml') else ''
    content_type = headers.get('Content-Type', '')
    row = {'path':path,'status':status,'content_type':content_type, 'bytes':len(raw)}
    if status != 200:
        errors.append(f"{path}: HTTP {status}")
    if mime not in content_type:
        errors.append(f"{path}: expected {mime}, received {content_type}")
    if marker and marker not in body:
        errors.append(f"{path}: missing marker {marker!r}")
    if path not in ('/robots.txt','/sitemap.xml','/portrait.webp'):
        if 'content="index,follow"' not in body:
            errors.append(f"{path}: missing production index,follow robots")
        if 'name="ETIABI"' in body or 'Powered by Jekyll' in body:
            errors.append(f"{path}: old Jekyll page detected")
        if f'href="{BASE+path}"' not in body:
            errors.append(f"{path}: canonical not found")
    row['passed'] = not any(e.startswith(path+':') for e in errors)
    results.append(row)
    print(json.dumps(row), flush=True)

for path,destination in REDIRECTS.items():
    status, headers, raw=fetch(path)
    body=raw.decode('utf-8', errors='replace')
    good=(status in (200,301,302,307,308) and (
        destination in headers.get('Location','') or destination in body or
        ('/yaya-etiabi.github.io'+destination) in body
    ))
    if not good:
        errors.append(f"{path}: redirect to {destination} absent or HTTP {status}")
    results.append({'path':path,'status':status,'expected_redirect':destination,'passed':good})
    print(json.dumps(results[-1]),flush=True)

Path('reports').mkdir(exist_ok=True)
Path('reports/release-live-smoke.json').write_text(json.dumps({'base':BASE,'results':results,'errors':errors},indent=2),encoding='utf-8')
if errors:
    print("LIVE RELEASE CHECK FAILED",len(errors),*errors,sep='\n',flush=True)
    raise SystemExit(1)
print("LIVE RELEASE CHECK PASSED",len(results),"real URLs",flush=True)
