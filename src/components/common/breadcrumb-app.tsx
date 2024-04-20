"use client";

import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function BreadcrumbApp() {
  const url = usePathname();
  const breadcrumbArraySplit = url.toString().split("/");
  console.log("breadcrumbArraySplit", breadcrumbArraySplit);
  const breadcrumbArray: { title: ReactNode }[] = breadcrumbArraySplit
    .filter((s) => s)
    .map((path, index, arrayThis) => {
      return {
        title: (
          <>
            {index + 1 === arrayThis.length ? (
              path
            ) : (
              <Link href={url.slice(0, url.indexOf(path)) + path}>{path}</Link>
            )}
          </>
        ),
      };
    });
  return (
    <div>
      {/* <Breadcrumb style={{ margin: "16px 0" }} items={breadcrumbArray} /> */}

      <Breadcrumbs underline={"hover"} color="primary" size="lg">
        {breadcrumbArray.map((b, i) => (
          <BreadcrumbItem key={i}>{b.title}</BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
}
