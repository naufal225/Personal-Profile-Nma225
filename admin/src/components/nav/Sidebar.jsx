import SidebarItem from './SidebarItem'
import { adminRoutes, adminGroups } from '../../routes/adminRoutes'

export default function Sidebar({ onNavigate }) {
  const ungrouped = adminRoutes.filter((r) => r.group === null)
  const byGroup = (g) => adminRoutes.filter((r) => r.group === g)

  return (
    <aside className="flex h-full w-full flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-5">
        <span className="text-sm font-semibold tracking-tight">Portfolio Admin</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {ungrouped.map((r) => (
            <SidebarItem
              key={r.path}
              to={r.path}
              icon={r.icon}
              label={r.label}
              onClick={onNavigate}
            />
          ))}
        </div>

        {adminGroups.map((group) => {
          const items = byGroup(group)
          if (items.length === 0) return null
          return (
            <div key={group} className="mt-6">
              <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group}
              </div>
              <div className="space-y-1">
                {items.map((r) => (
                  <SidebarItem
                    key={r.path}
                    to={r.path}
                    icon={r.icon}
                    label={r.label}
                    onClick={onNavigate}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
