import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Blog by Libin Guo — data engineering, pipelines, AI/agents, and platform engineering. Thoughts and how-tos.',
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
