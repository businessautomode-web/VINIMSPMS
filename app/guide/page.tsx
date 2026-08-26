"use client";
import {useState} from "react";
import "../guide.css";

const english=[
  ["System Setup","Create branches, warehouses, units, products, raw materials, chemicals, suppliers, customers and users. Assign permissions before operational entry."],
  ["Opening and Daily Stock","Use IMS Stock In for opening stock, purchases and returns. Use Stock Out for issue, dispatch and adjustment. Always select the correct branch and warehouse."],
  ["Recipe / BOM","Create active BOM rows for each finished product with standard production quantity, material type, material ID, standard quantity, unit, tolerance and version."],
  ["Production Cycle","Create batch → calculate BOM → issue materials → record actual consumption, return and waste → output and QC → manager approval → finished stock."],
  ["Stock Transfer","Dispatch stock from the source location and confirm receipt at the destination. Until receipt, the transfer remains In Transit."],
  ["Permissions","View, Create, Edit, Delete, Approve, Export and Print are independent rights. Grant only the access required for each job role."],
  ["Trash and Restore","Deleted records move to Trash with user and time history. Authorized users may restore them for 15 days, after which they are permanently removed."],
  ["Daily Control","Review pending batches, low stock, transfer receipts, scrap, rejection, variance and Last Sync before daily closing."],
];
const hindi=[
  ["सिस्टम सेटअप","ब्रांच, वेयरहाउस, यूनिट, प्रोडक्ट, रॉ मटेरियल, केमिकल, सप्लायर, कस्टमर और यूज़र बनाएं। काम शुरू करने से पहले परमिशन सेट करें।"],
  ["ओपनिंग एवं दैनिक स्टॉक","Opening Stock, purchase और return के लिए IMS Stock In करें। Issue, dispatch और adjustment के लिए Stock Out करें। सही branch और warehouse चुनें।"],
  ["रेसिपी / BOM","हर finished product की active BOM बनाएं। Standard production quantity, material type, material ID, standard quantity, unit, tolerance और version भरें।"],
  ["प्रोडक्शन प्रक्रिया","Batch बनाएं → BOM calculate करें → material issue → consumption, return और waste → output एवं QC → manager approval → finished stock।"],
  ["स्टॉक ट्रांसफर","Source location से dispatch और destination पर receive confirm करें। Receive होने तक transfer In Transit रहेगा।"],
  ["परमिशन","View, Create, Edit, Delete, Approve, Export और Print अलग-अलग अधिकार हैं। हर role को केवल आवश्यक access दें।"],
  ["ट्रैश एवं रिस्टोर","Delete record user और time history के साथ Trash में जाएगा। 15 दिन तक restore किया जा सकता है, फिर permanently remove होगा।"],
  ["दैनिक नियंत्रण","Daily closing से पहले pending batches, low stock, transfer receipt, scrap, rejection, variance और Last Sync check करें।"],
];

export default function Guide(){const[language,setLanguage]=useState<"en"|"hi">("en");const content=language==="en"?english:hindi;return <main className="guidePage"><header><div><small>VIN GROUP</small><h1>PMS + IMS User Guide</h1><p>Plastic additives, compounds, masterbatch and recycling operations</p></div><div className="guideLang"><button className={language==="en"?"active":""} onClick={()=>setLanguage("en")}>English</button><button className={language==="hi"?"active":""} onClick={()=>setLanguage("hi")}>हिन्दी</button></div></header><section className="guideIntro"><b>{language==="en"?"Recommended workflow":"सुझाई गई प्रक्रिया"}</b><span>Masters → Opening Stock → BOM → Production → QC → Approval → Reports</span></section><section className="guideCards">{content.map((item,index)=><article key={item[0]}><i>{String(index+1).padStart(2,"0")}</i><div><h2>{item[0]}</h2><p>{item[1]}</p></div></article>)}</section><footer><div><b>SystemMaster Automations</b><span>Implementation & Technical Support</span></div><div><a href="tel:+919027965956">+91 90279 65956</a><a href="mailto:connect@systemmaster.in">connect@systemmaster.in</a><a href="https://www.systemmaster.in">www.systemmaster.in</a></div></footer></main>}
