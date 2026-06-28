"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Issue } from "@/services/issue.service";
import L from "leaflet";
import Link from "next/link";

// Import Leaflet css styles
import "leaflet/dist/leaflet.css";

// Configure default asset path fallsbacks for standard leaflet markers in react/next builds
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
}

interface IssueMapProps {
  issues: Issue[];
}

/**
 * Maps an issue status to a marker color group.
 * Open = Red, In Progress = Orange, Resolved = Green.
 */
function getMarkerColor(status: string): "red" | "orange" | "green" {
  const normalized = (status || "").toLowerCase().replace(/_/g, " ");
  if (normalized === "pending" || normalized === "reported" || normalized === "open") {
    return "red";
  } else if (normalized === "in progress" || normalized === "in_progress") {
    return "orange";
  } else if (normalized === "resolved") {
    return "green";
  }
  return "red"; // default fallback
}

/**
 * Creates a Leaflet DivIcon using a custom inline SVG colored based on the status.
 */
function createMarkerIcon(status: string) {
  const color = getMarkerColor(status);
  
  // Tailwind color equivalents
  let hexColor = "#ef4444"; // Red (Open)
  if (color === "orange") {
    hexColor = "#f97316"; // Orange (In Progress)
  } else if (color === "green") {
    hexColor = "#22c55e"; // Green (Resolved)
  }

  // Modern SVG Pin icon with a drop shadow
  const svgHtml = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${hexColor}" width="32" height="32" style="filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.35));">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;

  return L.divIcon({
    html: svgHtml,
    className: "custom-leaflet-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

/**
 * Helper utilities for rendering issue statuses inside popup bubbles
 */
const getStatusLabel = (status: string) => {
  return (status || "").replace("_", " ");
};

const getStatusClass = (status: string) => {
  switch ((status || "").toLowerCase()) {
    case "pending":
    case "reported":
    case "open":
      return "bg-destructive/5 text-destructive dark:bg-destructive/20 border-destructive/20";
    case "in_progress":
    case "in progress":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200/50";
    case "resolved":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200/50";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

/**
 * A sub-component to fit the leaflet view to the bounding box of issues.
 * Runs whenever the list of issues changes.
 */
function MapBoundsUpdater({ issues }: { issues: Issue[] }) {
  const map = useMap();

  useEffect(() => {
    if (issues.length === 0) return;

    // Build the bounds array excluding any NaN coordinates
    const coordinates = issues
      .filter((issue) => typeof issue.latitude === "number" && typeof issue.longitude === "number")
      .map((issue) => [issue.latitude, issue.longitude] as [number, number]);

    if (coordinates.length === 0) return;

    const bounds = L.latLngBounds(coordinates);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }, [issues, map]);

  return null;
}

export function IssueMap({ issues }: IssueMapProps) {
  // Default coordinates (San Francisco)
  const defaultCenter: [number, number] = [37.7749, -122.4194];
  const defaultZoom = 13;

  // Filter issues to only show coordinates that are valid numbers
  const validIssues = issues.filter(
    (issue) =>
      typeof issue.latitude === "number" &&
      typeof issue.longitude === "number" &&
      !isNaN(issue.latitude) &&
      !isNaN(issue.longitude)
  );

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="w-full h-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validIssues.map((issue) => (
        <Marker
          key={issue.id}
          position={[issue.latitude, issue.longitude]}
          icon={createMarkerIcon(issue.status)}
        >
          <Popup className="custom-popup">
            <div className="w-[220px] font-sans p-1">
              {issue.image_url && (
                <div className="relative w-full h-28 mb-3 overflow-hidden rounded-lg bg-muted border border-border/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={issue.image_url}
                    alt={issue.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-primary/5 text-primary border border-primary/10 uppercase tracking-wider">
                    {issue.category || "General"}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize border ${getStatusClass(issue.status)}`}>
                    {getStatusLabel(issue.status)}
                  </span>
                </div>
                
                <h4 className="font-bold text-sm text-foreground line-clamp-1 leading-snug">
                  {issue.title}
                </h4>
                
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {issue.description}
                </p>

                {issue.support_count !== undefined && (
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <span className="font-semibold text-foreground">{issue.support_count}</span> supports
                  </div>
                )}
                
                <div className="pt-2 border-t mt-2">
                  <Link
                    href={`/issues/${issue.id}`}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold h-8 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
      <MapBoundsUpdater issues={validIssues} />
    </MapContainer>
  );
}
