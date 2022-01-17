interface PropTypes {
  width?: number;
  height?: number;
  className?: string;
  stroke?: string;
}

export default function Close(props: PropTypes) {
  const width = props.width || 24;
  const height = props.height || 24;
  const stroke = props.stroke || "#fffff";
  const classNames = props.className || "";
  return (
    <svg
      className={classNames}
      width={width}
      height={height}
      viewBox={`0 0 24 24`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.75 23.249L23.25 0.748993"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.25 23.249L0.75 0.748993"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
