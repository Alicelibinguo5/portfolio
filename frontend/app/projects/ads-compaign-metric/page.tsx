import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ads Campaign Metric Pipeline',
  description:
    'Real-time streaming pipeline for ad campaign metrics: Kafka, Flink, Iceberg, Superset. Case study by Libin Guo.',
}

export default function ProjectAdsCampaignMetric() {
  return (
    <section className="space-y-12 md:space-y-20">
      <Link href="/projects" className="nav-link inline-flex items-center gap-2 text-sm font-medium">
        <ArrowLeft strokeWidth={1.5} size={16} />
        Back to Projects
      </Link>

      <div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-forest">
          <a
            href="https://github.com/Alicelibinguo5/ads-compaign-metric"
            target="_blank"
            rel="noreferrer"
            className="hover:text-terracotta transition-colors inline-flex items-center gap-2"
          >
            ads-compaign-metric
            <ExternalLink strokeWidth={1.5} size={20} />
          </a>
        </h1>
        <p className="text-forest/80 mt-4 max-w-2xl text-lg">
          Real-time streaming pipeline for ad campaign metrics using Kafka, Flink, and Iceberg with Superset dashboards.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <article className="card">
          <h2 className="font-display text-xl font-semibold text-forest mb-4">Problem</h2>
          <p className="text-forest/80 leading-relaxed">
            Teams need up-to-date ad campaign metrics for decision-making without waiting for batch jobs. Data should be queryable and available for dashboards.
          </p>
        </article>
        <article className="card md:translate-y-12">
          <h2 className="font-display text-xl font-semibold text-forest mb-4">Approach</h2>
          <p className="text-forest/80 leading-relaxed">
            Streaming ingestion with Kafka, processing and aggregation in Apache Flink, and table storage in Apache Iceberg for efficient querying. Superset for visualization and dashboards.
          </p>
        </article>
        <article className="card">
          <h2 className="font-display text-xl font-semibold text-forest mb-4">Tech</h2>
          <p className="text-forest/80 leading-relaxed">
            Kafka, Apache Flink, Apache Iceberg, Superset. End-to-end real-time pipeline with durable storage and SQL-friendly access.
          </p>
        </article>
        <article className="card md:translate-y-12">
          <h2 className="font-display text-xl font-semibold text-forest mb-4">Links</h2>
          <ul className="space-y-2">
            <li>
              <a
                href="https://github.com/Alicelibinguo5/ads-compaign-metric"
                target="_blank"
                rel="noreferrer"
                className="nav-link inline-flex items-center gap-2"
              >
                GitHub Repository
                <ExternalLink strokeWidth={1.5} size={16} />
              </a>
            </li>
          </ul>
        </article>
      </div>
    </section>
  )
}
