import { Progress } from '@/components/ui/progress';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
}) => {
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;
    if (password.match(/[$@#&!]+/)) strength += 25;
    return Math.min(100, strength);
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 50) return 'bg-red-500';
    if (strength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const strength = calculatePasswordStrength(password);

  return (
    <div className="mt-2">
      <label className="text-sm font-medium">Password Strength</label>
      <Progress
        value={strength}
        className={`mt-1 ${getPasswordStrengthColor(strength)}`}
      />
    </div>
  );
};
