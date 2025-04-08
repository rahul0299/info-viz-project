import { useEffect, useRef } from "react";
import * as d3 from "d3";
import ReactDOM from "react-dom/client";
import DonutChart from "./DonutChart";

const SolverBubbleChart = ({ data, width, height }) => {
    const svgRef = useRef();
    const tooltipDivRef = useRef();
    const tooltipRootRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // Create React root once
        if (!tooltipRootRef.current && tooltipDivRef.current) {
            tooltipRootRef.current = ReactDOM.createRoot(tooltipDivRef.current);
        }

        const root = d3
            .pack()
            .size([width, height])
            .padding(6)(
                d3.hierarchy({ children: data }).sum((d) => d.value)
            );

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const nodes = svg
            .append("g")
            .selectAll("circle")
            .data(root.leaves())
            .join("circle")
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("r", 0)
            .attr("fill", (d) => color(d.data.tokenPair))
            .style("cursor", "pointer")
            .on("mouseover", (event, d) => {
                const tooltip = d3.select(tooltipDivRef.current);

                // Get chart container's position relative to the page
                const containerRect = svgRef.current.getBoundingClientRect();

                // Get mouse position relative to the container
                const x = event.clientX - containerRect.left;
                const y = event.clientY - containerRect.top;

                tooltip
                    .style("left", `${x + 10}px`)
                    .style("top", `${y - 10}px`)
                    .style("display", "block");


                tooltipRootRef.current?.render(
                    <div
                        style={{
                            background: "#fff",
                            border: "1px solid #ccc",
                            padding: 10,
                            borderRadius: 4,
                            fontSize: 12,
                            fontFamily: "Roboto",
                        }}
                    >
                        <div style={{ marginBottom: 8 }}>
                            <strong>{d.data.tokenPair}</strong>
                            <br />
                            {Math.round(d.data.value).toLocaleString()} USD
                        </div>
                        <DonutChart binCounts={d.data.binCounts} />
                    </div>
                );
            })
            .on("mouseout", () => {
                d3.select(tooltipDivRef.current).style("display", "none");
            });

        const text = svg
            .append("g")
            .selectAll("text")
            .data(root.leaves())
            .join("text")
            .attr("x", (d) => d.x)
            .attr("y", (d) => d.y)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "10px")
            .style("pointer-events", "none")
            .style("font-family", "Roboto")
            .text((d) => {
                const label = d.data.tokenPair;
                const radius = d.r;
                const approxCharWidth = 5; // adjust for your font
                const fits = label.length * approxCharWidth < radius * 2;
                return fits ? label : "";
            });


        nodes.transition().duration(600).attr("r", (d) => d.r);
    }, [data, height, width]);

    return (
        <div style={{ position: "relative" }}>
            <svg ref={svgRef} width={width} height={height} />
            <div
                ref={tooltipDivRef}
                style={{
                    position: "absolute",
                    display: "none",
                    pointerEvents: "none",
                    zIndex: 10,
                    overflow: "visible !important"
                }}
            />
        </div>
    );
};

export default SolverBubbleChart;
