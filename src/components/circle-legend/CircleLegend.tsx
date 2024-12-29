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
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const itemHeight = 20 // Height for each legend item
    const circleRadius = 3

    const legendGroup = svg
      .append("g")
      .attr("transform", `translate(10, 10)`) // Add some padding

    items.forEach((item, index) => {
      const group = legendGroup
        .append("g")
        .attr("transform", `translate(0, ${index * itemHeight})`)

      group
        .append("circle")
        .attr("r", circleRadius)
        .attr("fill", item.color)
        .attr("cx", circleRadius)
        .attr("cy", circleRadius)

      // Add text label
      group
        .append("text")
        .text(item.label)
        .attr("x", circleRadius * 2 + 10) // Offset from the circle
        .attr("y", circleRadius + 5) // Center text vertically
        .attr("alignment-baseline", "middle")
        .style("font-size", "14px")
        .style("fill", "#000")
    })
  }, [items])

  return <svg ref={svgRef} width={width} height={height}></svg>
};

export default CircleLegend
