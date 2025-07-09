import Head from "next/head";
import Image from "next/image";
import Navbar from "@/components/navbar";

export default function About() {
    return (
        <>
            <Head>
                <title>Matthew Johnson | Software Engineer</title>
                <meta name="description" content="Portfolio of Matthew Johnson" />
            </Head>

            <main className="min-h-screen bg-gray-900 text-white px-6 py-16">
                <Navbar />
                <div>
                    <h1>About</h1>
                </div>
            </main>
        </>
    );
}
