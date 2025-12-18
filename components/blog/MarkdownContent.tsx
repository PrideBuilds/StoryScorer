'use client';

import { useEffect, useRef } from 'react';

interface MarkdownContentProps {
  content: string;
}

/**
 * Simple markdown renderer component
 * In production, replace with a proper markdown library like react-markdown or MDX
 */
export function MarkdownContent({ content }: MarkdownContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Simple markdown to HTML conversion
    // For production, use a library like react-markdown or marked
    let html = content
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-primary hover:underline">$1</a>')
      // Lists
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      // Code blocks (simple)
      .replace(/`([^`]+)`/gim, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      // Paragraphs
      .split('\n\n')
      .map((para) => {
        if (para.trim().startsWith('<')) {
          return para;
        }
        return para.trim() ? `<p>${para.trim()}</p>` : '';
      })
      .join('\n');

    // Wrap consecutive <li> elements in <ul>
    html = html.replace(/(<li>.*<\/li>\n?)+/gim, (match) => {
      return `<ul class="list-disc pl-6 my-4">${match}</ul>`;
    });

    contentRef.current.innerHTML = html;
  }, [content]);

  return (
    <div
      ref={contentRef}
      className="markdown-content [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:leading-7 [&_code]:font-mono [&_a]:text-primary [&_a]:hover:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_li]:mb-2"
    />
  );
}

