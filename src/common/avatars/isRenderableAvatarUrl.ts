/**
 * Predicate used everywhere `RemoteAvatar` renders a user's `imageUrl`.
 *
 * `RemoteAvatar` fetches the URL and parses it as SVG — feed it a
 * PNG / JPEG and it throws "Cannot read property 'length' of undefined"
 * mid-render and the whole screen crashes. The backend currently
 * extracts the `picture` claim from Google / Apple ID tokens on sign-in
 * and writes the raster URL into `user.imageUrl`, so this guard catches
 * those at the render site even when they make it into the data.
 *
 * Only DiceBear-issued SVGs are accepted today. Loosen when we add
 * another SVG source. Raster avatars should be rendered via RN's
 * `Image`, not this helper's accept-list.
 */
export const isRenderableAvatarUrl = (
  url: string | null | undefined,
): url is string => {
  if (typeof url !== 'string') {
    return false;
  }
  return url.startsWith('https://api.dicebear.com');
};
