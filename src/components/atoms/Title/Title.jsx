import React from 'react';

const Title = ({ text = "", ...props })  => {
  return (
    <h1 className='text-title' {...props}>
      {props.children}
    </h1>
  );
}

export default Title;