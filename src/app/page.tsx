// src/app/page.tsx
import { Metadata } from "next";
import HomeClient from "./CommandCenter"; // We import the client file here

export const metadata: Metadata = {
  title: "DnDL Creative LLC",
  description: "Company tools to run like as smooth as unsalted butter",
};

export default function Page() {
  // If you needed to fetch server data (like session validation), do it here.
  // const session = await getSession();

  return <HomeClient />;
}
