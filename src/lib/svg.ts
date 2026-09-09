import { Fragment, type ReactElement, type ReactNode } from "react";

type Props = Record<string, unknown>;

const attrName = (key: string) => key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

/**
 * Serialises a tree of intrinsic SVG elements to markup.
 *
 * Next.js forbids importing `react-dom/server` from app code, and `next/og`
 * will not expand React components nested inside an `<svg>`. This is just
 * enough of a renderer to turn the scene into a standalone SVG that can be
 * handed to satori as a data URI — it covers function components, fragments
 * and plain attributes, which is all the artwork uses.
 */
export function renderSvgMarkup(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return escape(String(node));
  if (Array.isArray(node)) return node.map(renderSvgMarkup).join("");

  const element = node as ReactElement<Props>;
  const props = element.props;
  // Widened so Fragment (an exotic component) can be compared against.
  const type: unknown = element.type;

  if (type === Fragment) return renderSvgMarkup(props.children as ReactNode);
  if (typeof type === "function") {
    return renderSvgMarkup((type as (p: Props) => ReactNode)(props));
  }
  if (typeof type !== "string") {
    throw new Error(`renderSvgMarkup: unsupported element type ${String(type)}`);
  }

  const attrs = Object.entries(props)
    .filter(([key, value]) => key !== "children" && value != null && value !== false)
    .map(([key, value]) => ` ${attrName(key)}="${escape(String(value))}"`)
    .join("");

  const children = renderSvgMarkup(props.children as ReactNode);
  return children ? `<${type}${attrs}>${children}</${type}>` : `<${type}${attrs}/>`;
}
