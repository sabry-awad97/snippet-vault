import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import DefaultLogo from './DefaultLogo';

const SidebarHeader: React.FC<{
  logo?: React.ReactNode;
  toggleSidebar: () => void;
}> = ({ logo, toggleSidebar }) => (
  <div className="flex items-center justify-between">
    {logo || <DefaultLogo />}
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="md:hidden"
    >
      <X className="h-6 w-6" />
    </Button>
  </div>
);

export default SidebarHeader;
