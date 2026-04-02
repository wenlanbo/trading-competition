import { cn } from '@/lib/utils/style'

import { DownIcon } from '../icons/DownIcon'
import { UpIcon } from '../icons/UpIcon'

interface TableSortControlsProps {
  active?: boolean
  direction?: 'asc' | 'desc'
}

export const TableSortControls = ({
  active,
  direction,
}: TableSortControlsProps) => (
  <div className="space-y-0.5">
    <UpIcon
      className={cn(
        'h-2 w-2.5',
        active && direction === 'asc' ? 'text-white' : 'text-text-secondary'
      )}
    />
    <DownIcon
      className={cn(
        'h-2 w-2.5',
        active && direction === 'desc' ? 'text-white' : 'text-text-secondary'
      )}
    />
  </div>
)
