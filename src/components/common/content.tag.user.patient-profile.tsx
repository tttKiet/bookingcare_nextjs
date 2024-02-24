import { useMemo } from "react";

export interface ItemContentPatientProfile {
  key: string | number;
  component: React.ReactNode | string;
}

export interface IContentTagPatientProfileProps {
  items: ItemContentPatientProfile[];
  activeKey: string;
}

export function ContentTagPatientProfile({
  items,
  activeKey,
}: IContentTagPatientProfileProps) {
  const itemActive = useMemo(() => {
    const filter = items.find((item) => item.key === activeKey);
    if (!filter) return items?.[0] || [];
    return filter;
  }, [items]);

  return <div>{itemActive.component}</div>;
}
