import React, { useState, useEffect } from "react";
import useComments from "../../../context/commentsContext/useComments.js";
import { Image } from "cloudinary-react";
import noPhoto from "../../../img/noPhoto.png"

function DisplayComments() {
  const { state, getAllComments, allComments } = useComments();

  useEffect(() => {
    getAllComments();
  }, [state.comment]);


  return (
    <div>
      {allComments.map((item, idx) => {
        return (
          <div key={idx + "comment"}>
            {item.imgProfile === "no_photo" ? (
              <div >
                <img src={noPhoto} alt="user" className="w-25"/>
              </div>
            ) : (
              <div >
                <Image className="w-25"
                  cloudName="schoolgroupfinal"
                  publicId={item.imgProfile}
                />
              </div>
            )}
            <p>{item.username}</p>
            <p>{item.comment}</p>
            <p>{item.dateNow[0]}</p>
            <p>{item.dateNow[1]}</p>
          </div>
        );
      })}
    </div>
  );
}

export default DisplayComments;