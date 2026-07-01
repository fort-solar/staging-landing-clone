"use client"

import React, { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api"
import { MapPinned } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${office.position.lat},${office.position.lng}&travelmode=driving`

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
      <div className="relative overflow-hidden h-full rounded-2xl">
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
        <Button
          asChild
          className="absolute bottom-4 left-4 z-10 rounded-xl bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#048A05_110.95%)] px-4 py-5 text-white shadow-lg hover:opacity-90"
        >
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open directions to ${office.label} in Google Maps`}
          >
            <MapPinned className="size-4" />
            Open in Map
          </a>
        </Button>
      </div>
    </div>
  )
}

export default ContactMap


