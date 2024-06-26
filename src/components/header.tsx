"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const path = usePathname();

  return (
    <>
      <div className="py-2 flex flex-wrap gap-2 px-4">
        <CustomLinks name="User" path={path} link="/user" />
        <CustomLinks name="Course" path={path} link="/course" />
        <CustomLinks name="Vehicle" path={path} link="/vehicle" />
        <CustomLinks name="Agent" path={path} link="/agent" />
        <CustomLinks name="Course Amount" path={path} link="/course_amount" />
      </div>
    </>
  );
};

export default Header;

interface CustomLinksProps {
  link: string;
  name: string;
  path: string;
}

const CustomLinks = (props: CustomLinksProps) => {
  return (
    <Link
      href={props.link}
      className={`text-sm border border-[#51535a] py-1 px-2 ${
        props.path == props.link
          ? "bg-[#51535a] text-[#fefaee]"
          : "text-[#51535a]"
      }`}
    >
      {props.name}
    </Link>
  );
};
