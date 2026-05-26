import { LogOut, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu'
import { Button } from '../ui/Button'
import { Avatar, AvatarFallback } from '../ui/Avatar'
import { useAuth } from '../../hooks/useAuth'

function initials(name) {
  if (!name) return 'A'
  return name
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function UserMenu() {
  const { user, logout } = useAuth()
  const display = user?.name || user?.email || 'Admin'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 px-2" aria-label="User menu">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs">{initials(display)}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:inline">{display}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{display}</span>
            {user?.email && user?.name && (
              <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <User className="h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>
          <LogOut className="h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
