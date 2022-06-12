import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Uploadbutton from "./uploadbutton";

export const Features = (props) => {
  const changeSelectedFile = file => props.setSelectedFile(file);

  return (
    <div id='features' className='text-center'>
      <div className='container'>
        <div className='col-md-10 col-md-offset-1 section-title'>
          <h2>Features</h2>
        </div>
        <div className='row row_features'>
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.title}-${i}`} className='col-xs-6 col-md-3'>
                  {' '}
                  <i className={d.icon}></i>
                  <div style={{display: "flex", flexDirection : "column-reverse"}}>
                    <Link to="/graph" style={{marginTop: "10px"}}>
                      <div className="button">
                        <span style={{border: "0px solid #333", padding: "3px"}}>
                          Visualize data
                        </span>
                        
                      </div>
                    </Link>
                    <Uploadbutton link={"http://10.21.110.242:5000/"} changeSelectedFile={changeSelectedFile} />
                  </div>
                  {/* <p>{d.text}</p> */}
                </div>
              ))
            : 'Loading...'}
        </div>
      </div>
    </div>
  )
}
