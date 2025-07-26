import React from 'react';
import { Progress } from '../ui/progress';

const TimeLine = ({ progress }) => {
  return (
    <div className='m-4 w-auto'>
      <Progress value={progress} />
    </div>
  );
};

export default TimeLine;