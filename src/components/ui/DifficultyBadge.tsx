import { cn } from '@/lib/utils';

interface DifficultyBadgeProps {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, className }) => {
  const baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const difficultyClasses = {
    Easy: "badge-difficulty-easy",
    Medium: "badge-difficulty-medium",
    Hard: "badge-difficulty-hard"
  };

  return (
    <span className={cn(baseClasses, difficultyClasses[difficulty], className)}>
      {difficulty}
    </span>
  );
};
