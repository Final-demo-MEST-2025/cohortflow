import NavLinks from "./nav-links";


export default function SideNav() {

  return (
    <div className="flex w-full px-3 py-4 md:px-2">
      <div
        className="flex grow flex-row justify-between space-x-2 md:space-x-2 md:space-y-0
          overflow-auto scrollbar-none md:scrollbar-thin md:scrollbar-thumb-brand-200 md:scrollbar-track-transparent"
      >
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
      </div>
    </div>
  );
}
