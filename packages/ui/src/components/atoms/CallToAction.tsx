import { Button } from "../Button";
import { NavLink } from "react-router";
import { Scale, Gavel, ArrowRight } from "lucide-react";
import { IconContainer } from "../IconContainer";

export const CallToAction = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 text-center space-y-4">
        <div className="flex justify-center">
          <IconContainer icon={Scale} color="outline" size="lg" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of users who are already using Mahakama to understand
          their legal rights and access legal services.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="group flex-1 border-2 border-gray-900 bg-white hover:bg-gray-50 text-gray-900 hover:text-gray-900 font-medium py-6 px-6 rounded-lg transition-all duration-200 hover:shadow-md"
          >
            <NavLink
              viewTransition
              to="/app/citizen"
              className="flex items-center justify-center gap-2"
            >
              <Scale className="h-5 w-5" />
              <span>I'm a Citizen</span>
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </NavLink>
          </Button>

          <Button
            asChild
            size="lg"
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-6 px-6 rounded-lg transition-all duration-200 hover:shadow-md"
          >
            <NavLink
              viewTransition
              to="/app/legal-professional"
              className="flex items-center justify-center gap-2"
            >
              <Gavel className="h-5 w-5" />
              <span>I'm a Legal Professional</span>
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </NavLink>
          </Button>
        </div>
      </div>
    </div>
  );
};
