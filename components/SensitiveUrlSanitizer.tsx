export function SensitiveUrlSanitizer() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function () {
            try {
              var url = new URL(window.location.href);
              var sensitiveKeys = new Set([
                'token', 'access-token', 'access_token', 'email', 'shp_email',
                'phone', 'shp_phone', 'name', 'shp_name', 'signaturevalue',
                'shp_customer', 'invid', 'outsum', 'receipt'
              ]);
              var changed = false;
              Array.from(url.searchParams.keys()).forEach(function (key) {
                var normalizedKey = key.toLowerCase();
                if (sensitiveKeys.has(normalizedKey) || normalizedKey.indexOf('shp_') === 0) {
                  url.searchParams.delete(key);
                  changed = true;
                }
              });
              if (/^(token|access-token|access_token|email)=/i.test(url.hash.slice(1))) {
                url.hash = '';
                changed = true;
              }
              if (changed) {
                window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
              }
            } catch (_) {}
          })();
        `,
      }}
      id="sensitive-url-sanitizer"
    />
  );
}
