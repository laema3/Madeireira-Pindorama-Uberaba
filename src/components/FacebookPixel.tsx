import { useEffect } from 'react';
import { useData } from './DataContext';

export function FacebookPixel() {
  const { settings } = useData();
  const pixelId = settings.facebookPixelId;

  useEffect(() => {
    if (!pixelId) return;

    // Standard Facebook Pixel Code
    /* eslint-disable */
    // @ts-ignore
    !(function (f, b, e, v, n, t, s) {
      if ((f as any).fbq) return;
      n = (f as any).fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!(f as any)._fbq) (f as any)._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    
    // @ts-ignore
    (window as any).fbq("init", pixelId);
    // @ts-ignore
    (window as any).fbq("track", "PageView");
    /* eslint-enable */

  }, [pixelId]);

  return null;
}
