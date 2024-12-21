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
}

const LineChart: React.FC<LineChartProps> = ({ data, width, height }) => {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove() // Clear existing content

    // Set up margins and dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 40 }
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    // Create scales
    const xScale = d3
      .scalePoint()
      .domain(data.map((d) => d.year))
      .range([0, chartWidth])
      .padding(0.5)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .range([chartHeight, 0])

    // Create line generator
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

    // Add Y axis
    g.append("g").call(d3.axisLeft(yScale))

    // Add line path
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line)
  }, [data, width, height])

  return <svg ref={svgRef} width={width} height={height}></svg>
}

export default LineChart
