// Work case studies shown on /projects and rendered at /work/[slug].
// Keep everything here public-safe: no internal system names, team names, or
// confidential numbers. Facts below come from the resume; deepen each one
// with the design decisions you made and what you would do differently.

export type CaseStudy = {
  slug: string
  company: string
  role: string
  period: string
  title: string
  tagline: string
  metrics: { value: string; label: string }[]
  problem: string
  approach: string[]
  results: string[]
  stack: string[]
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'ai-training-data-pipelines',
    company: 'Reka AI',
    role: 'Member of Technical Staff, Data Platform',
    period: '2026',
    title: 'Video training-data pipelines for world models',
    tagline:
      'Ray-on-Kubernetes and PySpark pipelines that turn raw video into clean, validated training data for pretraining, SFT, and distillation.',
    metrics: [
      { value: 'Video', label: 'Multimodal data' },
      { value: 'CPU + GPU', label: 'Ray workloads' },
      { value: '3', label: 'Training stages served' },
    ],
    problem:
      'World language-action models need large volumes of video prepared consistently: extracted, run through model-based batch inference, validated, and packaged in a format the training stack can stream. Bad samples that slip through waste expensive GPU time downstream.',
    approach: [
      'Optimized Python/PySpark and Ray-on-Kubernetes pipelines for video preparation.',
      'Used Ray for extraction and batch-inference jobs to make better use of both CPU and GPU capacity.',
      'Added data-quality checks and QA reports that run before data reaches training.',
      'Wired pipeline health into Slack monitoring so failures surface immediately.',
      'Packaged outputs as Energon WebDatasets for the research team.',
    ],
    results: [
      'Bad data is caught before training instead of after a wasted run.',
      'Research received ready-to-train WebDatasets for pretraining, SFT, and distillation.',
      'Improved CPU and GPU utilization across extraction and batch-inference jobs.',
    ],
    stack: ['Ray', 'Kubernetes', 'PySpark', 'Python', 'WebDataset / Energon', 'Slack alerts'],
  },
  {
    slug: 'petabyte-lakehouse-spark',
    company: 'Apple',
    role: 'Senior Software Engineer, Data Platform',
    period: '2021 – 2026',
    title: 'Scaling a microservice application to run 2,000+ Spark jobs daily on a 20 PB Iceberg lakehouse',
    tagline:
      'Scaling the microservice application that runs 2,000+ Spark jobs a day on a petabyte-scale lakehouse, and tuning Spark to make it faster and cheaper.',
    metrics: [
      { value: '20 PB', label: 'Iceberg data lake' },
      { value: '$0.5M', label: 'Saved per year' },
      { value: '75%', label: 'Faster micro-batches' },
    ],
    problem:
      'A shared data platform ran thousands of Spark jobs against a 20 PB Iceberg data lake. As usage grew, the microservice application that launched and managed those jobs had to scale with it, and micro-batch ETL pipelines on AWS were slower and costlier than they needed to be.',
    approach: [
      'Scaled the microservice application that runs 2,000+ Spark jobs daily across the lakehouse.',
      'Tuned Spark configurations across 20+ Airflow/Spark/Kubernetes ETL pipelines on AWS.',
      'Drove Snowflake and dbt adoption with Airflow integration, migrating legacy pipelines.',
    ],
    results: [
      '$0.5M/year in compute savings.',
      '75% shorter micro-batch runtimes.',
      '20% year-over-year growth in internal lakehouse usage.',
    ],
    stack: ['Spark', 'Apache Iceberg', 'Airflow', 'Kubernetes', 'AWS', 'Snowflake', 'dbt'],
  },
  {
    slug: 'lakehouse-migration-agent',
    company: 'Apple',
    role: 'Senior Software Engineer, Data Platform',
    period: '2021 – 2026',
    title: 'An agentic AI application that assesses and migrates lakehouse jobs through a conversational interface',
    tagline:
      'MCP servers plus a full-stack chat interface that lets teams assess and migrate Snowflake ingestion jobs to the lakehouse by talking to an agent — with an evaluation framework to prove it is reliable.',
    metrics: [
      { value: 'Weeks → min', label: 'Assessment time' },
      { value: 'MCP', label: 'Agent tooling' },
      { value: 'LLM evals', label: 'Reliability checks' },
    ],
    problem:
      'Deciding whether an ingestion job could migrate from Snowflake to the lakehouse meant manual investigation per job, and assessments took weeks.',
    approach: [
      'Built MCP servers exposing the data-lake context an agent needs to judge migratability.',
      'Built a full-stack conversational interface so teams could assess and migrate jobs by chatting with the agent.',
      'Built an LLM evaluation framework to validate the agent’s reliability before teams relied on it.',
    ],
    results: [
      'Assessment time cut from weeks to minutes.',
      'Agent output validated against an evaluation framework rather than taken on trust.',
    ],
    stack: ['MCP', 'LLM evaluation', 'Python', 'Snowflake', 'Apache Iceberg'],
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug)
}
