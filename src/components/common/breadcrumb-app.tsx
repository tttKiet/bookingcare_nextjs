"use client";

import { Breadcrumb } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BreadcrumbApp() {
  const url = usePathname();
  const breadcrumbArraySplit = url.toString().split("/");
  const breadcrumbArray = breadcrumbArraySplit.map((path, index, arrayThis) => {
    return {
      title:
        index + 1 === arrayThis.length ? (
          path
        ) : (
          <Link href={url.slice(0, url.indexOf(path)) + path}>{path}</Link>
        ),
    };
  });
  return (
    <div>
      <Breadcrumb style={{ margin: "16px 0" }} items={breadcrumbArray} />
    </div>
  );
}
