import { Separator } from "~/components/ui/separator"
import { SidebarTrigger } from "~/components/ui/sidebar"
import { HelpCircle, Scale, PhoneCall } from "lucide-react"
import { NavLink } from "react-router"

interface SiteHeaderProps {
    title?: string;
}

export function SiteHeader({ title = "Documents" }: SiteHeaderProps) {
    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) py-2">
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-1 px-2 lg:gap-2 lg:px-6">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mx-2 data-[orientation=vertical]:h-4"
                    />
                    <NavLink
                        to="/"
                        viewTransition
                        className="flex items-center gap-2 group"
                    >
                        <Scale className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-base font-semibold">Mahakama</span>
                    </NavLink>
                </div>
                <div className="flex gap-2">
                    <NavLink
                        to="/help"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <HelpCircle className="h-4 w-4" />
                        <span>Help</span>
                    </NavLink>
                    <NavLink
                        to="/contact"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <PhoneCall className="h-4 w-4" />
                        <span>Contact Us</span>
                    </NavLink>
                </div>
            </div>
        </header>
    )
}
