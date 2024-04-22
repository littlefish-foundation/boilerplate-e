// Client-side rendering directive for Next.js (if using it)
"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    section: "General",
    qa: [
      {
        question: "What is Cardano?",
        answer: (
          <span>
            Cardano is a blockchain platform that is built on a proof-of-stake
            consensus protocol (Ouroboros) that validates transactions without
            high energy costs.
          </span>
        ),
      },
      {
        question: "What can you build with this boilerplate?",
        answer: (
          <span>
            With this boilerplate, you can build applications that can send &
            receive ADA, mint NFTs, and interact with smart contracts on the
            Cardano blockchain. You can also authenticate users using their
            Cardano wallets.
          </span>
        ),
      },
    ],
  },
  {
    section: "Requirements",
    qa: [
      {
        question:
          "Before starting, ensure you have the following software installed",
        answer: (
          <span>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Visual Studio Code:</strong> Essential source-code
                editor.{" "}
                <a
                  href="https://code.visualstudio.com/download"
                  className="text-electric-violet-500 hover:text-electric-violet-700"
                >
                  Download here
                </a>
                .
              </li>
              <li>
                <strong>GitHub:</strong> For version control and collaboration.{" "}
                <a
                  href="https://git-scm.com/downloads"
                  className="text-electric-violet-500 hover:text-electric-violet-700"
                >
                  Download Git
                </a>
                .
              </li>
              <li>
                <strong>Node.js:</strong> JavaScript runtime necessary for
                running the application.{" "}
                <a
                  href="https://nodejs.org/"
                  className="text-electric-violet-500 hover:text-electric-violet-700"
                >
                  Download Node.js
                </a>
                .
              </li>
            </ul>
          </span>
        ),
      },
    ],
  },
  {
    section: "Installation",
    qa: [
      {
        question: "Installation Steps",
        answer: (
          <span>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Ensure all required software is installed.</li>
              <li>
                Clone the repository:{" "}
                <code className="bg-background-default text-foreground-default p-1 rounded">
                  git clone
                  https://github.com/littlefish-foundation/boilerplate-e.git
                </code>
              </li>
              <li>
                Run{" "}
                <code className="bg-background-default text-foreground-default p-1 rounded">
                  npm install
                </code>{" "}
                in the project directory to install dependencies.
              </li>
              <li>
                Start the development server with{" "}
                <code className="bg-background-default text-foreground-default p-1 rounded">
                  npm run dev
                </code>
                .
              </li>
            </ol>
          </span>
        ),
      },
    ],
  },
];

export function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-header">
      <div className="py-14">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <h4 className="text-xl font-bold tracking-tight text-black dark:text-white">
              FAQs
            </h4>
            <h2
              id="faq-header"
              className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-6xl"
            >
              Frequently Asked Questions
            </h2>
            <p className="mt-6 text-xl leading-8 text-black/80 dark:text-white">
              Need help with something? Here are some of the most common
              questions we get.
            </p>
          </div>
          <div className="container mx-auto my-12 max-w-[600px] space-y-12">
            {faqs.map((faq, idx) => (
              <section
                key={idx}
                id={"faq-" + faq.section}
                aria-labelledby={"heading-" + idx}
              >
                <h2
                  id={"heading-" + idx}
                  className="mb-4 text-left text-base font-semibold tracking-tight text-foreground/60"
                >
                  {faq.section}
                </h2>
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col items-center justify-center"
                >
                  {faq.qa.map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={item.question}
                      className="w-full max-w-[600px]"
                    >
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
          <h4 className="mb-12 text-center text-sm font-medium tracking-tight text-foreground/80">
            Still have questions? Email us at{" "}
            <a
              href="https://discord.gg/zV6FspPEjG"
              className="underline hover:text-blue-600"
            >
              Ask at our Discord Channel
            </a>
          </h4>
        </div>
      </div>
    </section>
  );
}
