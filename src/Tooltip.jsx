import PropTypes from 'prop-types';

function Tooltip({ dateTooltip: { positionX, date, gpm }, tooltipIsActive }) {
  const [year, trimestre] = formatDate(date);


  const yearString = year.toString();
  const trimestreString = trimestre !== 0 ? trimestre.toString() : '';

  return (
    <div
      className="tooltip"
      id="tooltip"
      data-date={date}
      style={{
        transform: `translate(${positionX}px, 0)`,
        display: tooltipIsActive && 'block',
      }}
    >
      <p style={{ textAlign: 'center', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
        <span>{yearString}</span> Q<span>{trimestreString}</span>
      </p>

      <p style={{ textAlign: 'center', fontSize: '1rem' }}>${gpm.toLocaleString('en')} Billions</p>
    </div>
  );
}

Tooltip.propTypes = {
  dateTooltip: PropTypes.shape({
    positionX: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    gpm: PropTypes.number.isRequired,
  }),
  tooltipIsActive: PropTypes.bool.isRequired,
};

export default Tooltip;

function formatDate(date) {
  const year = new Date(date).getFullYear();
  const month = /-(\d+)-/g.exec(date);

  if (month !== null) {
    return [year, Math.ceil(month[1] / 3)];
  } else {
    return [year, 0];
  }
}
