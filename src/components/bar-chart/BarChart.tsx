import React, { useRef, useEffect } from "react"
import * as d3 from "d3"

type DataPoint = {
  year: string
  value: number
}

type BarChartProps = {
  data: DataPoint[]
  width: number
  height: number
  xAxisLabel: string
  yAxisLabel: string
}

const BarChart: React.FC<BarChartProps> = ({
  items,
  data,
  width,
  height,
  xAxisLabel,
  yAxisLabel,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Clear old content
    d3.select(svgRef.current).selectAll("*").remove()

    // Redefine svg to avoid confusion
    const svgContainer = d3.select(svgRef.current)

    const margin = { top: 10, right: 10, bottom: 10, left: 10 }
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    // xScale
    const xScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([0, chartWidth])
      .nice()

    // // yScale: discrete categories (years)
    // const yScale = d3
    //   .scaleBand()
    //   .domain(data.map((d) => d.year))
    //   .range([0, chartHeight])
    //   .padding(0.2)

    const colorScale = d3
      .scaleOrdinal(items.map(d => d.color))
      .domain(items.map((d) => d.nYears))
    

    // Main group for chart content
    const g = svgContainer
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${chartHeight - 50})`)
      .style("user-select", "none")
      .call(d3.axisBottom(xScale))

    // X axis label
    svgContainer
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", margin.left + chartWidth / 2)
      .attr("y", chartHeight )
      .text(xAxisLabel)
      .style("font-size", "18px")
      .style("fill", "#000")
      .style("user-select", "none")

    // Y axis label
    svgContainer
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .text(yAxisLabel)
      .style("font-size", "12px")
      .style("fill", "#000")

    // Bars
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 0)
      .attr("x", 0)
      .attr("height", chartHeight - 50)
      .attr("width", (d) => xScale(d.value))
      .attr("fill", (d) => (colorScale(d.year) as string) || "steelblue")
      .attr("cursor", "help")
      .append("title") // Native tooltip
        .text((d) => `Year: ${d.year}\nValue: ${d.value}%`)

  }, [data, width, height, xAxisLabel, yAxisLabel])

  return <svg ref={svgRef} width={width} height={height}></svg>
}

export default BarChart

