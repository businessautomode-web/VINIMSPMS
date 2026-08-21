import type {Metadata} from "next";
import "./globals.css";
export const metadata:Metadata={title:"VIN GROUP PMS + IMS",description:"Production and Inventory Management System developed by System Master.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
