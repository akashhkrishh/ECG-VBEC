import { NavBar } from "@/components/custom";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-screen h-screen flex flex-col">
            {/* <NavBar/> */}
            {children}
        </div>
        
    );
}
