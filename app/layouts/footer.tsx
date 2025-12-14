import { cn } from "~/lib/utils";
import { Github, Twitter, Mail, Scale } from "lucide-react";
import { CardWithLabel } from "~/components/ui/card-with-label";
import { IconContainer } from "~/components/icon-container";

export function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <CardWithLabel
            label="Mahakama"
            className="border-t-2 border-l-2 border-r-2 rounded-t-3xl"
            labelClassName="bg-white text-gray-900"
        >
            <div className="space-y-4">

                <div className="space-y-4">
                    <div className="space-y-2">
                        <IconContainer icon={Scale} size="md" color="handdrawn" />
                        <p className="text-xl font-bold">Mahakama</p>
                    </div>
                    <p className="text-gray-600 text-sm">
                        Making legal knowledge accessible to everyone in East Africa.
                    </p>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-center text-sm text-gray-500">
                    &copy; {currentYear} Mahakama. All rights reserved.
                </p>
            </div>
        </CardWithLabel>
    );
}