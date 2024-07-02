"use client"

import { useState } from "react";
import prisma from "@/app/lib/prisma";

export default function SettingsPage() {
    const [policy, setPolicy] = useState("");
    const [message, setMessage] = useState("");

    async function PolicyRegister(policyID: string) {
        if (policyID.length != 56) {
            return false;
        }
        const alreadyExists = await prisma.policy.findUnique({
            where: {
                policyID: policyID,
            },
        });
        if (alreadyExists) {
            return false;
        }
        await prisma.policy.create({
            data: {
                policyID: policyID,
            },
        });
        return true;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await PolicyRegister(policy);
      };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Register New Policy</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-lg">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="policyID">
                        Policy ID
                    </label>
                    <input
                        type="text"
                        id="policyID"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={policy}
                        onChange={(e) => setPolicy(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Register
                    </button>
                </div>
                {message && <p className="text-red-500 text-xs italic">{message}</p>}
            </form>
        </div>
    );

}