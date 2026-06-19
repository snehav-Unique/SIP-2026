export type RouteNode = {
  id: string;
  lat: number;
  lng: number;
  label?: string;
};

export type RouteEdge = {
  from: string;
  to: string;
  bidirectional?: boolean;
  weightMeters?: number;
};

export type CampusRouteGraph = {
  version: 1;
  nodes: RouteNode[];
  edges: RouteEdge[];
};

export type CampusRouteResult = {
  path: [number, number][];
  nodeIds: string[];
  distanceMeters: number;
  durationSeconds: number;
  startNode: RouteNode;
  endNode: RouteNode;
};

type LocalPoint = {
  x: number;
  y: number;
};

type SnappedPoint = {
  edgeIndex: number;
  point: [number, number];
  t: number;
  distanceMeters: number;
};

type RouteNodeLike = RouteNode & {
  isVirtual?: boolean;
};

type GraphNodeMap = Map<string, RouteNodeLike>;
type GraphAdjacency = Map<string, Array<{ to: string; weight: number }>>;

const STORAGE_KEY = "rvce-campus-route-graph-v1";
const EARTH_RADIUS_METERS = 6371000;
const EPSILON = 1e-6;

export const EMPTY_CAMPUS_ROUTE_GRAPH: CampusRouteGraph = {
  version: 1,
  nodes: [],
  edges: [],
};

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRouteNode(value: unknown): value is RouteNode {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<RouteNode>;
  return (
    isString(candidate.id) &&
    isNumber(candidate.lat) &&
    isNumber(candidate.lng) &&
    (candidate.label === undefined || typeof candidate.label === "string")
  );
}

function isRouteEdge(value: unknown): value is RouteEdge {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<RouteEdge>;
  return (
    isString(candidate.from) &&
    isString(candidate.to) &&
    (candidate.bidirectional === undefined ||
      typeof candidate.bidirectional === "boolean") &&
    (candidate.weightMeters === undefined || isNumber(candidate.weightMeters))
  );
}

function normalizeGraph(graph: CampusRouteGraph): CampusRouteGraph {
  const nodeMap = new Map<string, RouteNodeLike>();
  graph.nodes.forEach((node) => {
    if (!nodeMap.has(node.id)) {
      nodeMap.set(node.id, {
        id: node.id,
        lat: node.lat,
        lng: node.lng,
        label: node.label?.trim() || undefined,
      });
    }
  });

  const uniqueEdges = new Map<string, RouteEdge>();
  graph.edges.forEach((edge) => {
    if (!nodeMap.has(edge.from) || !nodeMap.has(edge.to)) return;
    const key = `${edge.from}->${edge.to}:${edge.bidirectional === false ? "oneway" : "twoway"}`;
    if (!uniqueEdges.has(key)) {
      uniqueEdges.set(key, {
        from: edge.from,
        to: edge.to,
        bidirectional: edge.bidirectional !== false,
        weightMeters: edge.weightMeters,
      });
    }
  });

  return {
    version: 1,
    nodes: Array.from(nodeMap.values()).map(({ isVirtual: _isVirtual, ...node }) => node),
    edges: Array.from(uniqueEdges.values()),
  };
}

export function parseCampusRouteGraph(raw: unknown): CampusRouteGraph {
  if (!raw || typeof raw !== "object") return EMPTY_CAMPUS_ROUTE_GRAPH;
  const candidate = raw as Partial<CampusRouteGraph>;
  if (candidate.version !== 1) return EMPTY_CAMPUS_ROUTE_GRAPH;
  const nodes = Array.isArray(candidate.nodes)
    ? candidate.nodes.filter(isRouteNode)
    : [];
  const edges = Array.isArray(candidate.edges)
    ? candidate.edges.filter(isRouteEdge)
    : [];
  return normalizeGraph({ version: 1, nodes, edges });
}

export function loadCampusRouteGraph(): CampusRouteGraph {
  if (typeof window === "undefined") return EMPTY_CAMPUS_ROUTE_GRAPH;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return EMPTY_CAMPUS_ROUTE_GRAPH;
    return parseCampusRouteGraph(JSON.parse(stored));
  } catch {
    return EMPTY_CAMPUS_ROUTE_GRAPH;
  }
}

export function saveCampusRouteGraph(graph: CampusRouteGraph) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeGraph(graph)));
}

export function clearCampusRouteGraph() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function exportCampusRouteGraph(graph: CampusRouteGraph) {
  return JSON.stringify(normalizeGraph(graph), null, 2);
}

export function importCampusRouteGraph(rawText: string) {
  return parseCampusRouteGraph(JSON.parse(rawText));
}

export function createRouteNode(
  lat: number,
  lng: number,
  label?: string,
): RouteNode {
  const id = `node_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
  return {
    id,
    lat,
    lng,
    label: label?.trim() || undefined,
  };
}

export function haversineMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const aTerm =
    sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.min(1, Math.sqrt(aTerm)));
}

function toLocalMeters(
  point: { lat: number; lng: number },
  origin: { lat: number; lng: number },
): LocalPoint {
  const originLatRad = (origin.lat * Math.PI) / 180;
  const latRad = (point.lat * Math.PI) / 180;
  const lngRad = (point.lng * Math.PI) / 180;
  const originLngRad = (origin.lng * Math.PI) / 180;

  return {
    x: EARTH_RADIUS_METERS * (lngRad - originLngRad) * Math.cos(originLatRad),
    y: EARTH_RADIUS_METERS * (latRad - (origin.lat * Math.PI) / 180),
  };
}

function fromLocalMeters(
  point: LocalPoint,
  origin: { lat: number; lng: number },
): { lat: number; lng: number } {
  const originLatRad = (origin.lat * Math.PI) / 180;
  const originLngRad = (origin.lng * Math.PI) / 180;

  return {
    lat: origin.lat + (point.y / EARTH_RADIUS_METERS) * (180 / Math.PI),
    lng:
      origin.lng +
      (point.x / (EARTH_RADIUS_METERS * Math.cos(originLatRad))) * (180 / Math.PI),
  };
}

function segmentLengthMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  return haversineMeters(a, b);
}

function projectPointToSegment(
  point: { lat: number; lng: number },
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const origin = {
    lat: (point.lat + a.lat + b.lat) / 3,
    lng: (point.lng + a.lng + b.lng) / 3,
  };
  const pointLocal = toLocalMeters(point, origin);
  const aLocal = toLocalMeters(a, origin);
  const bLocal = toLocalMeters(b, origin);

  const ab = {
    x: bLocal.x - aLocal.x,
    y: bLocal.y - aLocal.y,
  };
  const ap = {
    x: pointLocal.x - aLocal.x,
    y: pointLocal.y - aLocal.y,
  };
  const abLengthSquared = ab.x * ab.x + ab.y * ab.y;
  const rawT =
    abLengthSquared === 0
      ? 0
      : (ap.x * ab.x + ap.y * ab.y) / abLengthSquared;
  const t = Math.max(0, Math.min(1, rawT));
  const projectedLocal = {
    x: aLocal.x + ab.x * t,
    y: aLocal.y + ab.y * t,
  };
  const deltaX = pointLocal.x - projectedLocal.x;
  const deltaY = pointLocal.y - projectedLocal.y;
  const distanceMeters = Math.hypot(deltaX, deltaY);

  return {
    point: fromLocalMeters(projectedLocal, origin),
    distanceMeters,
    t,
    segmentLengthMeters: Math.sqrt(abLengthSquared),
  };
}

function buildAdjacency(graph: CampusRouteGraph): GraphAdjacency {
  const adjacency = new Map<string, Array<{ to: string; weight: number }>>();

  graph.nodes.forEach((node) => adjacency.set(node.id, []));

  const nodeMap = new Map(graph.nodes.map((node) => [node.id, node]));
  graph.edges.forEach((edge) => {
    const fromNode = nodeMap.get(edge.from);
    const toNode = nodeMap.get(edge.to);
    if (!fromNode || !toNode) return;

    const weight = edge.weightMeters ?? segmentLengthMeters(fromNode, toNode);
    adjacency.get(edge.from)?.push({ to: edge.to, weight });

    if (edge.bidirectional !== false) {
      adjacency.get(edge.to)?.push({ to: edge.from, weight });
    }
  });

  return adjacency;
}

export function findNearestRouteNode(
  graph: CampusRouteGraph,
  point: { lat: number; lng: number },
) {
  let nearest: RouteNode | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  graph.nodes.forEach((node) => {
    const distance = haversineMeters(point, node);
    if (distance < nearestDistance) {
      nearest = node;
      nearestDistance = distance;
    }
  });

  return nearest ? { node: nearest, distanceMeters: nearestDistance } : null;
}

export function findNearestRoutePointOnEdge(
  graph: CampusRouteGraph,
  point: { lat: number; lng: number },
): SnappedPoint | null {
  if (graph.edges.length === 0) return null;

  const nodeMap = new Map(graph.nodes.map((node) => [node.id, node]));
  let best: SnappedPoint | null = null;

  graph.edges.forEach((edge, edgeIndex) => {
    const fromNode = nodeMap.get(edge.from);
    const toNode = nodeMap.get(edge.to);
    if (!fromNode || !toNode) return;

    const projection = projectPointToSegment(point, fromNode, toNode);
    if (!best || projection.distanceMeters < best.distanceMeters) {
      best = {
        edgeIndex,
        point: [projection.point.lat, projection.point.lng],
        t: projection.t,
        distanceMeters: projection.distanceMeters,
      };
    }
  });

  return best;
}

function createVirtualNodeId(kind: "start" | "end", edgeIndex: number) {
  return `virtual_${kind}_${edgeIndex}_${Math.random().toString(16).slice(2, 8)}`;
}

function addDirectedEdge(
  adjacency: GraphAdjacency,
  from: string,
  to: string,
  weight: number,
) {
  if (!Number.isFinite(weight) || weight < 0) return;
  if (!adjacency.has(from)) adjacency.set(from, []);
  if (!adjacency.has(to)) adjacency.set(to, []);
  adjacency.get(from)?.push({ to, weight });
}

function isValidLatLng(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number" &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1])
  );
}

export function computeCampusRoute(
  graph: CampusRouteGraph,
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
): CampusRouteResult | null {
  if (graph.nodes.length < 2 || graph.edges.length === 0) return null;

  const startSnap = findNearestRoutePointOnEdge(graph, start);
  const endSnap = findNearestRoutePointOnEdge(graph, end);
  if (!startSnap || !endSnap) return null;

  if (haversineMeters(startSnap.point, endSnap.point) < 0.5) {
    const snappedNode: RouteNode = {
      id: "snap_same_point",
      lat: startSnap.point[0],
      lng: startSnap.point[1],
    };
    return {
      path: [startSnap.point],
      nodeIds: [snappedNode.id],
      distanceMeters: 0,
      durationSeconds: 0,
      startNode: snappedNode,
      endNode: snappedNode,
    };
  }

  const nodeMap: GraphNodeMap = new Map(
    graph.nodes.map((node) => [node.id, { ...node }]),
  );
  const adjacency = buildAdjacency(graph);
  const splitPointsByEdge = new Map<
    number,
    Array<{
      nodeId: string;
      t: number;
      point: [number, number];
    }>
  >();
  const snapNodes = new Map<string, RouteNodeLike>();

  const registerSnapPoint = (kind: "start" | "end", snap: SnappedPoint) => {
    const edge = graph.edges[snap.edgeIndex];
    const fromNode = nodeMap.get(edge.from);
    const toNode = nodeMap.get(edge.to);
    if (!fromNode || !toNode) return edge.from;

    const t = Math.max(0, Math.min(1, snap.t));
    let nodeId = edge.from;
    if (t <= EPSILON) {
      nodeId = edge.from;
    } else if (t >= 1 - EPSILON) {
      nodeId = edge.to;
    } else {
      nodeId = createVirtualNodeId(kind, snap.edgeIndex);
      if (!nodeMap.has(nodeId)) {
        nodeMap.set(nodeId, {
          id: nodeId,
          lat: snap.point[0],
          lng: snap.point[1],
          label: `${kind === "start" ? "Start" : "End"} snap`,
          isVirtual: true,
        });
      }
      const existing = splitPointsByEdge.get(snap.edgeIndex) ?? [];
      existing.push({ nodeId, t, point: snap.point });
      splitPointsByEdge.set(snap.edgeIndex, existing);
    }

    snapNodes.set(kind, {
      id: nodeId,
      lat: snap.point[0],
      lng: snap.point[1],
      label:
        nodeId === edge.from
          ? fromNode.label
          : nodeId === edge.to
            ? toNode.label
            : `${kind === "start" ? "Start" : "End"} snap`,
      isVirtual: nodeId !== edge.from && nodeId !== edge.to,
    });

    return nodeId;
  };

  const startId = registerSnapPoint("start", startSnap);
  const endId = registerSnapPoint("end", endSnap);

  graph.edges.forEach((edge, edgeIndex) => {
    const fromNode = nodeMap.get(edge.from);
    const toNode = nodeMap.get(edge.to);
    if (!fromNode || !toNode) return;

    const edgeLength = edge.weightMeters ?? segmentLengthMeters(fromNode, toNode);
    const splits = (splitPointsByEdge.get(edgeIndex) ?? []).sort((a, b) => a.t - b.t);

    let currentId = edge.from;
    let currentT = 0;

    for (const split of splits) {
      const segmentWeight = edgeLength * Math.max(0, split.t - currentT);
      if (split.nodeId !== currentId && segmentWeight > 0) {
        addDirectedEdge(adjacency, currentId, split.nodeId, segmentWeight);
        if (edge.bidirectional !== false) {
          addDirectedEdge(adjacency, split.nodeId, currentId, segmentWeight);
        }
      }
      currentId = split.nodeId;
      currentT = split.t;
    }

    const finalWeight = edgeLength * Math.max(0, 1 - currentT);
    if (edge.to !== currentId && finalWeight > 0) {
      addDirectedEdge(adjacency, currentId, edge.to, finalWeight);
      if (edge.bidirectional !== false) {
        addDirectedEdge(adjacency, edge.to, currentId, finalWeight);
      }
    }
  });

  const allNodeIds = new Set<string>([
    ...graph.nodes.map((node) => node.id),
    ...Array.from(nodeMap.keys()),
  ]);
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set<string>();

  allNodeIds.forEach((id) => {
    distances.set(id, Number.POSITIVE_INFINITY);
    previous.set(id, null);
    unvisited.add(id);
  });
  distances.set(startId, 0);

  while (unvisited.size > 0) {
    let currentId: string | null = null;
    let currentDistance = Number.POSITIVE_INFINITY;

    for (const candidateId of unvisited) {
      const candidateDistance = distances.get(candidateId) ?? Number.POSITIVE_INFINITY;
      if (candidateDistance < currentDistance) {
        currentDistance = candidateDistance;
        currentId = candidateId;
      }
    }

    if (currentId === null || currentDistance === Number.POSITIVE_INFINITY) {
      break;
    }

    unvisited.delete(currentId);

    if (currentId === endId) {
      break;
    }

    const neighbors = adjacency.get(currentId) ?? [];
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.to)) continue;
      const nextDistance = currentDistance + neighbor.weight;
      if (nextDistance < (distances.get(neighbor.to) ?? Number.POSITIVE_INFINITY)) {
        distances.set(neighbor.to, nextDistance);
        previous.set(neighbor.to, currentId);
      }
    }
  }

  const totalDistance = distances.get(endId) ?? Number.POSITIVE_INFINITY;
  if (totalDistance === Number.POSITIVE_INFINITY) return null;

  const nodeIds: string[] = [];
  for (let cursor: string | null = endId; cursor; cursor = previous.get(cursor) ?? null) {
    nodeIds.push(cursor);
  }
  nodeIds.reverse();

  const path = nodeIds
    .map((nodeId) => nodeMap.get(nodeId))
    .filter((node): node is RouteNodeLike => Boolean(node))
    .map((node) => [node.lat, node.lng] as [number, number]);

  if (!path.every(isValidLatLng)) return null;

  const startNode = snapNodes.get("start") ?? nodeMap.get(startId);
  const endNode = snapNodes.get("end") ?? nodeMap.get(endId);

  if (!startNode || !endNode) return null;

  return {
    path,
    nodeIds,
    distanceMeters: totalDistance,
    durationSeconds: totalDistance / 1.2,
    startNode,
    endNode,
  };
}
