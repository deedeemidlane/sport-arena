import { NavLink } from "react-router";

export const Sidebar = ({
  options,
}: {
  options: {
    url: string;
    name: string;
    icon: React.ReactElement;
  }[];
}) => {
  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen hidden md:block">
      <div className="border-r bg-muted/40 h-full">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <img src="/logo.png" className="h-6 w-6" />
              <span className="text-lg font-heading font-bold text-primary">
                SportArena
              </span>
            </a>
          </div>
          <div className="flex-1">
            <nav className="grid gap-1 items-start px-2 text-sm font-medium lg:px-4">
              {options.map((option, index) => (
                <NavLink
                  key={index}
                  to={option.url}
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center rounded-lg px-3 py-2 transition-all bg-muted text-primary cursor-default"
                      : "flex items-center rounded-lg px-3 py-2 transition-all hover:text-primary hover:bg-muted"
                  }
                >
                  {option.icon}
                  <span className="ml-3">{option.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
};
