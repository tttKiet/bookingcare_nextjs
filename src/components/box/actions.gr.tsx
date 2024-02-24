export interface ActionGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ActionGroup({ children, className }: ActionGroupProps) {
  return (
    <div className={`${className} flex items-center  gap-2 text-base `}>
      {children}
    </div>
  );
}
