import { Badge } from '@reappit/ui/components/badge';

export function CharacterCount({
  current,
  min,
  max,
  optimal,
}: {
  current: number;
  min?: number;
  max: number;
  optimal?: number;
}) {
  const getColor = () => {
    if (min && current < min) return 'text-red-500';
    if (optimal && current > optimal) return 'text-yellow-500';
    if (current > max) return 'text-red-500';
    return 'text-green-500';
  };

  const getStatus = () => {
    if (min && current < min) return 'Too short';
    if (optimal && current <= optimal && current >= min!) return 'Optimal';
    if (current > max) return 'Too long';
    return 'Good';
  };

  return (
    <div className="flex items-center justify-between text-sm">
      <span className={getColor()}>
        {current}/{max}
      </span>
      <Badge variant={getStatus() === 'Optimal' ? 'default' : 'secondary'}>
        {getStatus()}
      </Badge>
    </div>
  );
}
