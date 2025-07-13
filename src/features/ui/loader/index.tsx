import React from 'react';

export class Loader extends React.Component {
  render() {
    return (
      <span className="before:animate-converge after:animate-converge relative block h-16 w-16 animate-spin overflow-hidden before:absolute before:top-1/2 before:left-1/2 before:block before:h-4 before:w-4 before:translate-x-[100%] before:transform-[translate(-50%,-50%)] before:rounded-full before:bg-black before:shadow-[-1rem_-1rem_0_black] after:absolute after:top-1/2 after:left-1/2 after:block after:h-4 after:w-4 after:translate-x-[-100%] after:transform-[translate(-50%,-50%)] after:rounded-full after:bg-black after:shadow-[1rem_1rem_0_black]"></span>
    );
  }
}
