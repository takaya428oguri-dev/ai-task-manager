import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-white overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
