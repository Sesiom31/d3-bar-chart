import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import Tooltip from './Tooltip';

const url =
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const w = 900;
const h = 480;
const p_t = 10;
const p_l = 60;
const p_r = 20;
const p_b = 40;

function BarrasSvg() {
  const [data, setData] = useState([]);
  const [tooltipIsActive, setTooltipIsActive] = useState(false);
  const [dateTooltip, setDateTooltip] = useState({ date: '', gpm: 0, positionX: 0 });
  const gxRef = useRef();
  const gyRef = useRef();
  const svgRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(url);
      const data = await response.json();
      setData(data.data);
    };

    fetchData();
  }, []);

  const scaleX = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => new Date(d[0])))
    .range([p_l, w - p_r]);

  const scaleY = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[1])])
    .range([h - p_b, p_t]);

  useEffect(() => {
    d3.select(gxRef.current).call(d3.axisBottom(scaleX));
  }, [data, scaleX]);

  useEffect(() => {
    d3.select(gyRef.current).call(d3.axisLeft(scaleY));
  }, [data, scaleY]);

  useEffect(() => {
    d3.select(svgRef.current)
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('data-date', (d) => d[0])
      .attr('data-gdp', (d) => d[1])
      .attr('x', (d) => scaleX(new Date(d[0])))
      .attr('y', (d) => scaleY(d[1]))
      .attr('width', 3)
      .attr('height', (d) => h - p_b - scaleY(d[1]))
      .attr('fill', 'steelblue')
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).attr('fill', '#fff');
        setDateTooltip({
          date: d[0],
          gpm: d[1],
          positionX: event.pageX - window.innerWidth / 2 - 260,
        });
        setTooltipIsActive(true);
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget).attr('fill', 'steelblue');
        setTooltipIsActive(false);
      });
  }, [data, scaleX, scaleY]);

  return (
    <div className="container-svg">
      <svg ref={svgRef} width={w} height={h}>
        <g ref={gxRef} id="x-axis" transform={`translate(0, ${h - p_b})`}></g>
        <g ref={gyRef} id="y-axis" transform={`translate(${p_l},0)`}></g>
        <text
          x={-h / 2 + 100}
          y={p_l + 25}
          transform="rotate(270 50,50)"
          style={{ fontSize: '1.2rem' }}
        >
          Gross domestic Product
        </text>
        <text x={w / 2 + 50} y={h - 5} style={{ fontSize: '0.9rem' }}>
          More Information: http://www.bea.gov/national/pdf/nipaguid.pdf
        </text>
      </svg>
      <Tooltip dateTooltip={dateTooltip} tooltipIsActive={tooltipIsActive} />
    </div>
  );
}

export default BarrasSvg;
