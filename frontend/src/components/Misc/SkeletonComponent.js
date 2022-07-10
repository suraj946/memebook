import React from 'react';
import {Skeleton} from "@mui/material"

const SkeletonComponent = ({height, width}) => {
  return (
    <div>
        <Skeleton variant="rectangular" width={width} height={height} style={{margin:"10px 0"}} />
        <Skeleton variant="rectangular" width={width} height={height} style={{margin:"10px 0"}} />
        <Skeleton variant="rectangular" width={width} height={height} style={{margin:"10px 0"}} />
        <Skeleton variant="rectangular" width={width} height={height} style={{margin:"10px 0"}} />
        <Skeleton variant="rectangular" width={width} height={height} style={{margin:"10px 0"}} />
        <Skeleton variant="rectangular" width={width} height={height} style={{margin:"10px 0"}} />
        <Skeleton variant="rectangular" width={width} height={height} style={{margin:"10px 0"}} />
        <Skeleton variant="rectangular" width={width} height={height} style={{margin:"10px 0"}} />
        <Skeleton variant="rectangular" width={width} height={height} style={{margin:"10px 0"}} />
        <Skeleton variant="rectangular" width={width} height={height} style={{margin:"10px 0"}} />
        <Skeleton variant="rectangular" width={width} height={height} style={{margin:"10px 0"}} />
    </div>
  )
}

export default SkeletonComponent;