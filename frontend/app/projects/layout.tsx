import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Featured apps and open-source work by Libin Guo — data platforms, AI/agent systems, pipelines. Dinner Match Lab, DOJ legal researcher agent, and more on GitHub.',
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
