import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { Marker as LeafletMarker, LeafletMouseEvent } from "leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import {
  clearCampusRouteGraph,
  computeCampusRoute,
  createRouteNode,
  exportCampusRouteGraph,
  haversineMeters,
  importCampusRouteGraph,
  loadCampusRouteGraph,
  saveCampusRouteGraph,
  type CampusRouteGraph,
  type RouteEdge,
  type RouteNode,
} from "../data/campusRoutes";

const defaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow });
const selectedIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [30, 48],
  iconAnchor: [15, 48],
  popupAnchor: [1, -38],
  shadowSize: [46, 46],
});
L.Marker.prototype.options.icon = defaultIcon;

const MAP_CENTER: [number, number] = [12.9235, 77.5005];
const MAP_ZOOM = 17;

function RouteEditorMap({
  graph,
  selectedIds,
  onMapClick,
  onNodeClick,
  onNodeDragEnd,
}: {
  graph: CampusRouteGraph;
  selectedIds: string[];
  onMapClick: (lat: number, lng: number) => void;
  onNodeClick: (nodeId: string) => void;
  onNodeDragEnd: (nodeId: string, lat: number, lng: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => map.invalidateSize());
    return () => window.cancelAnimationFrame(frame);
  }, [map]);

  const nodeById = useMemo(() => {
    return new Map(graph.nodes.map((node) => [node.id, node]));
  }, [graph.nodes]);

  return (
    <>
      <MapClickHandler onMapClick={onMapClick} />
      {graph.edges.map((edge, index) => {
        const from = nodeById.get(edge.from);
        const to = nodeById.get(edge.to);
        if (!from || !to) return null;
        return (
          <Polyline
            key={`${edge.from}-${edge.to}-${index}`}
            positions={[
              [from.lat, from.lng],
              [to.lat, to.lng],
            ]}
            pathOptions={{
              color: "#2563eb",
              weight: 4,
              opacity: 0.5,
              lineCap: "round",
              lineJoin: "round",
              dashArray: edge.bidirectional === false ? "8 8" : undefined,
            }}
          />
        );
      })}
      {graph.nodes.map((node) => {
        const isSelected = selectedIds.includes(node.id);
        return (
          <Marker
            key={node.id}
            position={[node.lat, node.lng]}
            draggable
            icon={isSelected ? selectedIcon : defaultIcon}
            eventHandlers={{
              click: () => onNodeClick(node.id),
              dragend: (event) => {
                const marker = event.target as LeafletMarker;
                const point = marker.getLatLng();
                onNodeDragEnd(node.id, point.lat, point.lng);
              },
            }}
          />
        );
      })}
    </>
  );
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const handler = (event: LeafletMouseEvent) => {
      onMapClick(event.latlng.lat, event.latlng.lng);
    };
    map.on("click", handler);
    return () => {
      map.off("click", handler);
    };
  }, [map, onMapClick]);

  return null;
}

function RoutePreview({
  graph,
  previewStart,
  previewEnd,
}: {
  graph: CampusRouteGraph;
  previewStart: [number, number] | null;
  previewEnd: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => map.invalidateSize());
    return () => window.cancelAnimationFrame(frame);
  }, [map]);

  const route =
    previewStart && previewEnd
      ? computeCampusRoute(
          graph,
          { lat: previewStart[0], lng: previewStart[1] },
          { lat: previewEnd[0], lng: previewEnd[1] },
        )
      : null;

  if (!route) return null;

  return (
    <Polyline
      positions={route.path}
      pathOptions={{
        color: "#111827",
        weight: 5,
        opacity: 0.8,
        lineCap: "round",
        lineJoin: "round",
        dashArray: "4 6",
      }}
    />
  );
}

export function RouteEditorApp() {
  const [graph, setGraph] = useState<CampusRouteGraph>(() => loadCampusRouteGraph());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [labelDraft, setLabelDraft] = useState("");
  const [importText, setImportText] = useState("");
  const [status, setStatus] = useState<string>("Loaded route graph.");
  const [previewStart, setPreviewStart] = useState<[number, number] | null>(null);
  const [previewEnd, setPreviewEnd] = useState<[number, number] | null>(null);

  useEffect(() => {
    saveCampusRouteGraph(graph);
  }, [graph]);

  useEffect(() => {
    const sync = () => setGraph(loadCampusRouteGraph());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const nodeById = useMemo(() => {
    return new Map(graph.nodes.map((node) => [node.id, node]));
  }, [graph.nodes]);

  const selectedNodes = selectedIds
    .map((id) => nodeById.get(id))
    .filter((node): node is RouteNode => Boolean(node));

  const edgeCount = graph.edges.length;

  const addNode = (lat: number, lng: number) => {
    const node = createRouteNode(lat, lng, labelDraft);
    setGraph((current) => ({
      ...current,
      nodes: [...current.nodes, node],
    }));
    setSelectedIds([node.id]);
    setStatus(`Added node ${node.label ?? node.id}.`);
  };

  const toggleNode = (nodeId: string) => {
    setSelectedIds((current) => {
      if (current.includes(nodeId)) {
        return current.filter((id) => id !== nodeId);
      }
      if (current.length >= 2) {
        return [current[1], nodeId];
      }
      return [...current, nodeId];
    });
  };

  const connectSelected = () => {
    if (selectedIds.length !== 2) return;
    const [from, to] = selectedIds;
    const a = nodeById.get(from);
    const b = nodeById.get(to);
    if (!a || !b) return;

    setGraph((current) => {
      const exists = current.edges.some(
        (edge) =>
          (edge.from === from && edge.to === to) ||
          (edge.from === to && edge.to === from),
      );
      if (exists) return current;
      const edge: RouteEdge = {
        from,
        to,
        bidirectional: true,
        weightMeters: haversineMeters(a, b),
      };
      return {
        ...current,
        edges: [...current.edges, edge],
      };
    });
    setStatus(`Connected ${a.label ?? a.id} to ${b.label ?? b.id}.`);
    setSelectedIds([]);
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    setGraph((current) => ({
      nodes: current.nodes.filter((node) => !selectedIds.includes(node.id)),
      edges: current.edges.filter(
        (edge) =>
          !selectedIds.includes(edge.from) && !selectedIds.includes(edge.to),
      ),
      version: 1,
    }));
    setStatus(`Deleted ${selectedIds.length} node(s).`);
    setSelectedIds([]);
  };

  const clearGraph = () => {
    clearCampusRouteGraph();
    setGraph({ version: 1, nodes: [], edges: [] });
    setSelectedIds([]);
    setStatus("Cleared campus route graph.");
  };

  const exportGraph = () => {
    const payload = exportCampusRouteGraph(graph);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "campus-route-graph.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Downloaded campus-route-graph.json.");
  };

  const importGraph = () => {
    try {
      const parsed = importCampusRouteGraph(importText);
      setGraph(parsed);
      setSelectedIds([]);
      setStatus(`Imported ${parsed.nodes.length} node(s).`);
    } catch {
      setStatus("Could not import JSON. Please check the format.");
    }
  };

  const selectedRoutePreview = useMemo(() => {
    if (selectedNodes.length !== 2) return null;
    return computeCampusRoute(
      graph,
      { lat: selectedNodes[0].lat, lng: selectedNodes[0].lng },
      { lat: selectedNodes[1].lat, lng: selectedNodes[1].lng },
    );
  }, [graph, selectedNodes]);

  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-4 p-4 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Separate tool
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold">Campus Route Editor</h1>
            <p className="mt-2 text-sm text-stone-500">
              Click the map to drop internal road nodes, connect them, and save a
              route graph that the dashboard can use for shortest-path routing.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">Nodes</span>
              <span className="text-stone-500">{graph.nodes.length}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-medium">Edges</span>
              <span className="text-stone-500">{edgeCount}</span>
            </div>
            <p className="mt-3 text-xs text-stone-500">{status}</p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-stone-800">
              Optional label for new node
            </label>
            <input
              value={labelDraft}
              onChange={(event) => setLabelDraft(event.target.value)}
              placeholder="e.g. Main Road Node"
              className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={connectSelected}
              disabled={selectedIds.length !== 2}
              className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Connect selected
            </button>
            <button
              type="button"
              onClick={deleteSelected}
              disabled={selectedIds.length === 0}
              className="rounded-xl border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete selected
            </button>
            <button
              type="button"
              onClick={exportGraph}
              className="rounded-xl border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700"
            >
              Download JSON
            </button>
            <button
              type="button"
              onClick={clearGraph}
              className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700"
            >
              Clear graph
            </button>
          </div>

          <div className="space-y-2 rounded-2xl border border-stone-200 p-3">
            <label className="block text-sm font-semibold text-stone-800">
              Import graph JSON
            </label>
            <textarea
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
              rows={7}
              className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs outline-none focus:border-primary"
              placeholder="Paste exported JSON here"
            />
            <button
              type="button"
              onClick={importGraph}
              className="w-full rounded-xl bg-stone-900 px-3 py-2 text-sm font-semibold text-white"
            >
              Import graph
            </button>
          </div>

          <div className="space-y-2 rounded-2xl border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-800">Selected nodes</p>
            {selectedNodes.length > 0 ? (
              <ul className="space-y-1 text-sm text-stone-600">
                {selectedNodes.map((node) => (
                  <li key={node.id} className="rounded-lg bg-stone-50 px-2 py-1">
                    {node.label ?? node.id}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-stone-500">No nodes selected.</p>
            )}
            {selectedRoutePreview && (
              <p className="text-xs text-stone-500">
                Preview route: {Math.round(selectedRoutePreview.distanceMeters)} m
                across {selectedRoutePreview.nodeIds.length} node(s).
              </p>
            )}
          </div>
        </aside>

        <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="h-[calc(100vh-2rem)] min-h-[720px]">
            <MapContainer
              center={MAP_CENTER}
              zoom={MAP_ZOOM}
              scrollWheelZoom
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />
              <RouteEditorMap
                graph={graph}
                selectedIds={selectedIds}
                onMapClick={addNode}
                onNodeClick={toggleNode}
                onNodeDragEnd={(nodeId, lat, lng) => {
                  setGraph((current) => ({
                    ...current,
                    nodes: current.nodes.map((node) =>
                      node.id === nodeId ? { ...node, lat, lng } : node,
                    ),
                  })); 
                }}
              />
              {selectedRoutePreview && (
                <Polyline
                  positions={selectedRoutePreview.path}
                  pathOptions={{
                    color: "#111827",
                    weight: 5,
                    opacity: 0.85,
                    lineCap: "round",
                    lineJoin: "round",
                    dashArray: "4 6",
                  }}
                />
              )}
            </MapContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
