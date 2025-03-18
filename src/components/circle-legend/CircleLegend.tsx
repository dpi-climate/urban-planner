import React, { useRef, useEffect } from "react"
import * as d3 from "d3"

type CircleLegendItem = {
  label: string
  color: string
};

type CircleLegendProps = {
  items: CircleLegendItem[]
  width: number
  height: number
};


const CircleLegend: React.FC<CircleLegendProps> = ({ items, width, height }) => {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!svgRef.current) return;
  
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove();
  
    // const colorScale = d3
    //   // .scaleOrdinal(d3.schemeTableau10)
    //   .domain(items.map((d) => d.nYears))
  
    const itemHeight = 20
    const legendItemSize = 14
    const legendSpacing = 4
  
    const legendGroup = svg
      .append("g")
      .attr("transform", `translate(10, 10)`)
  
    items.forEach((item, index) => {
      const group = legendGroup
        .append("g")
        .attr("transform", `translate(0, ${index * itemHeight})`)
  
      const rect = group
        .append("rect")
        .attr("width", legendItemSize)
        .attr("height", legendItemSize)
        // .attr("fill", () => (colorScale(item.nYears) as string) || "steelblue")
        .attr("fill", () => (item.color as string) || "steelblue")
        .attr("cursor", "help")
        .style("stroke", "#000")
        .style("stroke-width", 0.5);
  
      rect.append("title").text(item.label)
  
      group
        .append("text")
        .attr("x", legendItemSize + legendSpacing)
        .attr("y", legendItemSize / 1.3) // vertical center
        .style("font-size", "14px")
        .style("fill", "#000")
        .text(`${item.nYears} years`)
        .style("user-select", "none")
    });
  }, [items])

  return <svg ref={svgRef} width={width} height={height}></svg>
};

export default CircleLegend
