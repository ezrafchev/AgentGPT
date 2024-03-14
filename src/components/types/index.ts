import type * as PropTypes from "./propTypes";

export { PropTypes };


declare module "./propTypes" {
  export * from "./propTypes";
}

declare module "*.props" {
  const value: any;
  export default value;
}


export type TextPropTypes = {
  children?: string | JSX.Element | JSX.Element[];
  className?: string;
};

export type ButtonPropTypes = {
  children?: string | JSX.Element | JSX.Element[];
  className?: string;
  onClick?: () => void;
};

// Add more prop types as needed
