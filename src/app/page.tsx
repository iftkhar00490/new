import EntranceTerminal from "@/components/EntranceTerminal";
import CreativeLens from "@/components/CreativeLens";
import SchematicPaper from "@/components/SchematicPaper";
import AutomotiveCore from "@/components/AutomotiveCore";
import StrategicOps from "@/components/StrategicOps";
import ContactHandshake from "@/components/ContactHandshake";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* 1. Camille Mormal Zoom Entrance */}
      <EntranceTerminal />

      {/* 2. Interactive Camera Viewport Scroll Pinned Section */}
      <CreativeLens />

      {/* 3. Schematic Blueprint Paper Section */}
      <SchematicPaper />

      {/* 4. Italian Supercar Automotive Cockpit / Infotainment */}
      <AutomotiveCore />

      {/* 5. Strategic Operations & Branding Case Studies */}
      <StrategicOps />

      {/* 6. Closing Terminal Handshake & Footer */}
      <ContactHandshake />
    </div>
  );
}
