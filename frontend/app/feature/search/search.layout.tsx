import { Outlet } from "react-router";

export default function SearchLayout(props: any) {
    return (
        <div className="min-h-screen">
            <Outlet />
        </div>
    );
}
