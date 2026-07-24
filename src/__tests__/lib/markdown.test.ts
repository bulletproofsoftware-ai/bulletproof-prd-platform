import { describe, it, expect } from "vitest";
import { markdownToHtml, htmlToMarkdown } from "@/lib/markdown";

describe("markdownToHtml", () => {
  it("converts headings", () => {
    expect(markdownToHtml("# Title")).toContain("<h1>Title</h1>");
    expect(markdownToHtml("## Subtitle")).toContain("<h2>Subtitle</h2>");
    expect(markdownToHtml("### H3")).toContain("<h3>H3</h3>");
  });

  it("converts bold text", () => {
    expect(markdownToHtml("**bold**")).toContain("<strong>bold</strong>");
  });

  it("converts italic text", () => {
    expect(markdownToHtml("*italic*")).toContain("<em>italic</em>");
  });

  it("converts inline code", () => {
    expect(markdownToHtml("`code`")).toContain("<code>code</code>");
  });

  it("converts code blocks", () => {
    const md = "```js\nconsole.log('hi')\n```";
    const html = markdownToHtml(md);
    expect(html).toContain("<pre>");
    expect(html).toContain("console.log");
  });

  it("converts links", () => {
    expect(markdownToHtml("[text](http://example.com)")).toContain(
      '<a href="http://example.com">text</a>'
    );
  });

  it("converts unordered list items", () => {
    const md = "- item 1\n- item 2";
    const html = markdownToHtml(md);
    expect(html).toContain("<li>");
    expect(html).toContain("item 1");
    expect(html).toContain("item 2");
    expect(html).toContain("<ul>");
  });

  it("converts ordered list items", () => {
    const md = "1. first\n2. second";
    const html = markdownToHtml(md);
    expect(html).toContain("<ol>");
    expect(html).toContain("first");
    expect(html).toContain("second");
  });

  it("wraps plain text in paragraphs", () => {
    expect(markdownToHtml("plain text")).toContain("<p>plain text</p>");
  });

  it("handles empty string", () => {
    expect(markdownToHtml("")).toBe("");
  });

  it("handles multi-paragraph content", () => {
    const md = "First paragraph.\n\nSecond paragraph.";
    const html = markdownToHtml(md);
    expect(html).toContain("<p>First paragraph.</p>");
    expect(html).toContain("<p>Second paragraph.</p>");
  });

  it("handles GFM tables", () => {
    const md = "| A | B |\n| --- | --- |\n| 1 | 2 |";
    const html = markdownToHtml(md);
    expect(html).toContain("<table>");
    expect(html).toContain("<th>A</th>");
    expect(html).toContain("<td>1</td>");
  });
});

describe("htmlToMarkdown", () => {
  it("converts headings", () => {
    expect(htmlToMarkdown("<h1>Title</h1>")).toContain("# Title");
    expect(htmlToMarkdown("<h2>Sub</h2>")).toContain("## Sub");
    expect(htmlToMarkdown("<h3>H3</h3>")).toContain("### H3");
  });

  it("converts bold text", () => {
    expect(htmlToMarkdown("<strong>bold</strong>")).toContain("**bold**");
  });

  it("converts italic text", () => {
    expect(htmlToMarkdown("<em>italic</em>")).toContain("_italic_");
  });

  it("converts links", () => {
    expect(htmlToMarkdown('<a href="http://example.com">text</a>')).toContain(
      "[text](http://example.com)"
    );
  });

  it("converts list items", () => {
    const html = "<ul><li>one</li><li>two</li></ul>";
    const md = htmlToMarkdown(html);
    expect(md).toContain("one");
    expect(md).toContain("two");
    expect(md).toContain("-");
  });

  it("converts paragraphs", () => {
    const md = htmlToMarkdown("<p>text</p>");
    expect(md).toContain("text");
  });

  it("handles empty string", () => {
    expect(htmlToMarkdown("")).toBe("");
  });
});

describe("roundtrip conversion", () => {
  it("preserves headings through roundtrip", () => {
    const md = "# Title";
    const result = htmlToMarkdown(markdownToHtml(md));
    expect(result).toContain("# Title");
  });

  it("preserves bold through roundtrip", () => {
    const md = "**bold text**";
    const html = markdownToHtml(md);
    const result = htmlToMarkdown(html);
    expect(result).toContain("**bold text**");
  });

  it("preserves links through roundtrip", () => {
    const md = "[link](http://example.com)";
    const result = htmlToMarkdown(markdownToHtml(md));
    expect(result).toContain("[link](http://example.com)");
  });

  it("preserves lists through roundtrip", () => {
    const md = "- item one\n- item two";
    const result = htmlToMarkdown(markdownToHtml(md));
    expect(result).toContain("item one");
    expect(result).toContain("item two");
    expect(result).toContain("-");
  });
});
