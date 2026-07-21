import { useEffect, useState } from 'react';
import { SvgXml } from 'react-native-svg';

/**
 * DiceBear SVGs wrap character content in a
 * `<g mask="url(#viewboxMask)">` referencing a per-style rect mask.
 * react-native-svg on Android doesn't reliably resolve those mask URL
 * references — when it silently fails, the character escapes the
 * intended viewBox and renders zoomed / clipped inside its container.
 * Stripping the mask definition + the `mask="..."` attribute forces the
 * renderer to fall back on the outer `viewBox` for clipping, which
 * behaves identically on iOS and Android. Intrinsic width / height /
 * style on the root `<svg>` are also stripped so the props passed to
 * `SvgXml` win on sizing.
 */
const sanitizeDiceBearSvg = (xml: string): string =>
  xml
    .replace(/(<svg\b[^>]*?)\s(?:width|height)="[^"]*"/gi, '$1')
    .replace(/(<svg\b[^>]*?)\sstyle="[^"]*"/gi, '$1')
    .replace(/<mask\b[^>]*>[\s\S]*?<\/mask>/gi, '')
    .replace(/\smask="[^"]*"/gi, '');

// State carries the URI it was fetched for so a mid-flight URI change
// invalidates the previous response — the hook returns null until the
// new fetch resolves, which avoids flashing the stale avatar and keeps
// setState out of the effect body (satisfies `react-hooks/set-state-in-effect`).
const useRemoteSvgXml = (uri: string): string | null => {
  const [state, setState] = useState<{ uri: string; xml: string | null }>({
    uri,
    xml: null,
  });
  useEffect(() => {
    let cancelled = false;
    globalThis
      .fetch(uri)
      .then((res) => res.text())
      .then((text) => {
        if (!cancelled) {
          setState({ uri, xml: sanitizeDiceBearSvg(text) });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ uri, xml: null });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [uri]);
  return state.uri === uri ? state.xml : null;
};

type RemoteAvatarProps = {
  /**
   * The DiceBear (or other SVG) URL to render. Callers should pre-filter
   * via `isRenderableAvatarUrl` — this component assumes the URL points
   * at an SVG response the renderer can parse.
   */
  uri: string;
  /** Square edge length in device-independent pixels. */
  size: number;
};

/**
 * Fetches an SVG URL, sanitizes it for react-native-svg compatibility,
 * then renders it via `SvgXml` at the requested size. Returns `null`
 * while the fetch is in flight — surround with a same-sized placeholder
 * container so the layout doesn't jump when the avatar arrives.
 */
export const RemoteAvatar = ({ uri, size }: RemoteAvatarProps) => {
  const xml = useRemoteSvgXml(uri);
  if (!xml) {
    return null;
  }
  return <SvgXml xml={xml} width={size} height={size} />;
};
