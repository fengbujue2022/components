import ownerDocument from './ownerDocument';

export default function ownerWindow(node: Node | null | undefined): Window {
  const doc = ownerDocument(node);
  return doc.defaultView || window;
}
