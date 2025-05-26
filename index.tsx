// pages/index.tsx
// Next.js template generated for the n8n Website‑Generator
// It reads company data (name, logo, industry) from a JSON file that n8n writes on every webhook event.
// -----------------------------------------------------------------------------
// 1. n8n-Workflow: save mapped Tally fields to `${PROJECT_ROOT}/data/company.json`
//    Example payload structure (must be valid JSON):
//    {
//      "companyName": "Muster GmbH",
//      "logoUrl": "https://cdn.example.com/logos/muster.png",
//      "industry": "IT‑Dienstleistungen"
//    }
// 2. Trigger a re‑deployment (e.g. `vercel deploy --prod`) or rely on ISR.
// -----------------------------------------------------------------------------

import { promises as fs } from "fs";
import path from "path";
import Image from "next/image";
import Head from "next/head";

interface CompanyData {
  companyName: string;
  logoUrl: string;
  industry: string;
}

interface HomeProps {
  data: CompanyData;
}

// Reads the JSON file at build time (SSG) and revalidates every 60 s (ISR)
export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "data", "company.json");
  let raw = "{}";
  try {
    raw = await fs.readFile(filePath, "utf‑8");
  } catch (_) {
    /* file missing → leave defaults */
  }
  const data: CompanyData = JSON.parse(raw);
  return {
    props: { data },
    revalidate: 60, // seconds – adapt to your redeploy strategy
  };
}

export default function Home({ data }: HomeProps) {
  const { companyName = "Mein Unternehmen", logoUrl = "", industry = "Branche" } = data;

  return (
    <>
      <Head>
        <title>{`${companyName} – ${industry}`}</title>
        <meta name="description" content={`${companyName} in der Branche ${industry}`} />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        {logoUrl && (
          <Image
            src={logoUrl}
            alt={`${companyName} Logo`}
            width={160}
            height={160}
            className="rounded-2xl shadow-lg mb-6"
            unoptimized
          />
        )}

        <h1 className="text-4xl font-bold mb-2 text-gray-900 text-center">{companyName}</h1>
        <p className="text-xl text-gray-600 text-center">{industry}</p>
      </main>
    </>
  );
}
