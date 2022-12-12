import { useRef, useEffect, MutableRefObject } from "react";
import { Map, NavigationControl } from "maplibre-gl";
import styled from "@emotion/styled";

interface GeoMapProps {
  title: string;
  points: Array<any>;
  className?: string;
}

export default styled(({ title, points = [], className }: GeoMapProps) => {
  const ref = useRef() as MutableRefObject<HTMLInputElement>;
  useEffect(() => {
    const map = new Map({
      container: ref.current,
      style:
        "https://api.maptiler.com/maps/streets-v2/style.json?key=YblZ3tgjBpgmj3jBc1gl",
      antialias: true,
      zoom: 1,
    });
    const data = {
      type: "FeatureCollection",
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
      },
      features: points.map(({ latitude, longitude, name }) => ({
        type: "Feature",
        properties: {
          description: name,
        },
        geometry: { type: "Point", coordinates: [longitude, latitude] },
      })),
    };

    map.on("load", () => {
      map.addSource("source1", {
        type: "geojson",
        data,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
        clusterProperties: {
          description: ["concat", ["concat", ["get", "description"], ","]],
        },
      });
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "source1",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#67BDFA",
            100,
            "#0ebbc1",
            750,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "source1",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 12,
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "source1",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      map.addControl(new NavigationControl({}));
      map.scrollZoom.disable();
    });
  }, [JSON.stringify(points)]);
  return (
    <div className={className}>
      {title && <div className="title">{title}</div>}
      <div ref={ref}></div>
    </div>
  );
})`
  aspect-ratio: 1;
  display: flex;
  gap: calc(var(--gap) * 0.75);
  flex-direction: column;
  border-radius: var(--radius);
  overflow: hidden;

  .title {
    font-size: 1.6rem;
    line-height: 1.6rem;
    color: var(--grey2);
    font-weight: 500;
  }

  & > div:last-of-type {
    flex: 1;
    border-radius: var(--radius);
    overflow: hidden;
  }
`;
