"use client"

import React, { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api"

const offices = {
  lagos: {
    label: "Lagos",
    position: { lat: 6.5244, lng: 3.3792 },
    address: "Lagos, Nigeria",
  },
  abuja: {
    label: "Uyo",
    position: { lat: 9.0765, lng: 7.3986 },
    address: "Uyo, Nigeria",
  },
}

const mapContainerStyle = {
  width: "100%",
  height: "420px",
  borderRadius: "20px",
}

const ContactMap = () => {
  const [activeOffice, setActiveOffice] =
    useState<keyof typeof offices>("lagos")

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  const office = offices[activeOffice]

  if (!isLoaded) {
    return (
      <div className="h-full rounded-2xl bg-gray-200 animate-pulse" />
    )
  }

  return (
    <div className="h-full w-full space-y-6">

      <Tabs
        defaultValue="lagos"
        onValueChange={(value) =>
          setActiveOffice(value as keyof typeof offices)
        }
      >
        <TabsList className="grid grid-cols-2 w-full rounded-lg bg-[#B8C0CC]">
          {Object.entries(offices).map(([key, office], index) => (
            <TabsTrigger
              key={key}
              value={key}
              className="px-6"
            >
              Branch {index + 1} – {office.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="overflow-hidden h-full ">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={14}
          center={office.position}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
          }}
        >
          <Marker position={office.position} />
        </GoogleMap>
      </div>
      <p className="hidden lg:block text-center text-sm text-gray-600">
        {office.address}
      </p>
    </div>
  )
}

export default ContactMap
