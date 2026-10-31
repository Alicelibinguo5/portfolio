// Work projects shown on /projects and rendered at /work/[slug].
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
      'I build the Ray and PySpark pipelines that turn raw video into clean training data for pretraining, SFT, and distillation.',
    metrics: [
      { value: 'Video', label: 'Multimodal data' },
      { value: 'CPU + GPU', label: 'Ray workloads' },
      { value: '3', label: 'Training stages served' },
    ],
    problem:
      'The research team needs a lot of video, prepared the same way every time: extracted, run through batch inference, checked, and packaged so the training stack can stream it. One bad batch that slips through burns GPU hours later, so I wanted to catch it early.',
    approach: [
      'Tuned the PySpark and Ray-on-Kubernetes pipelines that prepare the video.',
      'Moved extraction and batch inference onto Ray so CPU and GPU nodes stay busy instead of waiting on each other.',
      'Added data-quality checks and QA reports that run before anything reaches training.',
      'Sent pipeline health to Slack so I hear about failures right away.',
      'Packaged the output as Energon WebDatasets, which the researchers can stream directly.',
    ],
    results: [
      'Bad data gets caught before training, not after a wasted run.',
      'Research gets ready-to-train WebDatasets for pretraining, SFT, and distillation.',
      'Better CPU and GPU utilization across extraction and batch-inference jobs.',
    ],
    stack: ['Ray (CPU + GPU workers)', 'Kubernetes', 'PySpark', 'Python', 'Energon WebDataset', 'Batch inference', 'Slack alerts'],
  },
  {
    slug: 'petabyte-lakehouse-spark',
    company: 'Apple',
    role: 'Senior Software Engineer, Data Platform',
    period: '2021 – 2026',
    title: 'Scaling a microservice application to run 2,000+ Spark jobs daily on a 20 PB Iceberg lakehouse',
    tagline:
      'I scaled the service that launches 2,000+ Spark jobs a day on our lakehouse, then tuned Spark to make those jobs faster and cheaper.',
    metrics: [
      { value: '20 PB', label: 'Iceberg data lake' },
      { value: '$0.5M', label: 'Saved per year' },
      { value: '75%', label: 'Faster micro-batches' },
    ],
    problem:
      'Our shared platform ran Spark jobs against a 20 PB Iceberg data lake. As more teams piled on, the microservice that launches and manages those jobs had to keep up, and our micro-batch ETL pipelines on AWS were slower and pricier than they should have been.',
    approach: [
      'Scaled the microservice that runs 2,000+ Spark jobs a day across the lakehouse.',
      'Tuned Spark configs across 20+ ETL pipelines running on Airflow, Spark, and Kubernetes in AWS.',
      'Pushed Snowflake and dbt adoption, wired them into Airflow, and migrated legacy pipelines onto them.',
    ],
    results: [
      'About $0.5M a year saved on compute.',
      'Micro-batch runs got 75% shorter.',
      'Internal lakehouse usage grew 20% year over year.',
    ],
    stack: ['Apache Spark', 'Apache Iceberg (20 PB)', 'Airflow', 'Kubernetes', 'AWS', 'Snowflake', 'dbt', 'Python', 'Microservices'],
  },
  {
    slug: 'lakehouse-migration-agent',
    company: 'Apple',
    role: 'Senior Software Engineer, Data Platform',
    period: '2021 – 2026',
    title: 'An agentic AI application that assesses and migrates lakehouse jobs through a conversational interface',
    tagline:
      'MCP servers and a chat interface so teams can assess and migrate Snowflake ingestion jobs to the lakehouse by talking to an agent, plus evals so I could trust what it said.',
    metrics: [
      { value: 'Weeks → min', label: 'Assessment time' },
      { value: 'MCP', label: 'Agent tooling' },
      { value: 'LLM evals', label: 'Reliability checks' },
    ],
    problem:
      'To find out if an ingestion job could move from Snowflake to the lakehouse, someone had to dig through it by hand. One assessment could take weeks.',
    approach: [
      'Built MCP servers that give the agent the lakehouse context it needs to judge whether a job can migrate.',
      'Built a full-stack chat interface so teams can assess and migrate jobs just by talking to the agent.',
      'Built an LLM evaluation framework to check the agent was reliable before anyone depended on it.',
    ],
    results: [
      'Assessments went from weeks to minutes.',
      'The agent’s answers are checked by evals, not taken on trust.',
    ],
    stack: ['MCP servers', 'LLM agent', 'LLM eval framework', 'Python', 'Full-stack web app', 'Snowflake', 'Apache Iceberg'],
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug)
}
