import { Link, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Главная' },
  { to: '/map', label: 'Карта тем' },
  { to: '/topics', label: 'Темы' },
  { to: '/achievements', label: 'Достижения' },
  { to: '/profile', label: 'Профиль' },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-lumen-silver-light/80 bg-lumen-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lumen-graphite shadow-[0_4px_12px_rgba(30,41,59,0.2)]">
              <div className="h-4 w-4 rounded-full bg-lumen-teal shadow-[0_0_12px_rgba(13,148,136,0.7)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-lumen-graphite group-hover:text-lumen-blue transition-colors">
                Люмен
              </p>
              <p className="hidden text-xs text-lumen-silver sm:block">
                Лаборатория решений
              </p>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive =
                item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-lumen-blue-soft text-lumen-blue shadow-sm'
                      : 'text-lumen-graphite-light hover:bg-lumen-silver-light/60 hover:text-lumen-graphite'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-lumen-silver-light bg-lumen-surface/80">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <p className="text-center text-sm text-lumen-silver">
            Люмен. Лаборатория решений — понять, а не заучить
          </p>
        </div>
      </footer>
    </div>
  );
}
