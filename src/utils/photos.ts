/**
 * story.ts just stores photo *filenames* (e.g. "first-date.jpeg") — plain
 * strings, no import statements, so adding a photo to a milestone never
 * means touching component code.
 *
 * But a filename string isn't a usable image src in a built app: Vite
 * fingerprints/hashes asset files during `vite build` (e.g.
 * first-date-C29f8a2.jpeg) so browsers can cache them forever. We need the
 * *real* URL Vite generated, not the original filename.
 *
 * `import.meta.glob` is a Vite-only feature that eagerly imports every file
 * matching a pattern and gives us back a { filePath: url } map at build
 * time. We flatten that into { filename: url } once here, and everything
 * else just looks filenames up through `getPhotoUrl`.
 */
const modules = import.meta.glob('../assets/photos/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const photoUrlsByFilename: Record<string, string> = {}
for (const path in modules) {
  const filename = path.split('/').pop()
  if (filename) photoUrlsByFilename[filename] = modules[path]
}

export function getPhotoUrl(filename: string): string | undefined {
  return photoUrlsByFilename[filename]
}
