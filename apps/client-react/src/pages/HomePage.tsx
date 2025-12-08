import { InfoSection, PrincessSection } from "@/components/home";

export function HomePage() {
  return (
    <>
      <div className="flex flex-col items-center pt-8 text-gray-900">
        <InfoSection />
        <PrincessSection />
      </div>
    </>
  );
}
