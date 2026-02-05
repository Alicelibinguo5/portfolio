import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Landing Page A/B Test Analysis',
  description:
    'A/B testing analysis for landing page conversion: pandas, matplotlib, statsmodels, regression. Case study by Libin Guo.',
}

export default function ProjectLandingPageAbTest() {
  return (
    <section className="space-y-12 md:space-y-20">
      <Link href="/projects" className="nav-link inline-flex items-center gap-2 text-sm font-medium">
        <ArrowLeft strokeWidth={1.5} size={16} />
        Back to Projects
      </Link>

      <div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-forest">
          <a
            href="https://github.com/Alicelibinguo/Analyzing-Website-Landing-Page-A-B-Test-Results-"
            target="_blank"
            rel="noreferrer"
            className="hover:text-terracotta transition-colors inline-flex items-center gap-2"
          >
            Landing Page A/B Test Analysis
            <ExternalLink strokeWidth={1.5} size={20} />
          </a>
        </h1>
        <p className="text-forest/80 mt-4 max-w-2xl text-lg">
          A/B testing analysis to assess if a new landing page increases conversion, using pandas, matplotlib, and regression.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <article className="card">
          <h2 className="font-display text-xl font-semibold text-forest mb-4">Problem</h2>
          <p className="text-forest/80 leading-relaxed">
            Product and marketing need to know whether a new landing page actually improves conversion before rolling it out fully.
          </p>
        </article>
        <article className="card md:translate-y-12">
          <h2 className="font-display text-xl font-semibold text-forest mb-4">Approach</h2>
          <p className="text-forest/80 leading-relaxed">
            Rigorous A/B test analysis: exploratory data analysis, statistical testing, and regression to control for covariates and quantify the effect of the new page.
          </p>
        </article>
        <article className="card">
          <h2 className="font-display text-xl font-semibold text-forest mb-4">Tech</h2>
          <p className="text-forest/80 leading-relaxed">
            Python, pandas, matplotlib, statsmodels, scikit-learn. Reproducible analysis and clear visualizations for stakeholders.
          </p>
        </article>
        <article className="card md:translate-y-12">
          <h2 className="font-display text-xl font-semibold text-forest mb-4">Links</h2>
          <ul className="space-y-2">
            <li>
              <a
                href="https://github.com/Alicelibinguo/Analyzing-Website-Landing-Page-A-B-Test-Results-"
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
