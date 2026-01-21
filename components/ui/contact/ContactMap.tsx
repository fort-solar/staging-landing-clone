"use client"

import React, { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api"

const offices = {
  lagos: {
    label: "Lagos",
    position: { lat: 6.4701551, lng: 3.5865285 },
  },
  abuja: {
    label: "Uyo, Akwa Ibom State",
    position: { lat: 5.034736, lng: 7.9255038 },
  },
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  border: "0px"
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
    <div className="h-112.5 lg:h-150 w-full space-y-6">

      <Tabs
        defaultValue="lagos"
        onValueChange={(value) =>
          setActiveOffice(value as keyof typeof offices)
        }
      >
        <TabsList className="grid grid-cols-2 w-full rounded-lg bg-[#B8C0CC]">
          {Object.entries(offices).map(([key, office]) => (
            <TabsTrigger
              key={key}
              value={key}
              className="px-6"
            >
              {office.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="overflow-hidden h-full">
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
    </div>
  )
}

export default ContactMap



