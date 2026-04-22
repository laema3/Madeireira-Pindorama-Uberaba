import { useEffect } from 'react';
import { useData } from './DataContext';

export function FaviconManager() {
  const { settings } = useData();

  useEffect(() => {
    if (settings.logoUrl && settings.logoUrl.trim() !== '') {
      const logoUrl = settings.logoUrl;

      // 1. Update standard favicon
      let linkIcon: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!linkIcon) {
        linkIcon = document.createElement('link');
        linkIcon.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(linkIcon);
      }
      linkIcon.href = logoUrl;

      // 2. Update Apple Touch Icon (iOS App Icon)
      let appleIcon: HTMLLinkElement | null = document.querySelector("link[rel='apple-touch-icon']");
      if (!appleIcon) {
        appleIcon = document.createElement('link');
        appleIcon.rel = 'apple-touch-icon';
        document.getElementsByTagName('head')[0].appendChild(appleIcon);
      }
      appleIcon.href = logoUrl;

      // 3. Dynamic Manifest (for Android/Chrome)
      // Note: This is advanced but helps ensure newly installed apps use the current logo
      const manifestData = {
        "name": "Madeireira Pindorama",
        "short_name": "Pindorama",
        "description": "Qualidade e tradição em madeiras.",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#064e3b",
        "theme_color": "#064e3b",
        "icons": [
          {
            "src": logoUrl,
            "sizes": "any",
            "purpose": "any maskable"
          },
          {
            "src": logoUrl,
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": logoUrl,
            "sizes": "512x512",
            "type": "image/png"
          }
        ]
      };

      const stringManifest = JSON.stringify(manifestData);
      const blob = new Blob([stringManifest], {type: 'application/json'});
      const manifestUrl = URL.createObjectURL(blob);
      
      let manifestLink: HTMLLinkElement | null = document.querySelector("link[rel='manifest']");
      if (manifestLink) {
        manifestLink.href = manifestUrl;
      }

      return () => {
        URL.revokeObjectURL(manifestUrl);
      };
    }
  }, [settings.logoUrl]);

  return null;
}
