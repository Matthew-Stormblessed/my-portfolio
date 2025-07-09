import Head from "next/head";
import Image from "next/image";
import Navbar from "@/components/navbar";

export default function Contact() {
    return (
        <>
            <Head>
                <title>Matthew Johnson | Software Engineer</title>
                <meta name="description" content="Portfolio of Matthew Johnson" />
            </Head>

            <main className="min-h-screen bg-gray-900 text-white px-6 py-16">
                <Navbar />
                <div>
                    <div className="mt-8 max-w-xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                        <p className="mb-6 text-gray-300">
                            Feel free to reach out to me through any of the following methods:
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center">
                                <Image src="/email.svg" alt="Email" width={24} height={24} className="mr-3" />
                                <a href="mailto:matthewisaacjohnson@gmail.com" className="hover:underline">
                                    matthewisaacjohnson@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Image src="/phone.svg" alt="Phone" width={24} height={24} className="mr-3" />
                                <a
                                    href="tel:+13852434677"
                                    className="hover:underline"
                                >
                                    +1 (385) 243-4677
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Image src="/linkedin.svg" alt="LinkedIn" width={24} height={24} className="mr-3" />
                                <a
                                    href="https://www.linkedin.com/in/matthew-johnson-950631152"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    linkedin.com/in/matthew-johnson-950631152
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Image src="/github.svg" alt="GitHub" width={24} height={24} className="mr-3" />
                                <a
                                    href="https://github.com/Matthew-Stormblessed"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    https://github.com/Matthew-Stormblessed
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        </>
    );
}
