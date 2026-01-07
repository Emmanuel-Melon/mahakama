import { Search, Library, Users, ArrowRight } from "lucide-react";
import { IconContainer } from "~/components/icon-container";
import { FileText } from "lucide-react";
import { cn } from "~/lib/utils";
import { NavLink } from "react-router";

const features = [
    {
        id: "find-answers",
        icon: Search,
        title: "Find Legal Answers",
        description:
            "Get clear, easy-to-understand answers to your legal questions in minutes, not hours.",
        href: "/"
    },
    {
        id: "legal-library",
        icon: Library,
        title: "Legal Library",
        description: "Access a comprehensive library of legal documents, forms, and resources at your fingertips.",
        href: "/documents"
    },
    {
        id: "connect-experts",
        icon: Users,
        title: "Connect with Experts",
        description: "Get personalized guidance from vetted legal professionals when you need it most.",
        href: "/lawyers"
    },
];

export const MahakamaFeatures = () => {
    return (
        <div className="bg-white py-16">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <div className="flex justify-center">
                        <IconContainer icon={FileText} color="outline" size="lg" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Your Legal Journey, Simplified
                    </h2>

                    <p className="text-lg text-gray-600">
                        Access the legal resources and support you need, whether you're facing a legal issue or just need information.
                        Our platform makes the law accessible to everyone.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className={cn(
                                "relative p-4 bg-white border-2 border-gray-900 group transition-all duration-200 transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]",
                                "flex gap-4 h-full",
                            )}
                            style={{
                                borderRadius: "16px 8px 16px 8px",
                                border: "2px solid #000",
                                boxShadow: "4px 4px 0 0 #000",
                            }}
                        >
                            {/* Decorative corner elements */}
                            <div className="absolute -right-2 -top-2 w-3 h-3 border-t-2 border-r-2 border-gray-900 bg-yellow-300"></div>
                            <div className="absolute -left-2 -bottom-2 w-3 h-3 border-b-2 border-l-2 border-gray-900 bg-yellow-300"></div>
                            <div className="space-y-4">
                                <div>
                                    <IconContainer
                                        icon={feature.icon}
                                        size="md"
                                        color="outline"
                                    />
                                </div>                                <h3 className="text-lg font-black text-gray-900 mb-2 relative inline-block">
                                    {feature.title}
                                    <div className="absolute -bottom-0.5 left-0 right-0 h-1.5 bg-yellow-200/60 -rotate-1 -z-10"></div>
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>

                                <NavLink to={feature.href} className="p-2 inline-flex items-center justify-center px-3 py-1.5 text-sm font-bold transition-colors 4px 8px 4px 8px 2px 2px 0 0 #000">
                                    <div className="flex items-center gap-2">
                                        Learn More <ArrowRight className="ml-2" />
                                    </div>
                                </NavLink>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};