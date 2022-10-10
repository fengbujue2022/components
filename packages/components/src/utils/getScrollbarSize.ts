export default function getScrollbarSize(doc: Document): number {
  const documentWidth = doc.documentElement.clientWidth;
  return Math.abs(window.innerWidth - documentWidth);
}
