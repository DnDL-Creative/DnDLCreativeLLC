import { Metadata } from "next";
import CommandCenter from "./CommandCenter"; // Importing the client component

export const metadata: Metadata = {
  title: "DnDL Creative LLC",
  description: "Company tools to run smooth as unsalted butter.",
};

export default function Page() {
  return <CommandCenter />;
}
