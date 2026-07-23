import Head from "next/head";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Link from "next/link";
import AIAssistant from "@/components/aiAssistant";

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-gray-900 text-white pt-16">
        <div className="max-w-3xl mx-auto">
          <Navbar />
          <AIAssistant />
        </div>
      </main>
    </>
  );
}
