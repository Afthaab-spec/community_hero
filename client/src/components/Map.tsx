import { useEffect, useRef, useState } from "react";

interface MapViewProps {
  apiKey: string;
  className?: string;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  onMapReady?: (map: google.maps.Map) => void;
}

export function MapView({
  apiKey,
  className = "",
  initialCenter = { lat: 37.7749, lng: -122.4194 },
  initialZoom = 12,
  onMapReady,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const onMapReadyRef = useRef(onMapReady);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  onMapReadyRef.current = onMapReady;

  useEffect(() => {
    if (!apiKey || !mapContainerRef.current) return;

    let cancelled = false;

    const initMap = () => {
      if (cancelled || !mapContainerRef.current) return;

      try {
        const map = new google.maps.Map(mapContainerRef.current, {
          zoom: initialZoom,
          center: initialCenter,
          mapTypeControl: true,
          fullscreenControl: true,
          zoomControl: true,
          streetViewControl: true,
        });

        mapInstanceRef.current = map;

        if (onMapReadyRef.current) {
          onMapReadyRef.current(map);
        }

        if (!cancelled) {
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg("Failed to initialize map");
          setStatus("error");
        }
      }
    };

    if (window.google?.maps) {
      initMap();
      return () => { cancelled = true; };
    }

    const scriptId = "google-maps-script";
    let existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.google?.maps) {
        initMap();
      } else {
        existingScript.addEventListener("load", initMap);
      }
      return () => {
        cancelled = true;
        existingScript?.removeEventListener("load", initMap);
      };
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (!cancelled) {
        initMap();
      }
    };

    script.onerror = () => {
      if (!cancelled) {
        setErrorMsg("Failed to load Google Maps script");
        setStatus("error");
      }
    };

    document.head.appendChild(script);

    return () => {
      cancelled = true;
      script.removeEventListener("load", initMap);
    };
  }, [apiKey, initialCenter.lat, initialCenter.lng, initialZoom]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "500px" }} className={className}>
      {status === "loading" && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f3f4f6",
          zIndex: 1,
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "4px solid #e5e7eb",
              borderTopColor: "#22c55e",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }} />
            <p style={{ color: "#6b7280", fontSize: "14px" }}>Loading map...</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fef2f2",
          zIndex: 1,
        }}>
          <p style={{ color: "#dc2626", fontSize: "14px" }}>{errorMsg}</p>
        </div>
      )}

      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "500px",
        }}
      />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
