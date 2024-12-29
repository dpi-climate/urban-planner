import React, { useRef, useEffect } from "react"
import * as d3 from "d3"

type DataPoint = {
  year: string
  value: number
}

type LineChartProps = {
  data: DataPoint[]
  width: number
  height: number
  xAxisLabel: string
  yAxisLabel: string
}

const LineChart: React.FC<LineChartProps> = ({ data, width, height, xAxisLabel, yAxisLabel }) => {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 20, right: 30, bottom: 50, left: 50 }
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    const xScale = d3
      .scalePoint()
      .domain(data.map((d) => d.year))
      .range([0, chartWidth])
      .padding(0.5)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .range([chartHeight, 0])

    const line = d3
      .line<DataPoint>()
      .x((d) => xScale(d.year) || 0)
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX)

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Add X axis
    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale))

    // Add X axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height - 10) // Adjust based on margin.bottom
      .text(xAxisLabel)
      .style("font-size", "12px")
      .style("fill", "#000")

    // Add Y axis
    g.append("g").call(d3.axisLeft(yScale))

    // Add Y axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90)`)
      .attr("x", -(height / 2))
      .attr("y", 15) // Adjust based on margin.left
      .text(yAxisLabel)
      .style("font-size", "12px")
      .style("fill", "#000")

    // Add line path
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line)
  }, [data, width, height, xAxisLabel, yAxisLabel])

  return <svg ref={svgRef} width={width} height={height}></svg>
}

export default LineChart
