import * as cheerio from "cheerio";
import { convert } from "html-to-text";

export interface ScrapeResult {
  url: string;
  title: string;
  text: string;
}

const FETCH_TIMEOUT = 10_000;
const MAX_HTML_SIZE = 5 * 1024 * 1024; // 5 MB

export async function scrape(url: string): Promise<ScrapeResult> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch webpage: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("text/html")) {
      throw new Error("URL does not point to an HTML webpage");
    }

    const contentLength = response.headers.get("content-length");

    if (contentLength && Number(contentLength) > MAX_HTML_SIZE) {
      throw new Error("Webpage is too large to process");
    }

    const html = await response.text();

    if (Buffer.byteLength(html, "utf8") > MAX_HTML_SIZE) {
      throw new Error("Webpage is too large to process");
    }

    const { title, text } = extractContent(html);

    if (!text.trim()) {
      throw new Error("Could not extract readable content from this webpage");
    }

    return {
      url,
      title,
      text,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Webpage took too long to respond");
      }

      throw error;
    }

    throw new Error("Failed to scrape webpage");
  } finally {
    clearTimeout(timeout);
  }
}

function extractContent(html: string): {
  title: string;
  text: string;
} {
  const $ = cheerio.load(html);

  // Get page title before removing elements
  const title = $("title").first().text().trim() || "Untitled Webpage";

  // Remove elements that don't contain useful document content
  $(["script", "style", "noscript", "nav", "footer", "header", "aside", "form", "iframe", "svg", "canvas", "button"].join(", ")).remove();

  // Prefer the main article/content area
  let content = $("main").first();

  if (!content.length) {
    content = $("article").first();
  }

  if (!content.length) {
    content = $('[role="main"]').first();
  }

  if (!content.length) {
    content = $("body").first();
  }

  if (!content.length) {
    throw new Error("No readable content found on webpage");
  }

  const contentHtml = content.html();

  if (!contentHtml) {
    throw new Error("No readable content found on webpage");
  }

  const text = convert(contentHtml, {
    wordwrap: false,

    selectors: [
      {
        selector: "a",
        options: {
          ignoreHref: true,
        },
      },
      {
        selector: "img",
        format: "skip",
      },
      {
        selector: "table",
        format: "block",
      },
    ],
  })
    .replace(/\s+/g, " ")
    .trim();

  return {
    title,
    text,
  };
}
