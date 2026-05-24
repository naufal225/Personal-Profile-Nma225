import { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { adminGetSkills } from '../../api/skills'
import { toast } from 'sonner'
import Badge from './Badge'

export default function SkillsSelector({ value = [], onChange }) {
  const [allSkills, setAllSkills] = useState([])
  const [loading, setLoading] = useState(false)
  const [customInput, setCustomInput] = useState('')

  useEffect(() => {
    setLoading(true)
    adminGetSkills()
      .then((res) => {
        setAllSkills(res.data.data ?? [])
      })
      .catch(() => {
        toast.error('Failed to load skills list')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const selectedSet = new Set(value)

  const handleToggle = (skillName) => {
    let updated
    if (selectedSet.has(skillName)) {
      updated = value.filter((s) => s !== skillName)
    } else {
      updated = [...value, skillName]
    }
    onChange(updated)
  }

  const handleAddCustom = (e) => {
    if (e) e.preventDefault()
    const trimmed = customInput.trim()
    if (!trimmed) return
    if (selectedSet.has(trimmed)) {
      toast.error('Skill is already selected')
      return
    }
    onChange([...value, trimmed])
    setCustomInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddCustom()
    }
  }

  // Group database skills by category
  const grouped = allSkills.reduce((acc, s) => {
    const cat = s.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(s)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      {/* Selected Chips */}
      <div className="flex flex-wrap gap-1.5 p-3 rounded-lg border border-input min-h-[46px] bg-background">
        {value.length === 0 ? (
          <span className="text-sm text-muted-foreground self-center">No skills selected. Click below or add custom.</span>
        ) : (
          value.map((skillName) => (
            <Badge key={skillName} variant="secondary" className="flex items-center gap-1 py-1 pl-2.5 pr-1.5 text-xs font-medium">
              {skillName}
              <button
                type="button"
                onClick={() => handleToggle(skillName)}
                className="rounded-full p-0.5 hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>

      {/* Add Custom Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type custom skill (e.g. AWS)"
          className="flex-1 px-3 py-1.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
        />
        <button
          type="button"
          onClick={handleAddCustom}
          className="inline-flex items-center justify-center p-2 rounded-lg border border-input bg-muted/50 hover:bg-muted text-foreground transition-colors"
          title="Add custom skill"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Database Skills Selection */}
      <div className="space-y-3.5 pt-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select from existing skills:</p>
        {loading ? (
          <div className="text-sm text-muted-foreground animate-pulse">Loading available skills...</div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-sm text-muted-foreground">No existing skills found in DB. Add custom skills above.</div>
        ) : (
          <div className="space-y-3">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="space-y-1.5">
                <span className="text-[11px] font-medium text-muted-foreground/80">{category}</span>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((skill) => {
                    const isSelected = selectedSet.has(skill.name)
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => handleToggle(skill.name)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-200 ${
                          isSelected
                            ? 'bg-primary/10 text-primary border-primary/40 font-semibold'
                            : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        {skill.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
