import Navbar from "@/components/navbar";
import SingleProjectContent from "@/components/singleProjectContent";
import portfolioAssistant from "@/app/data/PortfolioAssistant.json";
import popChoice from "@/app/data/PopChoice.json";
import travelAgent from "@/app/data/TravelAgent.json";
import pollyGlot from "@/app/data/PollyGlot.json";

const projectData: Record<string, typeof portfolioAssistant> = {
  "PortfolioAssistant.json": portfolioAssistant,
  "PopChoice.json": popChoice,
  "TravelAgent.json": travelAgent,
  "PollyGlot.json": pollyGlot,
};

export default async function SingleProject({
  searchParams,
}: {
  searchParams: Promise<{ dataFile?: string }>;
}) {
  const { dataFile } = await searchParams;
  const data = dataFile ? projectData[dataFile] : undefined;

  return (
    <main className="min-h-screen bg-gray-900 text-white px-6 py-16">
      <Navbar />
      {data ? (
        <SingleProjectContent data={data} />
      ) : (
        <div className="flex flex-col items-center mt-8">
          <h1 className="text-2xl font-bold text-amber-300">Project not found</h1>
          <h2 className="max-w-3xl mt-4">
            The requested project could not be found. Please go back to the projects page and select a valid project.
          </h2>
        </div>
      )}
    </main>
  );
}
