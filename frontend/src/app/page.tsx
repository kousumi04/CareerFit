import Link from "next/link";

const steps = [
  {
    title: "Add your resume",
    text: "Keep your resume in one place so it is ready whenever you find a role you like.",
  },
  {
    title: "Save the job",
    text: "Paste the job post you want to compare, including the skills and duties it asks for.",
  },
  {
    title: "See the fit",
    text: "Get a clear view of what matches, what is missing, and what to improve next.",
  },
];

const highlights = [
  "Find the strongest parts of your resume",
  "Spot gaps before you apply",
  "Choose which jobs deserve your time",
];

export default function Home() {
  return (
    <div className="bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-20">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              CareerFit
            </p>
            <h1 className="text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
              Know how well your resume fits the job.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              CareerFit helps you compare your resume with a job post, then
              explains the match in plain words so you can apply with more
              confidence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-md bg-slate-950 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
              >
                Get started
              </Link>
              <Link
                href="/jobs"
                className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-100"
              >
                Add a job
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <div className="rounded-md border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    Product Designer
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Resume fit report
                  </p>
                </div>
                <div className="rounded-md bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-800">
                  82%
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      Skills match
                    </span>
                    <span className="text-slate-500">Strong</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div className="h-2 w-4/5 rounded-full bg-emerald-500" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      Experience match
                    </span>
                    <span className="text-slate-500">Good</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div className="h-2 w-2/3 rounded-full bg-sky-500" />
                  </div>
                </div>

                <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-900">
                    One thing to improve
                  </p>
                  <p className="mt-1 text-sm leading-6 text-amber-900">
                    Add a short example that shows your work with customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="container mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h2 className="text-xl font-semibold text-slate-950">
                  {step.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="container mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-normal text-slate-950">
              Make each application easier to judge.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Instead of guessing, CareerFit gives you a simple report you can
              use before sending your resume.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm font-medium leading-6 text-slate-800"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
