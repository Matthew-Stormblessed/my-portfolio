import Head from "next/head";
import Image from "next/image";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Head>
        <title>Mathew Stormblessed | Software Engineer</title>
        <meta name="description" content="Portfolio of Mathew Stormblessed" />
      </Head>

      <main className="min-h-screen bg-gray-900 text-white px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
        <Navbar />
          <div className="mb-12">
            <Image
              src="profile.jpg"
              alt="Mathew Stormblessed"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            👋 Hi, I'm Mathew
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            A Software Engineer who builds modern web experiences with React, TypeScript, and automation.
          </p>
          <a
            href="#projects"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            View My Work
          </a>
        </div>

        <section id="about" className="mt-24 text-left max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">About Me</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            I'm passionate about building full-stack applications, automating workflows with GitHub Actions, and writing clean, type-safe code. I enjoy working with modern web technologies like Next.js, Tailwind, and serverless APIs.
          </p>
        </section>
      </main>
    </>
  );
}
