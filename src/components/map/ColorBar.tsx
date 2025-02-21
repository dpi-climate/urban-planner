import React, { useRef, useEffect, useCallback, useState } from "react"
import * as d3 from "d3"

interface IColorBar {
  colorScheme: any
  legId: any
  domain: any
  label: any
}

interface GradientStop {
  offset: string
  color: string
}


const ColorBar: React.FC<IColorBar> = (props) => {
  const margin = { top: 10, bottom: 10, left: 10, right: 10 }
  let direction = "h"

  const width   = direction === 'v' ? 50                               : 250 - margin.left - margin.right
  const height  = direction === 'v' ? 200 - margin.top - margin.bottom : 80  - margin.top - margin.bottom

  const width_leg   = direction === 'v' ? 15  : 155
  const height_leg  = direction === 'v' ? 100 : height/3

  const padding_unit = direction === 'v' ? 5 : 15

  const x0 = direction === 'v' ? 10 + margin.left : margin.left
  const y0 = direction === 'v' ? margin.top : height_leg

  // const y0_unit = direction === 'v' ? 3*(height - height_leg)/4 : y0 + padding_unit
  const y0_unit = direction === 'v' ? 0 : y0 + padding_unit
  const x0_unit = direction === 'v' ? width_leg + padding_unit : 0

  const x0_leg = 0
  const y0_leg = direction === 'v' ? margin.top : 0

  
  const mapRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const axisGroupRef = useRef<SVGSVGElement | null>(null)
  const linearGradientRef = useRef<SVGLinearGradientElement>(null)
  
  
  const [legId, setLegId] = useState(props.legId)
  const [xScale, setXScale] = useState<d3.ScaleLinear<number, number, never>>()
  const [yScale, setYScale] = useState<d3.ScaleLinear<number, number, never>>()

  
  const xScaleRef = useRef(xScale)
  const yScaleRef = useRef(yScale)
  
  const init = useCallback(() => {
    if(!linearGradientRef.current) return 

    // set xScale
    // xScaleRef.current =d3.scaleLinear().range([0, width_leg])
    xScaleRef.current =d3.scaleLinear().range([0, width_leg])
    setXScale(xScaleRef.current)

    // set yScale
    yScaleRef.current = d3.scaleLinear().range([height_leg+y0, y0])
    setYScale(yScaleRef.current)


  }, [legId, direction, width_leg, height_leg, y0])

  const update = useCallback(() => {
    if(!svgRef.current  || !linearGradientRef.current || !axisGroupRef.current || !yScaleRef.current || !xScaleRef.current) return 

    const svg = d3.select(svgRef.current)
    const axisGroup = d3.select(axisGroupRef.current)

    const updateAxis = () => {
      const calculateTickIndices = (length: number, numberOfTicks: number): number[] => {
        if (length === 0) return [];
    
        const step = (length - 1) / (numberOfTicks - 1);
        const tickIndices: number[] = [];
    
        for (let i = 0; i < numberOfTicks; i++) {
          tickIndices.push(Math.round(i * step));
        }
    
        // Ensure the last index is included
        if (tickIndices[tickIndices.length - 1] !== length - 1) {
          tickIndices[tickIndices.length - 1] = length - 1;
        }
    
        // Remove any duplicate indices (in case of rounding)
        return Array.from(new Set(tickIndices));
      };

      if(!svgRef.current  || !linearGradientRef.current || !axisGroupRef.current || !yScaleRef.current || !xScaleRef.current) return 

      let axis = null
      const numTicks = 5

      xScaleRef.current.domain(props.domain)
      // let values = xScaleRef.current.ticks(numTicks)//.concat([props.domain[0], props.domain[props.domain.length - 1]]);
      // values = [...new Set(values)];
      
      // axis = d3.axisTop(xScaleRef.current)
        // .tickValues(values)
      
      
      axis = d3.axisTop(xScaleRef.current)


      // if(props.domain.length == 2) {
        xScaleRef.current.domain(props.domain)
        let values = xScaleRef.current.ticks(numTicks)//.concat([props.domain[0], props.domain[props.domain.length - 1]]);
        values = [...new Set(values)];
        
        axis = d3.axisTop(xScaleRef.current)
          .tickValues(values)

      // } else {
      //   xScaleRef.current.domain([0, props.domain.length - 1])
        
      //   let values = calculateTickIndices(props.domain.length, numTicks)

      //   axis = d3.axisTop(xScaleRef.current)
      //     .tickValues(values)
      //     .tickFormat((i: any) => props.domain[i as number])

      // }


      axisGroup.call(axis)
    }

    const addColors = () => {
      // Ensure linearGradientRef.current is not null before proceeding
      if (!linearGradientRef.current) {
        return;
      }

      let colorScale: d3.ScaleLinear<string, string> | null = null;
    
      if (typeof props.colorScheme === "string") {
        const colorInterpolator = d3[props.colorScheme as keyof typeof d3] as (t: number) => string;
        colorScale = d3.scaleLinear<string, string>()
          .domain(props.domain)
          .range(["0", "1"]);
    
        const data: GradientStop[] = colorScale.ticks().map((t, i, n) => ({
          offset: `${100 * (i / (n.length - 1))}%`,
          color: colorInterpolator(colorScale(t) as number),
        }));
    
        // Use optional chaining to handle null references safely
        const color = d3.select(linearGradientRef.current)
          ?.selectAll(`#stop-${legId}`)
          .data(data);
    
        color?.exit().remove();
    
        color
          ?.attr("offset", (d: GradientStop) => d.offset)
          ?.attr("stop-color", (d: GradientStop) => d.color);
    
        color?.enter()
          .append("stop")
          .attr("id", `stop-${legId}`)
          .attr("offset", (d: GradientStop) => d.offset)
          .attr("stop-color", (d: GradientStop) => d.color)
          .attr("stop-opacity", 1);
      } else if (Array.isArray(props.colorScheme[0])) {
        const rgbStrings = props.colorScheme.map(
          ([r, g, b]: [number, number, number]) => `rgb(${r},${g},${b})`
        );

        colorScale = d3.scaleLinear<string, string>()
          .domain(props.domain)
          .range(rgbStrings);
    
        const data: GradientStop[] = rgbStrings.map((c, i) => ({
          offset: `${100 * (i / (rgbStrings.length - 1))}%`,
          color: c,
        }))

        const color = d3.select(linearGradientRef.current)
          ?.selectAll(`#stop-${legId}`)
          .data(data);
    
        color?.exit().remove();
    
        color
          ?.attr("offset", (d: GradientStop) => d.offset)
          ?.attr("stop-color", (d: GradientStop) => d.color);
    
        color?.enter()
          .append("stop")
          .attr("id", `stop-${legId}`)
          .attr("offset", (d: GradientStop) => d.offset)
          .attr("stop-color", (d: GradientStop) => d.color)
          .attr("stop-opacity", 1);
          
      } else {

        colorScale = d3.scaleLinear<string, string>()
          .domain(props.domain)
          .range(props.colorScheme);
    
        const data: GradientStop[] = props.colorScheme.map((c, i) => ({
          offset: `${100 * (i / (props.colorScheme.length - 1))}%`,
          color: c,
        }))
    
        const color = d3.select(linearGradientRef.current)
          ?.selectAll(`#stop-${legId}`)
          .data(data);
    
        color?.exit().remove();
    
        color
          ?.attr("offset", (d: GradientStop) => d.offset)
          ?.attr("stop-color", (d: GradientStop) => d.color);
    
        color?.enter()
          .append("stop")
          .attr("id", `stop-${legId}`)
          .attr("offset", (d: GradientStop) => d.offset)
          .attr("stop-color", (d: GradientStop) => d.color)
          .attr("stop-opacity", 1);
      }
    };

    const updateRect = () => {

      const rect = svg.selectAll(`#legend-rect-${legId}`)
          .data(["myRect"])

      rect.exit().remove()

      rect.attr('x', x0_leg)
        .attr('y', y0_leg)
        .attr('width', width_leg)
        .attr('height', height_leg)
        .attr('fill', `url(#linear-gradient-${legId})`)
        .style("stroke", 'grey')

      rect.enter().append('rect')
        .attr('class', 'legend-rect')
        .attr('id', `legend-rect-${legId}`)
        .attr('x', x0_leg)
        .attr('y', y0_leg)
        .attr('width', width_leg)
        .attr('height', height_leg)
        .attr('fill', `url(#linear-gradient-${legId})`)
        .style("stroke", 'grey')
    }

    const updateLabel = () => {

      const rotate = direction === "v" 
        ? "translate(" + x0_unit + "," + y0_unit + ") rotate(90) translate(" + (-x0_unit) + "," + (-y0_unit) + ")"
        : ""
      
      const _unit = svg.selectAll(`#legend-unit-${legId}`)
        .data(['myRect'])

      _unit.exit().remove()

      _unit.text(`${props.label}`)
        .attr("transform", rotate)
        
      _unit.enter().append('text')
        .attr('class', 'legend-unit')
        .attr('id', `legend-unit-${legId}`)
        .attr('x', x0_unit)
        .attr('y', y0_unit)
        .attr('text-anchor', 'start')
        .attr('font-size', 14)
        .text(`${props.label}`)
    }

    updateAxis()
    addColors()
    updateRect()
    updateLabel()

  }, [props.domain, props.colorScheme, props.label, legId, direction])

  useEffect(() => { setLegId(props.legId) }, [props.legId])
  useEffect(() => { init() }, [init])
  useEffect(() => { update() }, [update])


  return (
    <div className="map-legend" ref={mapRef}>
      <svg className="map-legend-svg"          id={`map-legend-svg-${legId}`} width={width} height={height}>
      {/* <svg className="map-legend-svg"          id={`map-legend-svg-${legId}`} height={height}> */}
        <g className="map-legend-svg-group"    id={`map-legend-svg-group-${legId}`} transform={`translate (${x0}, ${y0})`} ref={svgRef}>
          <g className="map-legend-axis-group" id={`map-legend-axis-group-${legId}`} ref={axisGroupRef}></g>
          <defs>
            <linearGradient id={`linear-gradient-${legId}`} ref={linearGradientRef}></linearGradient>
          </defs>
        </g>
      </svg>
    </div>
  )
}

export default ColorBar