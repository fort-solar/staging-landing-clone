import React from 'react'

const note = () => {
  return (
    <div>note</div>
  )
}

export default note




// "use client"

// import React, { useState } from "react"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// const offices = {
//   lagos: {
//     label: "Lagos",
//     position: { lat: 6.5244, lng: 3.3792 },
//     address: "Lagos, Nigeria",
//   },
//   abuja: {
//     label: "Uyo",
//     position: { lat: 9.0765, lng: 7.3986 },
//     address: "Uyo, Nigeria",
//   },
// }

// const StaticMap = ({ lat, lng }: { lat: number; lng: number }) => {
//   const src = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=14&size=800x420&markers=${lat},${lng},red-pushpin`;

//   return (
//     <img
//       src={src}
//       alt="Office location map"
//       className="w-full h-[420px] rounded-2xl object-cover"
//     />
//   )
// }

// const ContactMap = () => {
//   const [activeOffice, setActiveOffice] =
//     useState<keyof typeof offices>("lagos")

//   const office = offices[activeOffice]

//   return (
//     <div className="h-full w-full space-y-6">
//       <Tabs
//         defaultValue="lagos"
//         onValueChange={(value) =>
//           setActiveOffice(value as keyof typeof offices)
//         }
//       >
//         <TabsList className="grid grid-cols-2 w-full rounded-lg bg-[#B8C0CC]">
//           {Object.entries(offices).map(([key, office], index) => (
//             <TabsTrigger key={key} value={key} className="px-6">
//               Branch {index + 1} – {office.label}
//             </TabsTrigger>
//           ))}
//         </TabsList>
//       </Tabs>

//       <StaticMap
//         lat={office.position.lat}
//         lng={office.position.lng}
//       />

//       <p className="hidden lg:block text-center text-sm text-gray-600">
//         {office.address}
//       </p>
//     </div>
//   )
// }

// export default ContactMap