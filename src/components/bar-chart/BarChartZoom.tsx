import React, { useRef, useEffect } from "react"
import * as d3 from "d3"

type DataPoint = {
  category: string
  value: number
}

type BarChartProps = {
  data: DataPoint[]
  width: number
  height: number
}

const BarChart: React.FC<BarChartProps> = ({ data, width, height }) => {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove() // Clear existing content

    // Set up margins and dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 40 }
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([0, chartWidth])
      .padding(0.2)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .nice()
      .range([chartHeight, 0])

    // Append group element for chart content
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Add X axis
    // g.append("g")
    //   .attr("transform", `translate(0,${chartHeight})`)
    //   .call(d3.axisBottom(xScale).tickValues(xScale.domain().filter((_, i) => i % 8 === 0)))
    //   .selectAll("text")
    //   .attr("transform", "rotate(-45)")
    //   .style("text-anchor", "end")

    // Add Y axis
    g.append("g").call(d3.axisLeft(yScale))

    // Add bars
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.category) || 0)
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => chartHeight - yScale(d.value))
      .attr("fill", "steelblue")
  }, [data, width, height])

  return <svg ref={svgRef} width={width} height={height}></svg>
}

export default BarChart
