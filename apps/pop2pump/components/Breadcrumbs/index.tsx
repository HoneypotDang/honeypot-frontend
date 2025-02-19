import {
  BreadcrumbItem,
  Breadcrumbs as NextBreadcrumbs,
} from "@nextui-org/react";
export type BreadcrumbType = {
    title: string
    href: string
}

export const Breadcrumbs = ({breadcrumbs}: {
    breadcrumbs: BreadcrumbType[]
}) => {
  return (
    <NextBreadcrumbs>
      {breadcrumbs.map(b => (
        <BreadcrumbItem href={b.href} key={b.title}>{b.title}</BreadcrumbItem>
      ))}

    </NextBreadcrumbs>
  );
};
